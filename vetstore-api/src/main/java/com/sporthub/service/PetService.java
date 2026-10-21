package com.sporthub.service;

import com.sporthub.dto.request.PetRequest;
import com.sporthub.dto.response.PetResponse;
import com.sporthub.entity.Pet;
import com.sporthub.entity.User;
import com.sporthub.exception.ForbiddenException;
import com.sporthub.exception.ResourceNotFoundException;
import com.sporthub.repository.PetRepository;
import com.sporthub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;

    @Transactional
    public PetResponse createPet(PetRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        Pet pet = new Pet();
        pet.setName(request.getName());
        pet.setSpecies(request.getSpecies());
        pet.setBreed(request.getBreed());
        pet.setAge(request.getAge());
        pet.setWeight(request.getWeight());
        pet.setGender(request.getGender());
        pet.setNotes(request.getNotes());
        pet.setImageUrl(request.getImageUrl());
        pet.setOwner(user);

        pet = petRepository.save(pet);
        return mapToResponse(pet);
    }

    public List<PetResponse> getPetsByUser(Long userId) {
        return petRepository.findByOwnerIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public PetResponse getPetById(Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thú cưng"));
        return mapToResponse(pet);
    }

    @Transactional
    public PetResponse updatePet(Long petId, PetRequest request, Long userId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thú cưng"));

        if (!pet.getOwner().getId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền sửa thông tin thú cưng này");
        }

        pet.setName(request.getName());
        pet.setSpecies(request.getSpecies());
        pet.setBreed(request.getBreed());
        pet.setAge(request.getAge());
        pet.setWeight(request.getWeight());
        pet.setGender(request.getGender());
        pet.setNotes(request.getNotes());
        if (request.getImageUrl() != null) {
            pet.setImageUrl(request.getImageUrl());
        }

        pet = petRepository.save(pet);
        return mapToResponse(pet);
    }

    @Transactional
    public void deletePet(Long petId, Long userId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thú cưng"));

        if (!pet.getOwner().getId().equals(userId)) {
            throw new ForbiddenException("Bạn không có quyền xóa thú cưng này");
        }

        petRepository.delete(pet);
    }

    private PetResponse mapToResponse(Pet pet) {
        String ownerName = pet.getOwner().getProfile() != null 
                ? pet.getOwner().getProfile().getFullName() 
                : pet.getOwner().getUsername();

        return PetResponse.builder()
                .id(pet.getId())
                .name(pet.getName())
                .species(pet.getSpecies())
                .breed(pet.getBreed())
                .age(pet.getAge())
                .weight(pet.getWeight())
                .gender(pet.getGender())
                .notes(pet.getNotes())
                .imageUrl(pet.getImageUrl())
                .ownerId(pet.getOwner().getId())
                .ownerName(ownerName)
                .createdAt(pet.getCreatedAt())
                .build();
    }
}

