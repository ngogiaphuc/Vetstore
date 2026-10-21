package com.sporthub.service;

import com.sporthub.entity.Appointment;
import com.sporthub.entity.MedicalRecord;
import com.sporthub.entity.Payment;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:vethub.clinic@gmail.com}")
    private String fromEmail;

    private String formatVND(Object amount) {
        if (amount == null) return "0 đ";
        NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return nf.format(amount);
    }

    @Async
    public void sendAppointmentConfirmation(Appointment appointment) {
        if (appointment.getCustomer() == null || appointment.getCustomer().getEmail() == null) {
            return;
        }

        String toEmail = appointment.getCustomer().getEmail();
        String customerName = appointment.getCustomer().getProfile() != null 
                ? appointment.getCustomer().getProfile().getFullName() 
                : appointment.getCustomer().getUsername();

        String petName = appointment.getPet() != null ? appointment.getPet().getName() : "Thú cưng";
        String serviceName = appointment.getService() != null ? appointment.getService().getName() : "Khám thú y";
        String doctorName = appointment.getDoctor() != null ? appointment.getDoctor().getFullName() : "Bác sĩ chỉ định";

        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"/></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin:0; padding:20px; background:#f4f7f6;">
                <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                    <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 25px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">🐾 VetCare Clinic</h1>
                        <p style="margin: 5px 0 0 0; opacity: 0.9;">Xác Nhận Lịch Hẹn Khám Thú Cưng</p>
                    </div>
                    <div style="padding: 30px;">
                        <p>Xin chào <strong>%s</strong>,</p>
                        <p>Lịch hẹn chăm sóc thú cưng của bạn đã được tiếp nhận thành công với thông tin chi tiết dưới đây:</p>
                        
                        <div style="background: #f8fafc; border-left: 4px solid #10B981; padding: 15px; border-radius: 6px; margin: 20px 0;">
                            <p style="margin: 6px 0;"><strong>Mã lịch hẹn:</strong> <span style="color:#059669; font-weight:bold;">%s</span></p>
                            <p style="margin: 6px 0;"><strong>Bé thú cưng:</strong> %s</p>
                            <p style="margin: 6px 0;"><strong>Dịch vụ:</strong> %s</p>
                            <p style="margin: 6px 0;"><strong>Bác sĩ phụ trách:</strong> %s</p>
                            <p style="margin: 6px 0;"><strong>Ngày hẹn:</strong> %s</p>
                            <p style="margin: 6px 0;"><strong>Giờ hẹn:</strong> %s</p>
                            <p style="margin: 6px 0;"><strong>Chi phí dự kiến:</strong> %s</p>
                            <p style="margin: 6px 0;"><strong>Trạng thái thanh toán:</strong> <span style="color: #eab308; font-weight: bold;">%s</span></p>
                        </div>

                        <p>Vui lòng đưa bé thú cưng đến trước giờ hẹn 10 phút để bác sĩ chuẩn bị chu đáo nhất.</p>
                        <p style="margin-top: 30px; font-size: 13px; color: #64748b;">Nếu cần hỗ trợ hoặc đổi lịch, xin liên hệ hotline: <strong>1900 888 999</strong>.</p>
                    </div>
                    <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
                        © 2026 VetCare Clinic - Hệ Thống Chăm Sóc Sức Khỏe Thú Cưng Hàng Đầu
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                customerName,
                appointment.getAppointmentCode(),
                petName,
                serviceName,
                doctorName,
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                formatVND(appointment.getTotalAmount()),
                appointment.getPaymentStatus()
        );

        sendHtmlEmail(toEmail, "🐾 [VetCare] Xác nhận lịch hẹn " + appointment.getAppointmentCode(), htmlContent);
    }

    @Async
    public void sendPaymentReceipt(Payment payment) {
        if (payment.getAppointment() == null || payment.getAppointment().getCustomer() == null) {
            return;
        }

        String toEmail = payment.getAppointment().getCustomer().getEmail();
        String customerName = payment.getAppointment().getCustomer().getProfile() != null 
                ? payment.getAppointment().getCustomer().getProfile().getFullName() 
                : payment.getAppointment().getCustomer().getUsername();

        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"/></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin:0; padding:20px; background:#f4f7f6;">
                <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                    <div style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: white; padding: 25px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">💳 Hóa Đơn Thanh Toán VNPay</h1>
                        <p style="margin: 5px 0 0 0; opacity: 0.9;">VetCare Clinic</p>
                    </div>
                    <div style="padding: 30px;">
                        <p>Xin chào <strong>%s</strong>,</p>
                        <p>Bạn đã thanh toán trực tuyến thành công cho lịch hẹn tại VetCare Clinic.</p>
                        
                        <div style="background: #f8fafc; border-left: 4px solid #3B82F6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                            <p style="margin: 6px 0;"><strong>Mã lịch hẹn:</strong> %s</p>
                            <p style="margin: 6px 0;"><strong>Số tiền:</strong> <span style="color:#1D4ED8; font-size:18px; font-weight:bold;">%s</span></p>
                            <p style="margin: 6px 0;"><strong>Cổng thanh toán:</strong> %s</p>
                            <p style="margin: 6px 0;"><strong>Ngân hàng:</strong> %s</p>
                            <p style="margin: 6px 0;"><strong>Mã GD VNPay:</strong> %s</p>
                            <p style="margin: 6px 0;"><strong>Thời gian:</strong> %s</p>
                            <p style="margin: 6px 0;"><strong>Trạng thái:</strong> <span style="color: #10B981; font-weight:bold;">THÀNH CÔNG</span></p>
                        </div>

                        <p>Cảm ơn bạn đã tin tưởng dịch vụ thú y của chúng tôi!</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                customerName,
                payment.getAppointment().getAppointmentCode(),
                formatVND(payment.getAmount()),
                payment.getPaymentMethod(),
                payment.getBankCode() != null ? payment.getBankCode() : "VNPay QR",
                payment.getTransactionNo(),
                payment.getPaymentTime()
        );

        sendHtmlEmail(toEmail, "💳 [VetCare] Hóa đơn thanh toán VNPay #" + payment.getTransactionNo(), htmlContent);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "VetCare Clinic");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Đã gửi email thành công tới: {}", to);
        } catch (Exception ex) {
            log.warn("Không thể gửi email tới {}: {}", to, ex.getMessage());
        }
    }
}

