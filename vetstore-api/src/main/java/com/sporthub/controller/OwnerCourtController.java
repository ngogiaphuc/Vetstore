package com.sporthub.controller;

import com.sporthub.dto.request.CourtPriceRequest;
import com.sporthub.dto.request.CourtRequest;
import com.sporthub.dto.request.CourtScheduleRequest;
import com.sporthub.dto.request.VenueRequest;
import com.sporthub.dto.response.CourtPriceResponse;
import com.sporthub.dto.response.CourtResponse;
import com.sporthub.dto.response.CourtScheduleResponse;
import com.sporthub.dto.response.VenueResponse;
import com.sporthub.security.AuthHelper;
import com.sporthub.service.CourtPriceService;
import com.sporthub.service.CourtScheduleService;
import com.sporthub.service.CourtService;
import com.sporthub.service.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
public class OwnerCourtController {

    private final VenueService venueService;
    private final CourtService courtService;
    private final CourtScheduleService scheduleService;
    private final CourtPriceService priceService;
    private final AuthHelper authHelper;

    @GetMapping("/venues")
    @PreAuthorize(
        "hasAuthority(T(com.sporthub.constant.Permissions).CREATE_VENUE)"
    )
    public ResponseEntity<Page<VenueResponse>> getMyVenues(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size) {

        Long ownerId = authHelper.getCurrentUserId();

        return ResponseEntity.ok(
                venueService.getVenuesByOwner(ownerId, page, size)
        );
    }

    @PostMapping("/venues")
    @PreAuthorize(
        "hasAuthority(T(com.sporthub.constant.Permissions).CREATE_VENUE)"
    )
    public ResponseEntity<VenueResponse> createVenue(
            @Valid @RequestBody VenueRequest request) {

        Long ownerId = authHelper.getCurrentUserId();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(venueService.createVenue(ownerId, request));
    }

    @PutMapping("/venues/{id}")
    @PreAuthorize(
        "hasAuthority(T(com.sporthub.constant.Permissions).UPDATE_OWN_VENUE)"
    )
    public ResponseEntity<VenueResponse> updateVenue(
            @PathVariable Long id,
            @Valid @RequestBody VenueRequest request) {

        Long ownerId = authHelper.getCurrentUserId();

        return ResponseEntity.ok(
                venueService.updateVenue(ownerId, id, request)
        );
    }

    @GetMapping("/courts")
    @PreAuthorize(
        "hasAuthority(T(com.sporthub.constant.Permissions).MANAGE_OWN_COURTS)"
    )
    public ResponseEntity<Page<CourtResponse>> getMyCourts(

            @RequestParam(defaultValue = "")
            String keyword,

            @RequestParam(required = false)
            Long sportId,

            @RequestParam(required = false)
            Long venueId,

            @RequestParam(required = false)
            String status,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "id")
            String sortBy,

            @RequestParam(defaultValue = "desc")
            String direction) {

        Long ownerId = authHelper.getCurrentUserId();

        return ResponseEntity.ok(
                courtService.searchCourtsByOwner(
                        ownerId, keyword, sportId, venueId,
                        status, page, size, sortBy, direction
                )
        );
    }

    @PostMapping("/courts")
    @PreAuthorize(
        "hasAuthority(T(com.sporthub.constant.Permissions).MANAGE_OWN_COURTS)"
    )
    public ResponseEntity<CourtResponse> createCourt(
            @Valid @RequestBody CourtRequest request) {

        Long ownerId = authHelper.getCurrentUserId();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(courtService.createCourt(ownerId, request));
    }

    @PutMapping("/courts/{id}")
    @PreAuthorize(
        "hasAuthority(T(com.sporthub.constant.Permissions).MANAGE_OWN_COURTS)"
    )
    public ResponseEntity<CourtResponse> updateCourt(
            @PathVariable Long id,
            @Valid @RequestBody CourtRequest request) {

        Long ownerId = authHelper.getCurrentUserId();

        return ResponseEntity.ok(
                courtService.updateCourt(ownerId, id, request)
        );
    }

    @GetMapping("/courts/{id}/schedule")
    @PreAuthorize(
        "hasAuthority(T(com.sporthub.constant.Permissions).MANAGE_OWN_COURTS)"
    )
    public ResponseEntity<List<CourtScheduleResponse>> getSchedule(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                scheduleService.getSchedules(id)
        );
    }

    @PutMapping("/courts/{id}/schedule")
    @PreAuthorize(
        "hasAuthority(T(com.sporthub.constant.Permissions).MANAGE_OWN_COURTS)"
    )
    public ResponseEntity<List<CourtScheduleResponse>> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody List<CourtScheduleRequest> requests) {

        Long ownerId = authHelper.getCurrentUserId();

        return ResponseEntity.ok(
                scheduleService.updateSchedules(ownerId, id, requests)
        );
    }

    @GetMapping("/courts/{id}/prices")
    @PreAuthorize(
        "hasAuthority(T(com.sporthub.constant.Permissions).MANAGE_OWN_COURTS)"
    )
    public ResponseEntity<List<CourtPriceResponse>> getPrices(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                priceService.getPrices(id)
        );
    }

    @PutMapping("/courts/{id}/prices")
    @PreAuthorize(
        "hasAuthority(T(com.sporthub.constant.Permissions).MANAGE_OWN_COURTS)"
    )
    public ResponseEntity<List<CourtPriceResponse>> updatePrices(
            @PathVariable Long id,
            @Valid @RequestBody List<CourtPriceRequest> requests) {

        Long ownerId = authHelper.getCurrentUserId();

        return ResponseEntity.ok(
                priceService.updatePrices(ownerId, id, requests)
        );
    }
}
