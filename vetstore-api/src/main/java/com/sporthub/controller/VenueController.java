package com.sporthub.controller;

import com.sporthub.dto.response.VenueResponse;
import com.sporthub.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @GetMapping
    public ResponseEntity<Page<VenueResponse>> getVenues(

            @RequestParam(defaultValue = "")
            String keyword,

            @RequestParam(required = false)
            String city,

            @RequestParam(required = false)
            String district,

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

        return ResponseEntity.ok(
                venueService.searchVenues(
                        keyword, city, district, status,
                        page, size, sortBy, direction
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<VenueResponse> getVenueById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                venueService.getVenueById(id)
        );
    }
}
