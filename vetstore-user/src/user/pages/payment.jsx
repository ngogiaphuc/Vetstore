import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function UserPaymentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('payment'); // 'payment' (Trang 11) | 'success' (Trang 12)
  const [failCase, setFailCase] = useState(false);

  const handleConfirmPayment = () => {
    setStep('success');
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* TRANG 11: HOÀN TẤT ĐẶT SÂN CỦA BẠN */}
        {step === 'payment' && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block">
                11. THANH TOÁN
              </span>
              <h1 className="text-2xl font-black text-foreground">Hoàn tất đặt sân của bạn</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Vui lòng chọn phương thức thanh toán để xác nhận đặt sân.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-6">
                <Card className="rounded-2xl border-border shadow-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30">
                      <div className="size-4 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                      <div>
                        <h4 className="font-bold text-sm text-primary">Thanh toán giả lập</h4>
                        <p className="text-xs text-muted-foreground">Bản demo – không thu tiền thật.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted text-xs text-muted-foreground flex items-start gap-2">
                      <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
                      <span>Đây là hình thức thanh toán giả lập phục vụ mục đích trải nghiệm. Bạn sẽ không bị trừ tiền trong giao dịch này.</span>
                    </div>

                    <div className="border-t border-border pt-4 space-y-2 text-xs">
                      <h4 className="font-bold text-sm text-foreground mb-3">Thông tin đơn hàng</h4>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sân</span>
                        <span className="font-bold">Sân cầu lông 02 – Phú Thọ Sports Center</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ngày</span>
                        <span className="font-bold font-mono">20/09/2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Khung giờ</span>
                        <span className="font-bold font-mono">18:00 - 20:00 (2 khung giờ)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Số lượng</span>
                        <span className="font-bold">2 khung giờ</span>
                      </div>
                      <div className="flex justify-between border-t border-border/60 pt-2">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span className="font-bold font-mono">160.000đ</span>
                      </div>
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Giảm giá (SPORT20)</span>
                        <span className="font-mono">-32.000đ</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-5 space-y-6">
                <Card className="rounded-2xl border-border shadow-sm">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-bold text-base text-foreground">Thanh toán</h3>
                    <p className="text-xs text-muted-foreground">Xác nhận để hoàn tất đặt sân.</p>

                    <div className="bg-muted p-4 rounded-xl space-y-1">
                      <span className="text-xs text-muted-foreground block">Số tiền thanh toán</span>
                      <span className="text-2xl font-black text-primary font-mono block">128.000đ</span>
                    </div>

                    <Button onClick={handleConfirmPayment} className="w-full font-bold size-11 text-sm shadow-md mt-2">
                      Xác nhận thanh toán
                    </Button>

                    <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
                      🔒 Giao dịch được mã hóa và bảo mật (giả lập).
                    </p>

                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
                      ⚠️ Thanh toán thành công không nghĩa là buổi chơi đã hoàn tất. Vui lòng kiểm tra lịch đặt của bạn để xác nhận trạng thái.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* TRANG 12: KẾT QUẢ & TRẠNG THÁI (Matching Mockup 12) */}
        {step === 'success' && (
          <div className="space-y-8 text-center py-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex size-24 items-center justify-center rounded-full bg-blue-500 text-white shadow-2xl animate-bounce">
                <CheckCircle2 className="size-16" />
              </div>
              <h1 className="text-3xl font-black text-foreground">Đặt sân thành công!</h1>
              <p className="text-xs text-muted-foreground max-w-md">
                Cảm ơn bạn đã sử dụng SportHub. Thông tin đặt sân đã được gửi đến số điện thoại <strong className="text-foreground">0901234567</strong>.
              </p>
            </div>

            {/* Thông tin đặt sân Box */}
            <Card className="max-w-xl mx-auto rounded-2xl border-border shadow-sm text-left">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="font-bold text-sm">Thông tin đặt sân</span>
                  <span className="text-xs font-mono font-bold text-muted-foreground">Mã đơn hàng: <strong className="text-foreground">SH20092601</strong></span>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <img src="/images/venue-badminton.png" alt="Sân" className="size-16 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-base text-foreground">Sân cầu lông 02</h4>
                    <p className="text-xs text-muted-foreground">Phú Thọ Sports Center</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs border-t border-border/60 pt-3">
                  <div>
                    <span className="text-muted-foreground block">📅 Ngày</span>
                    <span className="font-bold font-mono">20/09/2026</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">🕒 Khung giờ</span>
                    <span className="font-bold font-mono">18:00 - 20:00 (2 khung giờ)</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">💳 Tổng tiền</span>
                    <span className="font-bold font-mono text-primary text-sm">128.000đ</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">📌 Trạng thái đặt sân</span>
                    <span className="inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                      Đã xác nhận
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground block">💰 Trạng thái thanh toán</span>
                    <span className="inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                      Đã thanh toán
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                  <Button asChild className="flex-1 font-bold">
                    <Link to="/my-bookings">Xem lịch đặt</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 font-bold">
                    <Link to="/venues">Tiếp tục tìm sân</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Các trường hợp khác (Bottom section in Mockup 12) */}
            <div className="border-t border-border pt-8 text-left max-w-4xl mx-auto space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Các trường hợp khác</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Khi thanh toán thất bại */}
                <div className="p-4 rounded-2xl border border-destructive/30 bg-destructive/5 flex items-start gap-3">
                  <div className="size-10 rounded-full bg-destructive text-white flex items-center justify-center shrink-0 font-bold">✕</div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-xs text-destructive">Chưa ghi nhận thanh toán</h5>
                    <p className="text-[11px] text-muted-foreground">Đã có lỗi xảy ra trong quá trình xử lý thanh toán. Vui lòng thử lại.</p>
                    <Button size="sm" variant="outline" className="text-xs font-bold mt-2" onClick={() => setStep('payment')}>
                      Thử lại
                    </Button>
                  </div>
                </div>

                {/* Khi khung giờ vừa hết */}
                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex items-start gap-3">
                  <div className="size-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold">!</div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-xs text-amber-700 dark:text-amber-400">Khung giờ đã được đặt</h5>
                    <p className="text-[11px] text-muted-foreground">Vui lòng chọn giờ khác.</p>
                    <Button size="sm" variant="outline" className="text-xs font-bold mt-2" onClick={() => navigate('/venues')}>
                      Chọn lại giờ
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}