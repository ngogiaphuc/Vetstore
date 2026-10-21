package com.sporthub.seeder;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(1)
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final RoleSeeder roleSeeder;
    private final PermissionSeeder permissionSeeder;
    private final DevelopmentSeeder developmentSeeder;
    private final VetDataSeeder vetDataSeeder;

    @Override
    @Transactional
    public void run(String... args) {

        roleSeeder.seed();

        permissionSeeder.seed();

        developmentSeeder.seed();

        vetDataSeeder.seed();
    }
}
