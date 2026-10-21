package com.sporthub.service;

import com.sporthub.dto.request.MedicalRecordRequest;
import com.sporthub.dto.response.MedicalRecordResponse;
import com.sporthub.entity.Appointment;
import com.sporthub.entity.Doctor;
import com.sporthub.entity.MedicalRecord;
import com.sporthub.exception.ResourceNotFoundException;
import com.sporthub.repository.AppointmentRepository;
import com.sporthub.repository.DoctorRepository;
import com.sporthub.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;

    @Transactional
    public MedicalRecordResponse saveRecord(MedicalRecordRequest request, Long doctorUserId) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch hẹn"));

        Doctor doctor = null;
        if (doctorUserId != null) {
            doctor = doctorRepository.findByUserId(doctorUserId).orElse(appointment.getDoctor());
        }
        if (doctor == null) {
            doctor = appointment.getDoctor();
        }
        if (doctor == null) {
            List<Doctor> docs = doctorRepository.findAll();
            if (!docs.isEmpty()) doctor = docs.get(0);
        }

        MedicalRecord record = medicalRecordRepository.findByAppointmentId(appointment.getId())
                .orElse(new MedicalRecord());

        record.setAppointment(appointment);
        record.setPet(appointment.getPet());
        record.setDoctor(doctor);
        record.setSymptoms(request.getSymptoms());
        record.setDiagnosis(request.getDiagnosis());
        record.setTreatment(request.getTreatment());
        record.setPrescription(request.getPrescription());
        record.setDoctorNotes(request.getDoctorNotes());
        record.setReExaminationDate(request.getReExaminationDate());

        record = medicalRecordRepository.save(record);

        // Đánh dấu lịch hẹn đã hoàn thành khám
        appointment.setStatus("COMPLETED");
        appointmentRepository.save(appointment);

        return mapToResponse(record);
    }

    public MedicalRecordResponse getByAppointmentId(Long appointmentId) {
        MedicalRecord record = medicalRecordRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Chưa có bệnh án cho lịch hẹn này"));
        return mapToResponse(record);
    }

    public List<MedicalRecordResponse> getByPetId(Long petId) {
        return medicalRecordRepository.findByPetIdOrderByCreatedAtDesc(petId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private MedicalRecordResponse mapToResponse(MedicalRecord m) {
        return MedicalRecordResponse.builder()
                .id(m.getId())
                .appointmentId(m.getAppointment().getId())
                .appointmentCode(m.getAppointment().getAppointmentCode())
                .petId(m.getPet().getId())
                .petName(m.getPet().getName())
                .petSpecies(m.getPet().getSpecies())
                .doctorId(m.getDoctor() != null ? m.getDoctor().getId() : null)
                .doctorName(m.getDoctor() != null ? m.getDoctor().getFullName() : "Bác sĩ")
                .symptoms(m.getSymptoms())
                .diagnosis(m.getDiagnosis())
                .treatment(m.getTreatment())
                .prescription(m.getPrescription())
                .doctorNotes(m.getDoctorNotes())
                .reExaminationDate(m.getReExaminationDate())
                .createdAt(m.getCreatedAt())
                .build();
    }
}

