package com.sporthub.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    @Value("${ai.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${ai.gemini.model:gemini-2.5-flash}")
    private String geminiModel;

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    public String consult(String prompt, String petInfo) {
        if (prompt == null || prompt.trim().isEmpty()) {
            return "Chào bạn! Tôi là Bác sĩ Thú y AI tại VetCare. Bạn hãy chia sẻ tình trạng sức khỏe hoặc triệu chứng của bé thú cưng để tôi hỗ trợ nhé!";
        }

        // Nếu có Gemini API Key hợp lệ, gọi Google Gemini API
        if (geminiApiKey != null && !geminiApiKey.isBlank() && !geminiApiKey.equals("YOUR_GEMINI_API_KEY")) {
            try {
                String response = callGeminiApi(prompt, petInfo);
                if (response != null && !response.isBlank()) {
                    return response;
                }
            } catch (Exception ex) {
                log.warn("Gemini API call failed, fallback to local AI engine: {}", ex.getMessage());
            }
        }

        // Chế độ AI Thú Y Chuyên Sâu Tích Hợp (Expert Veterinary Rule Engine)
        return generateExpertVeterinaryResponse(prompt, petInfo);
    }

    private String callGeminiApi(String userPrompt, String petInfo) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" 
                    + geminiModel + ":generateContent?key=" + geminiApiKey;

            String systemContext = "Bạn là Bác sĩ Thú y AI của phòng khám VetCare Clinic. "
                    + "Hãy tư vấn tận tâm, khoa học và dễ hiểu bằng tiếng Việt về tình trạng thú cưng, "
                    + "hướng dẫn sơ cứu an toàn tại nhà và khuyên chủ nuôi đặt lịch khám nếu cần thiết. "
                    + (petInfo != null && !petInfo.isBlank() ? "Thông tin thú cưng: " + petInfo + ". " : "");

            Map<String, Object> textPart = Map.of("text", systemContext + "\nCâu hỏi của khách: " + userPrompt);
            Map<String, Object> content = Map.of("parts", List.of(textPart));
            Map<String, Object> requestBody = Map.of("contents", List.of(content));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                    return textNode.asText();
                }
            }
        } catch (Exception e) {
            log.error("Error invoking Gemini API: {}", e.getMessage());
        }
        return null;
    }

    private String generateExpertVeterinaryResponse(String question, String petInfo) {
        String q = question.toLowerCase();

        StringBuilder sb = new StringBuilder();
        sb.append("🐾 **[Bác sĩ Thú Y AI VetCare]**\n\n");

        if (petInfo != null && !petInfo.isBlank()) {
            sb.append("📋 *Ghi nhận thông tin bé:* ").append(petInfo).append("\n\n");
        }

        if (q.contains("nôn") || q.contains("ói") || q.contains("bọt trắng") || q.contains("bọt vàng")) {
            sb.append("⚠️ **Triệu chứng nôn ói ở thú cưng:**\n")
              .append("- **Nguyên nhân thường gặp:** Ăn phải dị vật, đổi thức ăn đột ngột, viêm dạ dày ruột, nhiễm ký sinh trùng hoặc các bệnh truyền nhiễm nguy hiểm (Parvovirus, Care ở chó, Giảm bạch cầu ở mèo).\n")
              .append("- **Xử trí ban đầu tại nhà:**\n")
              .append("  1. Tạm ngừng cho ăn trong 6-8 tiếng để đường ruột nghỉ ngơi (chỉ để một ít nước sạch).\n")
              .append("  2. Tuyệt đối KHÔNG tự ý cho uống thuốc hạ sốt hay kháng sinh của người (Paracetamol cực độc với mèo).\n")
              .append("  3. Theo dõi nếu bé nôn nhiều lần kèm lờ đờ hoặc đi ngoài ra máu: hãy đưa ngay đến VetCare Clinic để được truyền dịch và làm xét nghiệm test bệnh.\n\n")
              .append("👉 **Khuyến nghị:** Bạn nên đặt lịch **'Khám tổng quát & Siêu âm đường tiêu hóa'** tại VetCare.");
        } else if (q.contains("tiêu chảy") || q.contains("đi ngoài") || q.contains("phân lỏng")) {
            sb.append("⚠️ **Tình trạng tiêu chảy / Rối loạn tiêu hóa:**\n")
              .append("- Cần đề phòng mất nước nhanh, đặc biệt là với chó mèo con dưới 6 tháng tuổi.\n")
              .append("- Cung cấp gói điện giải Oresol cho thú cưng (pha loãng đúng tỉ lệ).\n")
              .append("- Cho ăn nhẹ với ức gà luộc xé nhỏ hoặc cháo nhuyễn khi tình trạng đã thuyên giảm.\n")
              .append("- Nếu phân có lẫn máu, mùi tanh nồng hoặc bé sốt, cần đến phòng khám ngay lập tức.");
        } else if (q.contains("bỏ ăn") || q.contains("mệt") || q.contains("lờ đờ")) {
            sb.append("🩺 **Dấu hiệu bỏ ăn & mệt mỏi:**\n")
              .append("- Thú cưng rất giỏi che giấu bệnh tật. Khi bé đã bỏ ăn trên 24 giờ, đây là dấu hiệu cơ thể đang gặp vấn đề (viêm họng, đau răng, sốt, gan, thận hoặc bệnh nội tại).\n")
              .append("- Thử hâm ấm thức ăn có mùi thơm hấp dẫn (pate ấm) hoặc bón từng thìa nhỏ.\n")
              .append("- Kiểm tra nhiệt độ (nếu tai và mũi bé khô, nóng rát thì bé đang sốt).\n")
              .append("👉 Hãy đặt lịch khám sớm để bác sĩ kiểm tra và xét nghiệm máu nếu cần thiết.");
        } else if (q.contains("tiêm") || q.contains("vắc xin") || q.contains("vaccine") || q.contains("dại")) {
            sb.append("💉 **Lịch tiêm phòng chuẩn cho thú cưng:**\n")
              .append("- **Chó con:**\n")
              .append("  + 6 - 8 tuần tuổi: Mũi 1 (vắc xin 5 bệnh).\n")
              .append("  + 9 - 11 tuần tuổi: Mũi 2 (vắc xin 7 bệnh).\n")
              .append("  + 12 - 14 tuần tuổi: Mũi 3 + Tiêm phòng Dại.\n")
              .append("- **Mèo:** Tiêm vắc xin 4 bệnh (mũi 1 lúc 8 tuần tuổi, nhắc lại sau 3-4 tuần) và tiêm phòng Dại.\n")
              .append("- **Lưu ý:** Trước khi tiêm cần tẩy giun và đảm bảo bé hoàn toàn khỏe mạnh, không sốt.");
        } else if (q.contains("rụng lông") || q.contains("ngứa") || q.contains("gãi") || q.contains("ve") || q.contains("rận") || q.contains("nấm")) {
            sb.append("🧴 **Chăm sóc da liễu & Vấn đề ve rận:**\n")
              .append("- Dấu hiệu gãi liên tục, rụng lông từng mảng tròn thường do **Nấm da (Microsporum canis)** hoặc **Ký sinh trùng Demodex/Ghẻ Sarcoptes**.\n")
              .append("- Nên sử dụng thuốc nhỏ gáy định kỳ (như Bravecto, Nexgard, Revolution).\n")
              .append("- Tắm bằng sữa tắm dược liệu trị nấm chuyên dụng 1-2 lần/tuần, sấy thật khô lông sau khi tắm.\n")
              .append("👉 Đặt ngay gói **'Khám da liễu & Soi kính vi khuẩn'** hoặc dịch vụ **'Spa & Cắt tỉa lông'** tại VetCare.");
        } else if (q.contains("triệt sản") || q.contains("thiến") || q.contains("đẻ")) {
            sb.append("✂️ **Tư vấn Triệt sản thú cưng:**\n")
              .append("- Độ tuổi thích hợp nhất để triệt sản: Từ 6 - 9 tháng tuổi (trước chu kỳ động dục đầu tiên).\n")
              .append("- **Lợi ích:** Giảm nguy cơ ung thư tinh hoàn, viêm tử cung tích mủ (Pyometra), giảm tình trạng đi tiểu đánh dấu lãnh thổ hoặc bỏ nhà đi tìm bạn tình.\n")
              .append("- Cần nhịn ăn 8-12 tiếng trước ca phẫu thuật gây mê.\n")
              .append("👉 VetCare cung cấp gói phẫu thuật gây mê khí dung an toàn tuyệt đối cho bé.");
        } else {
            sb.append("Cảm ơn bạn đã hỏi về: *\"").append(question).append("\"*.\n\n")
              .append("Để chăm sóc bé thú cưng một cách tốt nhất, phòng khám VetCare luôn có đội ngũ bác sĩ trực 24/7 với đầy đủ trang thiết bị xét nghiệm máu, chụp X-quang, siêu âm và phẫu thuật.\n")
              .append("Bạn có thể đặt lịch hẹn trực tiếp trên website để chọn bác sĩ và thời gian khám thuận tiện nhất nhé!");
        }

        sb.append("\n\n📞 *Hotline hỗ trợ khẩn cấp:* 1900 888 999 | 🏥 *Phòng khám VetCare: 123 Nguyễn Văn Cừ, Quận 5, TP.HCM*");
        return sb.toString();
    }
}

