package com.sporthub.service;

import com.sporthub.dto.request.CourtRequest;
import com.sporthub.dto.response.CourtResponse;
import com.sporthub.dto.response.CourtSummaryDto;
import com.sporthub.entity.Court;
import com.sporthub.entity.Sport;
import com.sporthub.entity.Venue;
import com.sporthub.exception.ForbiddenException;
import com.sporthub.exception.ResourceNotFoundException;
import com.sporthub.repository.CourtRepository;
import com.sporthub.repository.SportRepository;
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
public class CourtService {

    private final CourtRepository courtRepository;
    private final VenueRepository venueRepository;
    private final SportRepository sportRepository;

    @Transactional(readOnly = true)
    public Page<CourtResponse> searchCourts(
            String keyword, Long sportId, Long venueId,
            String status, int page, int size,
            String sortBy, String direction) {

        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return courtRepository
                .search(keyword, sportId, venueId, status, pageable)
                .map(this::toCourtResponse);
    }

    @Transactional(readOnly = true)
    public Page<CourtSummaryDto> searchCourtSummaries(
            String keyword, Long sportId, Long venueId,
            String status, int page, int size,
            String sortBy, String direction) {

        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return courtRepository
                .search(keyword, sportId, venueId, status, pageable)
                .map(this::toCourtSummaryDto);
    }

    @Transactional(readOnly = true)
    public Page<CourtResponse> searchCourtsByOwner(
            Long ownerId, String keyword, Long sportId,
            Long venueId, String status, int page, int size,
            String sortBy, String direction) {

        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return courtRepository.searchByOwner(
                        ownerId, keyword, sportId, venueId,
                        status, pageable)
                .map(this::toCourtResponse);
    }

    @Transactional(readOnly = true)
    public CourtResponse getCourtById(Long id) {

        Court court = courtRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy court có id = " + id
                        )
                );

        return toCourtResponse(court);
    }

    @Transactional(readOnly = true)
    public CourtSummaryDto getCourtSummary(Long id) {

        Court court = courtRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy court có id = " + id
                        )
                );

        return toCourtSummaryDto(court);
    }

    @Transactional
    public CourtResponse createCourt(
            Long ownerId, CourtRequest request) {

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy venue có id = "
                                        + request.getVenueId()
                        )
                );

        if (!venue.getOwner().getId().equals(ownerId)) {
            throw new ForbiddenException(
                    "Bạn không có quyền tạo court trong venue này"
            );
        }

        Sport sport = sportRepository.findById(request.getSportId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy sport có id = "
                                        + request.getSportId()
                        )
                );

        Court court = new Court();

        court.setVenue(venue);
        court.setSport(sport);
        court.setName(request.getName());
        court.setDescription(request.getDescription());
        court.setImageUrl(request.getImageUrl());
        court.setCourtType(request.getCourtType());
        court.setCapacity(request.getCapacity());

        court = courtRepository.save(court);

        return toCourtResponse(court);
    }

    @Transactional
    public CourtResponse updateCourt(
            Long ownerId, Long courtId, CourtRequest request) {

        Court court = courtRepository.findById(courtId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy court có id = " + courtId
                        )
                );

        if (!court.getVenue().getOwner().getId().equals(ownerId)) {
            throw new ForbiddenException(
                    "Bạn không có quyền sửa court này"
            );
        }

        if (!court.getVenue().getId().equals(request.getVenueId())) {

            Venue newVenue = venueRepository
                    .findById(request.getVenueId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Không tìm thấy venue có id = "
                                            + request.getVenueId()
                            )
                    );

            if (!newVenue.getOwner().getId().equals(ownerId)) {
                throw new ForbiddenException(
                        "Bạn không có quyền chuyển court sang venue này"
                );
            }

            court.setVenue(newVenue);
        }

        Sport sport = sportRepository.findById(request.getSportId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy sport có id = "
                                        + request.getSportId()
                        )
                );

        court.setSport(sport);
        court.setName(request.getName());
        court.setDescription(request.getDescription());
        court.setImageUrl(request.getImageUrl());
        court.setCourtType(request.getCourtType());
        court.setCapacity(request.getCapacity());

        court = courtRepository.save(court);

        return toCourtResponse(court);
    }

    private CourtResponse toCourtResponse(Court court) {

        return new CourtResponse(
                court.getId(),
                court.getVenue().getId(),
                court.getVenue().getName(),
                court.getSport().getId(),
                court.getSport().getName(),
                court.getName(),
                court.getDescription(),
                court.getImageUrl(),
                court.getCourtType(),
                court.getCapacity(),
                court.getStatus(),
                court.getCreatedAt(),
                court.getUpdatedAt()
        );
    }

    private CourtSummaryDto toCourtSummaryDto(Court court) {

        return new CourtSummaryDto(
                court.getId(),
                court.getName(),
                court.getVenue().getId(),
                court.getSport().getId()
        );
    }
}
