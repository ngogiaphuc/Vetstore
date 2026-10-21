package com.sporthub.controller;

import com.sporthub.repository.AppointmentRepository;
import com.sporthub.repository.PaymentRepository;
import com.sporthub.repository.PetRepository;
import com.sporthub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'VET')")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalAppointments = appointmentRepository.count();
        long completedAppointments = appointmentRepository.countByStatus("COMPLETED");
        long pendingAppointments = appointmentRepository.countByStatus("PENDING");
        long confirmedAppointments = appointmentRepository.countByStatus("CONFIRMED");
        long totalPets = petRepository.count();
        long totalUsers = userRepository.count();
        BigDecimal totalRevenue = paymentRepository.calculateTotalRevenue();

        stats.put("totalAppointments", totalAppointments);
        stats.put("completedAppointments", completedAppointments);
        stats.put("pendingAppointments", pendingAppointments);
        stats.put("confirmedAppointments", confirmedAppointments);
        stats.put("totalPets", totalPets);
        stats.put("totalUsers", totalUsers);
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);

        return ResponseEntity.ok(stats);
    }
}

