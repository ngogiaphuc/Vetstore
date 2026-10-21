package com.sporthub.repository;

import com.sporthub.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    Optional<Appointment> findByAppointmentCode(String appointmentCode);
    List<Appointment> findByCustomerIdOrderByAppointmentDateDescAppointmentTimeDesc(Long customerId);
    List<Appointment> findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(Long doctorId);
    List<Appointment> findByAppointmentDateOrderByAppointmentTimeAsc(LocalDate appointmentDate);
    List<Appointment> findByStatusOrderByAppointmentDateDesc(String status);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status")
    Long countByStatus(String status);
}

