package com.sporthub.service;

import com.sporthub.dto.request.VenueRequest;
import com.sporthub.dto.response.VenueResponse;
import com.sporthub.entity.User;
import com.sporthub.entity.Venue;
import com.sporthub.exception.ForbiddenException;
import com.sporthub.exception.ResourceNotFoundException;
import com.sporthub.repository.UserRepository;
import com.sporthub.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<VenueResponse> searchVenues(
            String keyword, String city, String district,
            String status, int page, int size,
            String sortBy, String direction) {

        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return venueRepository
                .search(keyword, city, district, status, pageable)
                .map(this::toVenueResponse);
    }

    @Transactional(readOnly = true)
    public VenueResponse getVenueById(Long id) {

        Venue venue = venueRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy venue có id = " + id
                        )
                );

        return toVenueResponse(venue);
    }

    @Transactional(readOnly = true)
    public Page<VenueResponse> getVenuesByOwner(
            Long ownerId, int page, int size) {

        Pageable pageable = PageRequest.of(
                page, size, Sort.by("id").descending());

        return venueRepository.findByOwnerId(ownerId, pageable)
                .map(this::toVenueResponse);
    }

    @Transactional
    public VenueResponse createVenue(
            Long ownerId, VenueRequest request) {

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy user có id = " + ownerId
                        )
                );

        Venue venue = new Venue();

        venue.setOwner(owner);
        venue.setName(request.getName());
        venue.setDescription(request.getDescription());
        venue.setImageUrl(request.getImageUrl());
        venue.setAddress(request.getAddress());
        venue.setWard(request.getWard());
        venue.setDistrict(request.getDistrict());
        venue.setCity(request.getCity());
        venue.setLatitude(request.getLatitude());
        venue.setLongitude(request.getLongitude());
        venue.setPhone(request.getPhone());
        venue.setOpenTime(request.getOpenTime());
        venue.setCloseTime(request.getCloseTime());

        venue = venueRepository.save(venue);

        return toVenueResponse(venue);
    }

    @Transactional
    public VenueResponse updateVenue(
            Long ownerId, Long venueId, VenueRequest request) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy venue có id = " + venueId
                        )
                );

        if (!venue.getOwner().getId().equals(ownerId)) {
            throw new ForbiddenException(
                    "Bạn không có quyền sửa venue này"
            );
        }

        venue.setName(request.getName());
        venue.setDescription(request.getDescription());
        venue.setImageUrl(request.getImageUrl());
        venue.setAddress(request.getAddress());
        venue.setWard(request.getWard());
        venue.setDistrict(request.getDistrict());
        venue.setCity(request.getCity());
        venue.setLatitude(request.getLatitude());
        venue.setLongitude(request.getLongitude());
        venue.setPhone(request.getPhone());
        venue.setOpenTime(request.getOpenTime());
        venue.setCloseTime(request.getCloseTime());

        venue = venueRepository.save(venue);

        return toVenueResponse(venue);
    }

    private VenueResponse toVenueResponse(Venue venue) {

        return new VenueResponse(
                venue.getId(),
                venue.getOwner().getId(),
                venue.getOwner().getUsername(),
                venue.getName(),
                venue.getDescription(),
                venue.getImageUrl(),
                venue.getAddress(),
                venue.getWard(),
                venue.getDistrict(),
                venue.getCity(),
                venue.getLatitude(),
                venue.getLongitude(),
                venue.getPhone(),
                venue.getOpenTime(),
                venue.getCloseTime(),
                venue.getStatus(),
                venue.getCreatedAt(),
                venue.getUpdatedAt()
        );
    }
}
