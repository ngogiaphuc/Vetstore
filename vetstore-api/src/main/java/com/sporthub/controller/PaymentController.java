package com.sporthub.controller;

import com.sporthub.entity.Payment;
import com.sporthub.repository.PaymentRepository;
import com.sporthub.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPayService vnPayService;
    private final PaymentRepository paymentRepository;

    @PostMapping("/create-vnpay-url")
    public ResponseEntity<Map<String, String>> createPaymentUrl(
            @RequestBody Map<String, Long> request,
            HttpServletRequest httpServletRequest) {
        Long appointmentId = request.get("appointmentId");
        String ipAddress = httpServletRequest.getRemoteAddr();
        String paymentUrl = vnPayService.createPaymentUrl(appointmentId, ipAddress);
        return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<Map<String, Object>> vnpayReturn(
            @RequestParam Map<String, String> allParams) {
        Map<String, Object> result = vnPayService.processReturn(allParams);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAllByOrderByPaymentTimeDesc());
    }
}

