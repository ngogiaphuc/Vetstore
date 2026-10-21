package com.sporthub.controller;

import com.sporthub.dto.request.VetServiceRequest;
import com.sporthub.entity.VetService;
import com.sporthub.service.VetServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class VetServiceController {

    private final VetServiceService vetServiceService;

    @GetMapping
    public ResponseEntity<List<VetService>> getAllServices(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(vetServiceService.getAllServices(category, search));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'VET')")
    public ResponseEntity<List<VetService>> getAllForAdmin() {
        return ResponseEntity.ok(vetServiceService.getAllForAdmin());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VetService> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(vetServiceService.getServiceById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public ResponseEntity<VetService> createService(@Valid @RequestBody VetServiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vetServiceService.createService(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public ResponseEntity<VetService> updateService(
            @PathVariable Long id,
            @Valid @RequestBody VetServiceRequest request) {
        return ResponseEntity.ok(vetServiceService.updateService(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        vetServiceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}

