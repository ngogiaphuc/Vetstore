# 🐾 VetCare Clinic - Hệ Thống Quản Lý Phòng Khám & Đặt Lịch Dịch Vụ Thú Y

Hệ thống quản lý phòng khám và đặt lịch khám thú y trực tuyến được xây dựng trên nền tảng **Spring Boot 3 (Java 21)**, **Spring Security 6**, **JWT**, **Spring Data JPA**, **MySQL**, kết hợp giao diện **React 19 + Vite + Tailwind CSS**.

Tài liệu báo cáo chi tiết đầy đủ xem tại: [BAO_CAO_DO_AN_THU_Y.md](./BAO_CAO_DO_AN_THU_Y.md)

---

## 🌟 TÍNH NĂNG NỔI BẬT ĐÁP ỨNG TIÊU CHÍ ĐỒ ÁN

- [x] **Đăng nhập Google (Gmail)**: Hỗ trợ 1-click Google Sign-in tại màn hình Login, tự động tạo tài khoản và đồng bộ JWT token.
- [x] **Phân quyền người dùng (3 nhóm)**:
  - `CUSTOMER` / `USER`: Khách hàng, quản lý thú cưng, đặt lịch khám, thanh toán VNPay, chat AI.
  - `VET`: Bác sĩ thú y, duyệt ca khám, ghi bệnh án và kê đơn thuốc điện tử.
  - `ADMIN`: Quản trị viên, quản lý gói dịch vụ thú y, đối soát doanh thu VNPay.
- [x] **Thanh toán trực tuyến VNPay Sandbox**: Tích hợp thuật toán HMAC-SHA512, sinh URL thanh toán an toàn, xác thực chữ ký số Return/IPN và cập nhật trạng thái `PAID`.
- [x] **Spring Data JPA & Hibernate**: Thiết kế đầy đủ Entity: `Pet`, `Doctor`, `VetService`, `Appointment`, `MedicalRecord`, `Payment`, `VetReview`.
- [x] **Gửi Email bằng Spring Email**: Tự động gửi email HTML xác nhận lịch hẹn và email hóa đơn thanh toán VNPay.
- [x] **Kiến trúc phân tách chuẩn**: Dự án Backend (`sporthub-api`) + Dự án Frontend (`sporthub-user`).
- [x] **Giao diện hiện đại (14 màn hình)**: Trang chủ, Danh mục dịch vụ, Đặt lịch khám, Hồ sơ thú cưng, Lịch hẹn của tôi, Thanh toán VNPay, Chatbot AI Bác sĩ Thú y, Đăng nhập, Đăng ký, Profile, Dashboard Admin, Quản lý ca khám & Bệnh án, Quản lý dịch vụ, Lịch sử thanh toán.
- [x] **⭐ Tích hợp AI (Điểm cộng)**: Chatbot Bác sĩ Thú y AI (Google Gemini 2.5 + Expert Rule Engine) tư vấn triệu chứng nôn ói, sốt, tiêu chảy, hướng dẫn sơ cứu thú cưng 24/7.
- [x] **⭐ Kiến trúc Microservice & Cloud (Điểm cộng)**: Docker Compose trọn gói, tài liệu hướng dẫn deploy Render / Railway / Vercel.

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG

### 1. Khởi chạy Backend (`vetstore-api`)
```bash
cd vetstore-api

# Chạy với MySQL (Mặc định)
mvn spring-boot:run

# HOẶC Chạy chế độ H2 In-Memory (Không cần cài MySQL, chấm bài tức thì)
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
- API Base URL: `http://localhost:8080/api`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`

### 2. Khởi chạy Frontend (`vetstore-user`)
```bash
cd vetstore-user

# Khởi chạy server phát triển
npm run dev
```
- Truy cập trình duyệt: `http://localhost:5173`

---

## 🔑 TÀI KHOẢN MẪU THỬ NGHIỆM

| Nhóm quyền | Username | Password | Vai trò & Chức năng |
|:---|:---|:---|:---|
| **Khách hàng (Customer)** | `customer` | `customer123` | Quản lý thú cưng, đặt lịch, thanh toán VNPay |
| **Bác sĩ thú y (Vet)** | `vet` | `vet123` | Quản lý ca khám, kê đơn thuốc, ghi bệnh án |
| **Quản trị viên (Admin)** | `admin` | `admin123` | Toàn quyền quản trị hệ thống, doanh thu, dịch vụ |
| **Đăng nhập Google** | Nút trên giao diện | - | Tự động tạo tài khoản qua Gmail |
