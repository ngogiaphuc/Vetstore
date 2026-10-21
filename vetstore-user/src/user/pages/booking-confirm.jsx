import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UserBookingConfirmPage() {
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState('SPORT20');
  const [appliedVoucher, setAppliedVoucher] = useState(true);
  const [note, setNote] = useState('');

  const subtotal = 160000;
  const discount = appliedVoucher ? 32000 : 0;
  const total = subtotal - discount;

  const handleApplyVoucher = () => {
    if (voucher.toUpperCase() === 'SPORT20') {
      setAppliedVoucher(true);
    } else {
      alert('Mã giảm giá không hợp lệ!');
    }
  };

  const handlePayment = () => {
    navigate('/payment');
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block">
            10. XÁC NHẬN ĐẶT SÂN
          </span>
          <h1 className="text-2xl font-black text-foreground">Thông tin liên hệ</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Chúng tôi sẽ gửi xác nhận đặt sân qua thông tin này.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Contact Form & Booking Details (Trang 10) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="rounded-2xl border-border shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Họ và tên</Label>
                  <Input value="Minh Huy" readOnly className="bg-muted text-sm font-semibold" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Số điện thoại</Label>
                  <Input value="0901234567" readOnly className="bg-muted text-sm font-semibold font-mono" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Ghi chú (không bắt buộc)</Label>
                  <textarea
                    rows={3}
                    placeholder="Ví dụ: Cần hỗ trợ thêm, yêu cầu đặc biệt..."
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground text-right font-mono">0/200</p>
                </div>
              </CardContent>
            </Card>

            {/* Chi tiết đặt sân Table */}
            <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-bold text-sm text-foreground">Chi tiết đặt sân</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted text-muted-foreground uppercase font-bold text-[10px] border-b border-border">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Sân</th>
                        <th className="py-2.5 px-3">Khung giờ</th>
                        <th className="py-2.5 px-3 text-right">Đơn giá</th>
                        <th className="py-2.5 px-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      <tr>
                        <td className="py-3 px-3 font-semibold">1</td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-foreground">Sân cầu lông 02</p>
                          <p className="text-[10px] text-muted-foreground">Phú Thọ Sports Center</p>
                        </td>
                        <td className="py-3 px-3 font-mono">18:00 - 19:00</td>
                        <td className="py-3 px-3 text-right font-mono">80.000đ</td>
                        <td className="py-3 px-3 text-right font-mono font-bold">80.000đ</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-semibold">2</td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-foreground">Sân cầu lông 02</p>
                          <p className="text-[10px] text-muted-foreground">Phú Thọ Sports Center</p>
                        </td>
                        <td className="py-3 px-3 font-mono">19:00 - 20:00</td>
                        <td className="py-3 px-3 text-right font-mono">80.000đ</td>
                        <td className="py-3 px-3 text-right font-mono font-bold">80.000đ</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Voucher Box (Exact Mockup 10) */}
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full flex gap-2">
                    <Input
                      placeholder="Mã giảm giá"
                      value={voucher}
                      onChange={(e) => setVoucher(e.target.value)}
                      className="bg-card text-xs font-mono font-bold uppercase"
                    />
                    <Button variant="outline" size="sm" onClick={handleApplyVoucher} className="font-bold text-xs">
                      Áp dụng
                    </Button>
                  </div>

                  {appliedVoucher && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="size-4" />
                      <span className="font-bold">Giảm 20% - Áp dụng thành công!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Order Summary Card (Matching Mockup 10) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="rounded-2xl border-border shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-base text-foreground">Tóm tắt đơn hàng</h3>

                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <img src="/images/venue-badminton.png" alt="Sân cầu lông 02" className="size-16 rounded-xl object-cover shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Sân cầu lông 02</h4>
                    <p className="text-xs text-muted-foreground">Phú Thọ Sports Center</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">📅 Ngày</span>
                    <span className="font-bold font-mono">20/09/2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">🕒 Khung giờ</span>
                    <span className="font-bold font-mono">18:00 - 20:00 (2 khung giờ)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">👥 Số lượng</span>
                    <span className="font-bold">2 khung giờ</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="font-bold font-mono">160.000đ</span>
                  </div>
                  {appliedVoucher && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Giảm giá (SPORT20)</span>
                      <span className="font-mono">-32.000đ</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4 flex justify-between items-center text-base font-black">
                  <span>Tổng cộng</span>
                  <span className="text-primary text-xl font-mono">{total.toLocaleString('vi-VN')}đ</span>
                </div>

                <Button onClick={handlePayment} className="w-full font-bold size-11 text-sm shadow-md mt-2">
                  Tiếp tục thanh toán
                </Button>

                <Button variant="outline" className="w-full text-xs font-bold" onClick={() => navigate(-1)}>
                  Quay lại
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}