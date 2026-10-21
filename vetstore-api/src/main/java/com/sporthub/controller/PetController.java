package com.sporthub.controller;

import com.sporthub.dto.request.PetRequest;
import com.sporthub.dto.response.PetResponse;
import com.sporthub.security.AuthHelper;
import com.sporthub.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;
    private final AuthHelper authHelper;

    @GetMapping
    public ResponseEntity<List<PetResponse>> getMyPets() {
        Long userId = authHelper.getCurrentUserId();
        return ResponseEntity.ok(petService.getPetsByUser(userId));
    }

    @PostMapping
    public ResponseEntity<PetResponse> createPet(@Valid @RequestBody PetRequest request) {
        Long userId = authHelper.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(petService.createPet(request, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetResponse> getPetById(@PathVariable Long id) {
        return ResponseEntity.ok(petService.getPetById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetResponse> updatePet(
            @PathVariable Long id,
            @Valid @RequestBody PetRequest request) {
        Long userId = authHelper.getCurrentUserId();
        return ResponseEntity.ok(petService.updatePet(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        Long userId = authHelper.getCurrentUserId();
        petService.deletePet(id, userId);
        return ResponseEntity.noContent().build();
    }
}

