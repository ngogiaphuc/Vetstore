package com.sporthub.controller;

import com.sporthub.dto.response.CourtResponse;
import com.sporthub.dto.response.CourtSummaryDto;
import com.sporthub.service.CourtService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courts")
@RequiredArgsConstructor
public class CourtController {

    private final CourtService courtService;

    @GetMapping
    public ResponseEntity<Page<CourtResponse>> getCourts(

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

        return ResponseEntity.ok(
                courtService.searchCourts(
                        keyword, sportId, venueId, status,
                        page, size, sortBy, direction
                )
        );
    }

    @GetMapping("/summaries")
    public ResponseEntity<Page<CourtSummaryDto>> getCourtSummaries(

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

        return ResponseEntity.ok(
                courtService.searchCourtSummaries(
                        keyword, sportId, venueId, status,
                        page, size, sortBy, direction
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourtResponse> getCourtById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                courtService.getCourtById(id)
        );
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<CourtSummaryDto> getCourtSummary(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                courtService.getCourtSummary(id)
        );
    }
}
