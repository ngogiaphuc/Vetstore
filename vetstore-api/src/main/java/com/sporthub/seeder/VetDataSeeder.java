package com.sporthub.seeder;

import com.sporthub.constant.Roles;
import com.sporthub.entity.*;
import com.sporthub.enums.UserStatus;
import com.sporthub.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class VetDataSeeder {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final VetServiceRepository vetServiceRepository;
    private final DoctorRepository doctorRepository;
    private final PetRepository petRepository;
    private final AppointmentRepository appointmentRepository;

    public void seed() {
        seedUsersAndRoles();
        seedVetServices();
        seedDoctors();
        seedSamplePets();
        log.info("Dữ liệu mẫu Thú Y (VetCare) đã được nạp thành công.");
    }

    private void seedUsersAndRoles() {
        // Tạo tài khoản Bác sĩ thú y mặc định: vet / vet123
        if (!userRepository.existsByUsername("vet")) {
            User vetUser = new User();
            vetUser.setUsername("vet");
            vetUser.setEmail("vet@vetcare.vn");
            vetUser.setPasswordHash(passwordEncoder.encode("vet123"));
            vetUser.setStatus(UserStatus.ACTIVE);

            UserProfile profile = new UserProfile();
            profile.setFullName("BS. Nguyễn Hoàng Long");
            profile.setPhone("0912345678");
            profile.setUser(vetUser);
            vetUser.setProfile(profile);
            userRepository.save(vetUser);

            Role vetRole = roleRepository.findByName(Roles.VET)
                    .orElseGet(() -> {
                        Role r = new Role();
                        r.setName(Roles.VET);
                        return roleRepository.save(r);
                    });

            UserRole ur = new UserRole();
            ur.setId(new UserRoleId(vetUser.getId(), vetRole.getId()));
            ur.setUser(vetUser);
            ur.setRole(vetRole);
            userRoleRepository.save(ur);
        }

        // Tạo tài khoản Khách hàng mẫu: customer / customer123
        if (!userRepository.existsByUsername("customer")) {
            User custUser = new User();
            custUser.setUsername("customer");
            custUser.setEmail("khachhang@gmail.com");
            custUser.setPasswordHash(passwordEncoder.encode("customer123"));
            custUser.setStatus(UserStatus.ACTIVE);

            UserProfile profile = new UserProfile();
            profile.setFullName("Trần Thị Mai");
            profile.setPhone("0987654321");
            profile.setUser(custUser);
            custUser.setProfile(profile);
            userRepository.save(custUser);

            Role userRole = roleRepository.findByName(Roles.USER)
                    .orElseGet(() -> {
                        Role r = new Role();
                        r.setName(Roles.USER);
                        return roleRepository.save(r);
                    });

            UserRole ur = new UserRole();
            ur.setId(new UserRoleId(custUser.getId(), userRole.getId()));
            ur.setUser(custUser);
            ur.setRole(userRole);
            userRoleRepository.save(ur);
        }
    }

    private void seedVetServices() {
        if (vetServiceRepository.count() > 0) return;

        List<VetService> services = List.of(
            createService("Khám tổng quát & Chẩn đoán lâm sàng", "Kiểm tra toàn diện tai, mắt, mũi họng, nghe tim phổi, đo thân nhiệt và tư vấn sức khỏe thú cưng.", BigDecimal.valueOf(150000), 30, "EXAMINATION", "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500"),
            createService("Tiêm phòng Vắc xin 7 bệnh cho Chó", "Phòng ngừa Care, Parvovirus, Viêm gan truyền nhiễm, Ho cũi chó, Cúm, Phó cúm và Leptospira.", BigDecimal.valueOf(250000), 20, "VACCINATION", "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500"),
            createService("Tiêm phòng Vắc xin 4 bệnh cho Mèo", "Phòng ngừa giảm bạch cầu, viêm mũi khí quản, Calicivirus và Chlamydia.", BigDecimal.valueOf(220000), 20, "VACCINATION", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500"),
            createService("Siêu âm ổ bụng & Chẩn đoán hình ảnh", "Siêu âm màu kiểm tra thai kỳ, phát hiện dị vật đường ruột, sỏi bàng quang, gan thận.", BigDecimal.valueOf(300000), 35, "EXAMINATION", "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500"),
            createService("Phẫu thuật Triệt sản Mèo cái / Chó cái", "Phẫu thuật công nghệ nội soi và gây mê khí dung an toàn, không đau, mau lành vết mổ.", BigDecimal.valueOf(800000), 60, "SURGERY", "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500"),
            createService("Combo Spa Tắm dưỡng & Cắt tỉa lông chuyên nghiệp", "Tắm massage dược liệu thảo mộc, vắt tuyến hôi, vệ sinh tai, cắt mài móng, sấy phồng và tạo kiểu dáng đẹp.", BigDecimal.valueOf(350000), 60, "SPA_GROOMING", "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500"),
            createService("Lấy cao răng & Vệ sinh khoang miệng bằng sóng siêu âm", "Làm sạch mảng bám vôi răng, trị hôi miệng, bảo vệ nướu và ngăn ngừa rụng răng sớm.", BigDecimal.valueOf(400000), 45, "DENTAL", "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=500")
        );

        vetServiceRepository.saveAll(services);
    }

    private VetService createService(String name, String desc, BigDecimal price, int duration, String category, String img) {
        VetService s = new VetService();
        s.setName(name);
        s.setDescription(desc);
        s.setPrice(price);
        s.setDurationMinutes(duration);
        s.setCategory(category);
        s.setImageUrl(img);
        s.setStatus("ACTIVE");
        return s;
    }

    private void seedDoctors() {
        if (doctorRepository.count() > 0) return;

        User vetUser = userRepository.findByUsername("vet").orElse(null);

        Doctor doc1 = new Doctor();
        doc1.setUser(vetUser);
        doc1.setFullName("BS. Nguyễn Hoàng Long");
        doc1.setSpecialization("Ngoại khoa & Phẫu thuật mô mềm");
        doc1.setLicenseNumber("VET-HCM-2018-0912");
        doc1.setExperienceYears(8);
        doc1.setBio("Tốt nghiệp Đại học Nông Lâm TP.HCM, chứng chỉ tu nghiệp phẫu thuật thú y tại Thái Lan. Đã thực hiện hơn 3.000 ca phẫu thuật thành công.");
        doc1.setPhone("0912345678");
        doc1.setEmail("bslong@vetcare.vn");
        doc1.setAvatarUrl("https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300");
        doc1.setIsAvailable(true);
        doc1.setRating(4.9);
        doctorRepository.save(doc1);

        Doctor doc2 = new Doctor();
        doc2.setFullName("ThS.BS. Lê Quỳnh Anh");
        doc2.setSpecialization("Nội khoa & Da liễu thú cưng");
        doc2.setLicenseNumber("VET-HCM-2020-0455");
        doc2.setExperienceYears(6);
        doc2.setBio("Thạc sĩ Thú y, chuyên gia điều trị các bệnh nấm da, ghẻ Demodex mạn tính và dị ứng miễn dịch trên chó mèo.");
        doc2.setPhone("0934567890");
        doc2.setEmail("bsquynhanh@vetcare.vn");
        doc2.setAvatarUrl("https://images.unsplash.com/photo-1594824813629-455b9e075c32?w=300");
        doc2.setIsAvailable(true);
        doc2.setRating(5.0);
        doctorRepository.save(doc2);
    }

    private void seedSamplePets() {
        if (petRepository.count() > 0) return;

        User customer = userRepository.findByUsername("customer").orElse(null);
        if (customer == null) return;

        Pet pet1 = new Pet();
        pet1.setName("Bắp");
        pet1.setSpecies("Chó");
        pet1.setBreed("Corgi Pembroke");
        pet1.setAge(2);
        pet1.setWeight(11.5);
        pet1.setGender("Đực");
        pet1.setNotes("Dị ứng với hải sản. Đã tiêm phòng dại năm 2025.");
        pet1.setImageUrl("https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=500");
        pet1.setOwner(customer);
        petRepository.save(pet1);

        Pet pet2 = new Pet();
        pet2.setName("Miu Miu");
        pet2.setSpecies("Mèo");
        pet2.setBreed("Mèo Anh lông ngắn (British Shorthair)");
        pet2.setAge(1);
        pet2.setWeight(4.2);
        pet2.setGender("Cái");
        pet2.setNotes("Bé rất ngoan, tính nhát người lạ.");
        pet2.setImageUrl("https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500");
        pet2.setOwner(customer);
        petRepository.save(pet2);
    }
}

