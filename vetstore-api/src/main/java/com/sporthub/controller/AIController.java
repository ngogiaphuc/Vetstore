package com.sporthub.controller;

import com.sporthub.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/consultation")
    public ResponseEntity<Map<String, String>> consult(
            @RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        String petInfo = request.get("petInfo");
        String answer = aiService.consult(prompt, petInfo);
        return ResponseEntity.ok(Map.of("response", answer));
    }
}

