package com.sporthub.service;

import com.sporthub.dto.request.VetServiceRequest;
import com.sporthub.entity.VetService;
import com.sporthub.exception.ResourceNotFoundException;
import com.sporthub.repository.VetServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VetServiceService {

    private final VetServiceRepository vetServiceRepository;

    public List<VetService> getAllServices(String category, String search) {
        if (category != null && !category.isBlank()) {
            return vetServiceRepository.findByCategoryAndStatus(category, "ACTIVE");
        }
        if (search != null && !search.isBlank()) {
            return vetServiceRepository.findByNameContainingIgnoreCase(search);
        }
        return vetServiceRepository.findByStatus("ACTIVE");
    }

    public List<VetService> getAllForAdmin() {
        return vetServiceRepository.findAll();
    }

    public VetService getServiceById(Long id) {
        return vetServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy dịch vụ ID: " + id));
    }

    @Transactional
    public VetService createService(VetServiceRequest request) {
        VetService service = new VetService();
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setCategory(request.getCategory());
        service.setImageUrl(request.getImageUrl());
        service.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        return vetServiceRepository.save(service);
    }

    @Transactional
    public VetService updateService(Long id, VetServiceRequest request) {
        VetService service = getServiceById(id);
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setCategory(request.getCategory());
        if (request.getImageUrl() != null) {
            service.setImageUrl(request.getImageUrl());
        }
        if (request.getStatus() != null) {
            service.setStatus(request.getStatus());
        }
        return vetServiceRepository.save(service);
    }

    @Transactional
    public void deleteService(Long id) {
        VetService service = getServiceById(id);
        service.setStatus("INACTIVE");
        vetServiceRepository.save(service);
    }
}

