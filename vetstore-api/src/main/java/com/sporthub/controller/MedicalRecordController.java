package com.sporthub.controller;

import com.sporthub.dto.request.MedicalRecordRequest;
import com.sporthub.dto.response.MedicalRecordResponse;
import com.sporthub.security.AuthHelper;
import com.sporthub.service.MedicalRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;
    private final AuthHelper authHelper;

    @PostMapping
    @PreAuthorize("hasAnyRole('VET', 'ADMIN', 'OWNER')")
    public ResponseEntity<MedicalRecordResponse> saveRecord(
            @Valid @RequestBody MedicalRecordRequest request) {
        Long doctorUserId = authHelper.getCurrentUserId();
        return ResponseEntity.ok(medicalRecordService.saveRecord(request, doctorUserId));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<MedicalRecordResponse> getByAppointmentId(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(medicalRecordService.getByAppointmentId(appointmentId));
    }

    @GetMapping("/pet/{petId}")
    public ResponseEntity<List<MedicalRecordResponse>> getByPetId(@PathVariable Long petId) {
        return ResponseEntity.ok(medicalRecordService.getByPetId(petId));
    }
}

