import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChevronRight, MapPin, Clock, Users, Home, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { courts, venues, sports, timeSlots } from '@/services/mock-data';
import { cn } from '@/services/utils';

export default function UserCourtBookingPage() {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const court = courts.find((c) => c.id === Number(courtId)) || courts[1];
  const venue = venues.find((v) => v.id === court.venueId) || venues[0];

  const [selectedDate, setSelectedDate] = useState('20'); // ngày 20
  const [selectedSlots, setSelectedSlots] = useState([3, 4]); // Slot 18:00-19:00, 19:00-20:00

  const toggleSlot = (id) => {
    if (selectedSlots.includes(id)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== id));
    } else {
      setSelectedSlots([...selectedSlots, id]);
    }
  };

  const totalPrice = selectedSlots.length * 80000;

  const handleContinue = () => {
    navigate('/booking-confirm');
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Breadcrumb (Trang 09) */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Sân thể thao</Link>
          <ChevronRight className="size-3" />
          <Link to={`/venues/${venue.id}`} className="hover:text-foreground">{venue.name}</Link>
          <ChevronRight className="size-3" />
          <span className="font-semibold text-foreground">{court.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Court Info + Intro */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-border shadow-md relative">
              <img src={court.image} alt={court.name} className="size-full object-cover" />
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-black text-foreground">{court.name}</h1>
              <p className="text-xs font-semibold text-muted-foreground">{venue.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="size-3.5 text-primary shrink-0" /> {court.address || venue.address}
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Mở bản đồ chỉ đường'); }} className="text-primary hover:underline ml-2">Xem trên bản đồ</a>
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs">
                <span className="flex items-center gap-1.5 font-semibold bg-muted px-3 py-1.5 rounded-xl">
                  <Home className="size-4 text-primary" /> Trong nhà (Thoải mái, không lo thời tiết)
                </span>
                <span className="flex items-center gap-1.5 font-semibold bg-muted px-3 py-1.5 rounded-xl">
                  <Users className="size-4 text-primary" /> 4 người (Sức chứa khuyến nghị)
                </span>
                <span className="flex items-center gap-1.5 font-semibold bg-muted px-3 py-1.5 rounded-xl">
                  <Clock className="size-4 text-primary" /> 06:00 - 22:00 (Giờ hoạt động)
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <h3 className="font-bold text-sm">Giới thiệu sân</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {court.description || 'Sân cầu lông đạt tiêu chuẩn, mặt sân chất lượng cao, không gian trong nhà thoáng mát, đèn chiếu sáng hiện đại. Phù hợp cho chơi phong trào và thi đấu.'}
              </p>
            </div>
          </div>

          {/* Right Column: Calendar & Time Slots & Summary (Trang 09) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="rounded-2xl border-border shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-sm text-foreground">Chọn ngày và khung giờ</h3>
                  <p className="text-[11px] text-muted-foreground font-mono">Tháng 9, 2026</p>
                </div>

                {/* Day selector strip */}
                <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => (
                    <span key={day} className="text-[10px] text-muted-foreground font-semibold">{day}</span>
                  ))}
                  {[14, 15, 16, 17, 18, 19, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedDate(num.toString())}
                      className={cn(
                        'size-9 rounded-full flex items-center justify-center font-bold transition-all cursor-pointer mx-auto text-xs',
                        selectedDate === num.toString()
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'hover:bg-muted text-foreground'
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* Time Slots Grid (Matching Mockup 09) */}
                <div className="space-y-2 border-t border-border/60 pt-4">
                  <label className="text-xs font-bold text-muted-foreground uppercase block">Khung giờ trong ngày</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedSlots.includes(slot.id);
                      return (
                        <button
                          key={slot.id}
                          onClick={() => toggleSlot(slot.id)}
                          className={cn(
                            'p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5',
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary font-bold shadow-md'
                              : slot.status === 'booked'
                              ? 'bg-muted text-muted-foreground/60 border-border cursor-not-allowed'
                              : 'bg-card hover:border-primary text-foreground'
                          )}
                        >
                          <span className="text-xs font-bold font-mono">{slot.start} - {slot.end}</span>
                          <span className="text-[10px] opacity-80 font-mono">80.000đ</span>
                          <span className="text-[9px] mt-0.5">
                            {isSelected ? 'Đã chọn ✓' : slot.status === 'booked' ? 'Đã đặt' : 'Còn trống'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tóm tắt lựa chọn (Bottom Card in Mockup 09) */}
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">Tóm tắt lựa chọn</span>
                    <span className="text-xs font-bold text-primary font-mono">{selectedSlots.length} khung giờ</span>
                  </div>

                  <div className="bg-muted p-3 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">📅 Ngày</span>
                      <span className="font-bold">20/09/2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">🕒 Khung giờ</span>
                      <span className="font-bold font-mono">18:00 - 20:00 ({selectedSlots.length} khung giờ)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">🏷️ Đơn giá</span>
                      <span className="font-bold font-mono">80.000đ / khung giờ</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold pt-1">
                    <span>Tổng cộng:</span>
                    <span className="text-primary text-lg font-mono">{totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>

                  <Button onClick={handleContinue} className="w-full font-bold size-11 text-sm shadow-md">
                    Tiếp tục →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}