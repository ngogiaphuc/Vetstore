package com.sporthub.repository;

import com.sporthub.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByAppointmentId(Long appointmentId);
    Optional<Payment> findByTransactionNo(String transactionNo);
    List<Payment> findAllByOrderByPaymentTimeDesc();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'SUCCESS'")
    BigDecimal calculateTotalRevenue();
}

