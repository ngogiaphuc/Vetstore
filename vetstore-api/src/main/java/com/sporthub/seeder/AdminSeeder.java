package com.sporthub.seeder;

import com.sporthub.constant.Roles;
import com.sporthub.entity.Role;
import com.sporthub.entity.User;
import com.sporthub.entity.UserProfile;
import com.sporthub.entity.UserRole;
import com.sporthub.entity.UserRoleId;
import com.sporthub.enums.UserStatus;
import com.sporthub.repository.RoleRepository;
import com.sporthub.repository.UserRepository;
import com.sporthub.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(2)
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {

        if (userRepository.existsByUsername("admin")) {
            log.info("Admin account already exists, skipping.");
            return;
        }

        log.info("Creating default Admin account...");

        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@sporthub.com");
        admin.setPasswordHash(passwordEncoder.encode("Admin123!"));
        admin.setStatus(UserStatus.ACTIVE);

        UserProfile profile = new UserProfile();
        profile.setFullName("System Administrator");
        profile.setUser(admin);
        admin.setProfile(profile);

        admin = userRepository.save(admin);

        Role adminRole = roleRepository.findByName(Roles.ADMIN)
                .orElseThrow(() -> new RuntimeException("Role ADMIN not found"));

        UserRole userRole = new UserRole();
        userRole.setId(new UserRoleId(admin.getId(), adminRole.getId()));
        userRole.setUser(admin);
        userRole.setRole(adminRole);

        userRoleRepository.save(userRole);

        log.info("Default Admin account created successfully! Username: admin, Password: Admin123!");
    }
}
