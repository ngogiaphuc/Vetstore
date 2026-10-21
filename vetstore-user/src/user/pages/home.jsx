import { Link } from 'react-router-dom';
import {
  Calendar, ShieldCheck, Heart, Sparkles, Stethoscope, Syringe, Scissors,
  Star, Clock, Award, CheckCircle2, ArrowRight, Bot, PhoneCall, PawPrint
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function UserHomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-background to-background dark:from-emerald-950/20 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <Sparkles className="size-3.5" /> Hệ Thống Bệnh Viện & Phòng Khám Thú Y Chuẩn Quốc Tế
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.15]">
                Vì Sức Khỏe & <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  Hạnh Phúc Trọn Vẹn
                </span>{' '}
                Của Bé Cưng
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                VetCare Clinic mang đến giải pháp y tế toàn diện: Khám tổng quát, phẫu thuật nội soi, tiêm chủng vắc xin và spa chuyên nghiệp với đội ngũ bác sĩ thú y hơn 10 năm kinh nghiệm.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md">
                  <Link to="/booking">
                    <Calendar className="mr-2 size-5" /> Đặt Lịch Khám Ngay
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-xl font-bold border-emerald-600/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">
                  <Link to="/chat-support">
                    <Bot className="mr-2 size-5 text-emerald-600" /> Bác Sĩ AI Tư Vấn (24/7)
                  </Link>
                </Button>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" /> Cấp cứu 24/7
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" /> Thanh toán VNPay linh hoạt
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" /> Bệnh án điện tử
                </span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-card">
                <img
                  src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800"
                  alt="Veterinarian with golden retriever"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="size-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-bold">5.0 / 5.0 (2.500+ đánh giá)</span>
                  </div>
                  <p className="text-xs text-white/90">
                    "Bác sĩ tại VetCare rất nhẹ nhàng và tận tình, bé Corgi nhà mình tiêm vắc xin không hề khóc một tiếng nào!" - Chị Mai Lan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-card border border-border rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-xs">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">5.000+</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">Bé thú cưng đã chăm sóc</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">15+</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">Bác sĩ chuyên khoa đầu ngành</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">99.8%</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">Khách hàng hài lòng</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">24/7</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">Cấp cứu & Hỗ trợ AI</div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-none mb-2">Chăm sóc chuẩn Y khoa</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Dịch Vụ Nổi Bật Tại VetCare
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Quy trình khám chữa bệnh bài bản, trang thiết bị nhập khẩu từ Đức và Nhật Bản.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-xl font-bold">
            <Link to="/services">
              Xem tất cả dịch vụ <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Khám Tổng Quát & Siêu Âm',
              desc: 'Đo thân nhiệt, nghe tim phổi, siêu âm màu 4D phát hiện sớm các bệnh nội khoa tiềm ẩn.',
              icon: Stethoscope,
              color: 'text-blue-500 bg-blue-500/10',
              img: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400',
            },
            {
              title: 'Tiêm Chủng Vắc Xin',
              desc: 'Gói vắc xin 7 bệnh cho chó, 4 bệnh cho mèo và phòng dại với nguồn gốc chính hãng chuẩn GSP.',
              icon: Syringe,
              color: 'text-emerald-500 bg-emerald-500/10',
              img: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400',
            },
            {
              title: 'Phẫu Thuật & Triệt Sản',
              desc: 'Phòng mổ áp lực dương vô trùng, máy gây mê khí dung bảo đảm an toàn sinh mạng tuyệt đối.',
              icon: Heart,
              color: 'text-rose-500 bg-rose-500/10',
              img: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400',
            },
            {
              title: 'Spa & Cắt Tỉa Lông',
              desc: 'Tắm dưỡng thảo mộc, vắt tuyến hôi, sấy phồng và tạo kiểu dáng xinh xắn cho chó mèo.',
              icon: Scissors,
              color: 'text-purple-500 bg-purple-500/10',
              img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400',
            },
          ].map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div key={idx} className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition group flex flex-col justify-between">
                <div>
                  <div className="h-40 overflow-hidden relative">
                    <img src={srv.img} alt={srv.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute top-3 left-3 size-10 rounded-xl bg-card/90 backdrop-blur flex items-center justify-center shadow-xs">
                      <Icon className="size-5 text-emerald-600" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-foreground text-base group-hover:text-emerald-600 transition">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Button asChild size="sm" variant="ghost" className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-bold">
                    <Link to="/booking">Đặt lịch ngay →</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. AI VET CALLOUT SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 relative z-10">
            <Badge className="bg-white/20 text-white border-none text-xs">
              🤖 Tích hợp Trí tuệ nhân tạo Gemini
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Bé Đang Gặp Triệu Chứng Lạ? <br />
              Hỏi Ngay Bác Sĩ Thú Y AI!
            </h2>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Nhận ngay tư vấn miễn phí tức thì về các dấu hiệu nôn mửa, tiêu chảy, bỏ ăn hoặc cách sơ cứu khẩn cấp tại nhà trước khi đưa đến bệnh viện.
            </p>
            <div className="pt-2">
              <Button asChild size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold rounded-xl shadow-md">
                <Link to="/chat-support">
                  <Bot className="mr-2 size-5" /> Trò Chuyện Với Bác Sĩ AI Miễn Phí
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-200">
              <PawPrint className="size-4" /> Câu hỏi thường gặp nhất:
            </div>
            <div className="bg-black/20 p-3 rounded-xl border border-white/10">
              "Chó con 2 tháng tuổi bị nôn ra bọt trắng và tiêu chảy có nguy hiểm không?"
            </div>
            <div className="bg-black/20 p-3 rounded-xl border border-white/10">
              "Mèo bị rụng lông thành vòng tròn đỏ ngứa là bị nấm gì và bôi thuốc gì?"
            </div>
            <div className="bg-black/20 p-3 rounded-xl border border-white/10">
              "Lịch tiêm phòng dại và tẩy giun định kỳ chuẩn thú y là bao lâu một lần?"
            </div>
          </div>
        </div>
      </section>

      {/* 5. EXPERT DOCTORS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-none mb-2">Đội ngũ y bác sĩ</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Bác Sĩ Thú Y Giàu Kinh Nghiệm
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Được đào tạo chính quy, tu nghiệp nước ngoài và luôn dành tình yêu thương vô điều kiện cho thú cưng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'BS. Nguyễn Hoàng Long',
              spec: 'Ngoại khoa & Phẫu thuật mô mềm',
              exp: '8 năm kinh nghiệm',
              img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300',
              rate: '4.9 ★ (1.200+ ca khám)',
            },
            {
              name: 'ThS.BS. Lê Quỳnh Anh',
              spec: 'Nội khoa & Da liễu thú cưng',
              exp: '6 năm kinh nghiệm',
              img: 'https://images.unsplash.com/photo-1594824813629-455b9e075c32?w=300',
              rate: '5.0 ★ (950+ ca khám)',
            },
            {
              name: 'BS. Trần Minh Đức',
              spec: 'Chẩn đoán hình ảnh & Cấp cứu 24/7',
              exp: '10 năm kinh nghiệm',
              img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300',
              rate: '4.9 ★ (1.800+ ca khám)',
            },
          ].map((doc, idx) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-6 text-center shadow-xs flex flex-col items-center">
              <img
                src={doc.img}
                alt={doc.name}
                className="size-24 rounded-full object-cover mb-4 border-2 border-emerald-500 shadow-sm"
              />
              <h3 className="font-bold text-foreground text-base">{doc.name}</h3>
              <p className="text-xs font-semibold text-emerald-600 mt-1">{doc.spec}</p>
              <p className="text-xs text-muted-foreground mt-1">{doc.exp}</p>
              <Badge variant="outline" className="mt-3 text-[11px] font-bold">
                {doc.rate}
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
