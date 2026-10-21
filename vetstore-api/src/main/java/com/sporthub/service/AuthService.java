package com.sporthub.service;

import com.sporthub.constant.Roles;
import com.sporthub.dto.request.GoogleLoginRequest;
import com.sporthub.dto.request.LoginRequest;
import com.sporthub.dto.request.RegisterRequest;
import com.sporthub.dto.response.LoginResponse;
import com.sporthub.dto.response.RegisterResponse;
import com.sporthub.entity.Role;
import com.sporthub.entity.User;
import com.sporthub.entity.UserProfile;
import com.sporthub.entity.UserRole;
import com.sporthub.entity.UserRoleId;
import com.sporthub.enums.UserStatus;
import com.sporthub.exception.ConflictException;
import com.sporthub.repository.RoleRepository;
import com.sporthub.repository.UserRepository;
import com.sporthub.repository.UserRoleRepository;
import com.sporthub.security.CustomUserDetailsService;
import com.sporthub.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       UserRoleRepository userRoleRepository,
                       AuthenticationManager authenticationManager,
                       CustomUserDetailsService userDetailsService,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    // Constructor for unit tests
    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       UserRoleRepository userRoleRepository,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this(userRepository, roleRepository, userRoleRepository, authenticationManager, null, jwtService, passwordEncoder);
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Username đã tồn tại");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email đã tồn tại");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.ACTIVE);

        UserProfile profile = new UserProfile();
        profile.setFullName(request.getFullName());
        profile.setUser(user);
        user.setProfile(profile);

        user = userRepository.save(user);

        Role userRole = roleRepository.findByName(Roles.USER)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role USER"));

        UserRole userRoleEntity = new UserRole();
        userRoleEntity.setId(new UserRoleId(user.getId(), userRole.getId()));
        userRoleEntity.setUser(user);
        userRoleEntity.setRole(userRole);
        userRoleRepository.save(userRoleEntity);

        return new RegisterResponse(user.getId(), user.getUsername(), user.getEmail(), user.getProfile().getFullName());
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        List<String> authorities = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
        List<String> roles = authorities.stream().filter(a -> a.startsWith("ROLE_")).toList();
        List<String> permissions = authorities.stream().filter(a -> !a.startsWith("ROLE_")).toList();

        String accessToken = jwtService.generateToken(userDetails, user.getId(), user.getEmail());

        return new LoginResponse(accessToken, "Bearer", user.getId(), userDetails.getUsername(), roles, permissions);
    }

    @Transactional
    public LoginResponse loginWithGoogle(GoogleLoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            String baseUsername = email.contains("@") ? email.substring(0, email.indexOf("@")) : email;
            String username = baseUsername;
            int counter = 1;
            while (userRepository.existsByUsername(username)) {
                username = baseUsername + counter++;
            }

            user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setStatus(UserStatus.ACTIVE);

            UserProfile profile = new UserProfile();
            profile.setFullName(request.getName() != null && !request.getName().isBlank() ? request.getName() : baseUsername);
            profile.setAvatarUrl(request.getAvatarUrl());
            profile.setUser(user);
            user.setProfile(profile);

            user = userRepository.save(user);

            Role userRole = roleRepository.findByName(Roles.USER)
                    .orElseGet(() -> {
                        Role r = new Role();
                        r.setName(Roles.USER);
                        return roleRepository.save(r);
                    });

            UserRole userRoleEntity = new UserRole();
            userRoleEntity.setId(new UserRoleId(user.getId(), userRole.getId()));
            userRoleEntity.setUser(user);
            userRoleEntity.setRole(userRole);
            userRoleRepository.save(userRoleEntity);
        }

        UserDetails userDetails = userDetailsService != null 
                ? userDetailsService.loadUserByUsername(user.getUsername())
                : new org.springframework.security.core.userdetails.User(user.getUsername(), "", List.of());

        List<String> authorities = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
        List<String> roles = authorities.stream().filter(a -> a.startsWith("ROLE_")).toList();
        List<String> permissions = authorities.stream().filter(a -> !a.startsWith("ROLE_")).toList();

        String accessToken = jwtService.generateToken(userDetails, user.getId(), user.getEmail());

        return new LoginResponse(accessToken, "Bearer", user.getId(), user.getUsername(), roles, permissions);
    }
}
