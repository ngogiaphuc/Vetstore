package com.sporthub.service;

import com.sporthub.entity.Doctor;
import com.sporthub.exception.ResourceNotFoundException;
import com.sporthub.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public List<Doctor> getAvailableDoctors() {
        return doctorRepository.findByIsAvailableTrue();
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bác sĩ ID: " + id));
    }

    public Doctor getDoctorByUserId(Long userId) {
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bác sĩ tương ứng tài khoản"));
    }
}

