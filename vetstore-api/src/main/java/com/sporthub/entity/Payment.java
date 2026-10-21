package com.sporthub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_method", nullable = false, length = 30)
    private String paymentMethod = "VNPAY"; // VNPAY, CASH

    @Column(name = "transaction_no", length = 100)
    private String transactionNo; // Mã GD của VNPay (vnp_TransactionNo)

    @Column(name = "bank_code", length = 50)
    private String bankCode; // Ngân hàng (NCB, VCB, MB, ...)

    @Column(name = "order_info", length = 255)
    private String orderInfo;

    @Column(nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, SUCCESS, FAILED

    @Column(name = "payment_time")
    private LocalDateTime paymentTime = LocalDateTime.now();
}

