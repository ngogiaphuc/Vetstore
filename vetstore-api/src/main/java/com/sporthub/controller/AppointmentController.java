package com.sporthub.controller;

import com.sporthub.dto.request.AppointmentRequest;
import com.sporthub.dto.response.AppointmentResponse;
import com.sporthub.security.AuthHelper;
import com.sporthub.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AuthHelper authHelper;

    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(
            @Valid @RequestBody AppointmentRequest request) {
        Long userId = authHelper.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(appointmentService.createAppointment(request, userId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments() {
        Long userId = authHelper.getCurrentUserId();
        return ResponseEntity.ok(appointmentService.getAppointmentsByUser(userId));
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasAnyRole('VET', 'OWNER', 'ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> getDoctorAppointments() {
        Long userId = authHelper.getCurrentUserId();
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorUser(userId));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'VET')")
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'VET')")
    public ResponseEntity<AppointmentResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponse> cancelAppointment(@PathVariable Long id) {
        Long userId = authHelper.getCurrentUserId();
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, userId));
    }
}

