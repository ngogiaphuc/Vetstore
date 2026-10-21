package com.sporthub.service;

import com.sporthub.entity.Appointment;
import com.sporthub.entity.Payment;
import com.sporthub.repository.AppointmentRepository;
import com.sporthub.repository.PaymentRepository;
import com.sporthub.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class VNPayService {

    @Value("${vnpay.tmn-code:CGXZLS0Z}")
    private String vnpTmnCode;

    @Value("${vnpay.hash-secret:XNBCJFAKAZQSGTARRLGCHVZWCIOIGSHN}")
    private String vnpHashSecret;

    @Value("${vnpay.pay-url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String vnpPayUrl;

    @Value("${vnpay.return-url:http://localhost:5173/vnpay-return}")
    private String vnpReturnUrl;

    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;
    private final EmailService emailService;

    public String createPaymentUrl(Long appointmentId, String ipAddress) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn ID: " + appointmentId));

        long amount = appointment.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnpTmnCode);
        vnpParams.put("vnp_Amount", String.valueOf(amount));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", appointment.getAppointmentCode() + "_" + System.currentTimeMillis());
        vnpParams.put("vnp_OrderInfo", "Thanh toan lich kham thu y " + appointment.getAppointmentCode());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnpReturnUrl);
        vnpParams.put("vnp_IpAddr", (ipAddress != null && !ipAddress.isBlank()) ? ipAddress : "127.0.0.1");

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_CreateDate", vnpCreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnpExpireDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnpParams.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnpHashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;

        return vnpPayUrl + "?" + queryUrl;
    }

    @Transactional
    public Map<String, Object> processReturn(Map<String, String> params) {
        Map<String, Object> result = new HashMap<>();
        String vnpSecureHash = params.get("vnp_SecureHash");

        Map<String, String> fields = new HashMap<>(params);
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        String signValue = VNPayUtil.hashAllFields(fields, vnpHashSecret);
        boolean isValidChecksum = signValue.equalsIgnoreCase(vnpSecureHash);

        String responseCode = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");
        String amountStr = params.get("vnp_Amount");
        String transactionNo = params.get("vnp_TransactionNo");
        String bankCode = params.get("vnp_BankCode");
        String orderInfo = params.get("vnp_OrderInfo");

        String appointmentCode = (txnRef != null && txnRef.contains("_"))
                ? txnRef.split("_")[0]
                : txnRef;

        BigDecimal amount = (amountStr != null)
                ? new BigDecimal(amountStr).divide(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        boolean isSuccess = "00".equals(responseCode);

        result.put("isValid", isValidChecksum);
        result.put("isSuccess", isSuccess);
        result.put("appointmentCode", appointmentCode);
        result.put("amount", amount);
        result.put("transactionNo", transactionNo);
        result.put("bankCode", bankCode);
        result.put("responseCode", responseCode);

        if (appointmentCode != null) {
            appointmentRepository.findByAppointmentCode(appointmentCode).ifPresent(appointment -> {
                if (isSuccess) {
                    appointment.setPaymentStatus("PAID");
                    appointment.setStatus("CONFIRMED");
                    appointmentRepository.save(appointment);

                    Payment payment = new Payment();
                    payment.setAppointment(appointment);
                    payment.setAmount(amount);
                    payment.setPaymentMethod("VNPAY");
                    payment.setTransactionNo(transactionNo);
                    payment.setBankCode(bankCode);
                    payment.setOrderInfo(orderInfo);
                    payment.setStatus("SUCCESS");
                    payment.setPaymentTime(LocalDateTime.now());
                    paymentRepository.save(payment);

                    // Gửi email hóa đơn
                    try {
                        emailService.sendPaymentReceipt(payment);
                    } catch (Exception ex) {
                        log.warn("Không thể gửi email hóa đơn: {}", ex.getMessage());
                    }
                } else {
                    Payment payment = new Payment();
                    payment.setAppointment(appointment);
                    payment.setAmount(amount);
                    payment.setPaymentMethod("VNPAY");
                    payment.setTransactionNo(transactionNo);
                    payment.setBankCode(bankCode);
                    payment.setOrderInfo(orderInfo);
                    payment.setStatus("FAILED");
                    payment.setPaymentTime(LocalDateTime.now());
                    paymentRepository.save(payment);
                }
            });
        }

        return result;
    }
}

