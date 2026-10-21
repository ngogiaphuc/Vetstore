package com.sporthub.service;

import com.sporthub.dto.request.AppointmentRequest;
import com.sporthub.dto.response.AppointmentResponse;
import com.sporthub.entity.*;
import com.sporthub.exception.ForbiddenException;
import com.sporthub.exception.ResourceNotFoundException;
import com.sporthub.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final VetServiceRepository vetServiceRepository;
    private final DoctorRepository doctorRepository;
    private final EmailService emailService;

    @Transactional
    public AppointmentResponse createAppointment(AppointmentRequest request, Long userId) {
        User customer = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng"));

        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thú cưng"));

        VetService service = vetServiceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy dịch vụ"));

        Doctor doctor = null;
        if (request.getDoctorId() != null) {
            doctor = doctorRepository.findById(request.getDoctorId()).orElse(null);
        } else {
            // Tự động phân công bác sĩ khả dụng đầu tiên nếu người dùng không chọn
            List<Doctor> doctors = doctorRepository.findByIsAvailableTrue();
            if (!doctors.isEmpty()) {
                doctor = doctors.get(0);
            }
        }

        String datePrefix = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomSuffix = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        String appointmentCode = "VET-" + datePrefix + "-" + randomSuffix;

        Appointment appointment = new Appointment();
        appointment.setAppointmentCode(appointmentCode);
        appointment.setCustomer(customer);
        appointment.setPet(pet);
        appointment.setDoctor(doctor);
        appointment.setService(service);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setStatus("PENDING");
        appointment.setNotes(request.getNotes());
        appointment.setTotalAmount(service.getPrice());
        appointment.setPaymentStatus("UNPAID");

        appointment = appointmentRepository.save(appointment);

        // Gửi email xác nhận
        try {
            emailService.sendAppointmentConfirmation(appointment);
        } catch (Exception ex) {
            log.warn("Không thể gửi email xác nhận: {}", ex.getMessage());
        }

        return mapToResponse(appointment);
    }

    public List<AppointmentResponse> getAppointmentsByUser(Long userId) {
        return appointmentRepository.findByCustomerIdOrderByAppointmentDateDescAppointmentTimeDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<AppointmentResponse> getAppointmentsByDoctorUser(Long doctorUserId) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Bác sĩ không tồn tại"));
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(doctor.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AppointmentResponse getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch hẹn ID: " + id));
        return mapToResponse(appointment);
    }

    @Transactional
    public AppointmentResponse updateStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch hẹn ID: " + id));
        appointment.setStatus(status.toUpperCase());
        return mapToResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse cancelAppointment(Long id, Long userId) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch hẹn ID: " + id));

        if (!appointment.getCustomer().getId().equals(userId)) {
            throw new ForbiddenException("Bạn không thể hủy lịch hẹn của người khác");
        }

        appointment.setStatus("CANCELLED");
        return mapToResponse(appointmentRepository.save(appointment));
    }

    private AppointmentResponse mapToResponse(Appointment a) {
        String customerName = a.getCustomer().getProfile() != null 
                ? a.getCustomer().getProfile().getFullName() 
                : a.getCustomer().getUsername();

        String customerPhone = a.getCustomer().getProfile() != null 
                ? a.getCustomer().getProfile().getPhone() 
                : "";

        return AppointmentResponse.builder()
                .id(a.getId())
                .appointmentCode(a.getAppointmentCode())
                .customerId(a.getCustomer().getId())
                .customerName(customerName)
                .customerPhone(customerPhone)
                .petId(a.getPet().getId())
                .petName(a.getPet().getName())
                .petSpecies(a.getPet().getSpecies())
                .doctorId(a.getDoctor() != null ? a.getDoctor().getId() : null)
                .doctorName(a.getDoctor() != null ? a.getDoctor().getFullName() : "Chưa chỉ định")
                .serviceId(a.getService().getId())
                .serviceName(a.getService().getName())
                .appointmentDate(a.getAppointmentDate())
                .appointmentTime(a.getAppointmentTime())
                .status(a.getStatus())
                .notes(a.getNotes())
                .totalAmount(a.getTotalAmount())
                .paymentStatus(a.getPaymentStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }
}

