import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Stethoscope, PawPrint, Heart, CreditCard, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosClient from '@/config/axiosClient';

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(searchParams.get('serviceId') || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointmentTime, setAppointmentTime] = useState('09:00');
  const [notes, setNotes] = useState('');

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [petsRes, servicesRes, doctorsRes] = await Promise.all([
          axiosClient.get('/pets').catch(() => ({ data: [] })),
          axiosClient.get('/services').catch(() => ({ data: [] })),
          axiosClient.get('/doctors').catch(() => ({ data: [] })),
        ]);

        setPets(petsRes.data);
        setServices(servicesRes.data);
        setDoctors(doctorsRes.data);

        if (petsRes.data.length > 0) {
          setSelectedPetId(petsRes.data[0].id.toString());
        }
        if (!selectedServiceId && servicesRes.data.length > 0) {
          setSelectedServiceId(servicesRes.data[0].id.toString());
        }
      } catch (err) {
        console.error('Lỗi khởi tạo form đặt lịch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedService = services.find((s) => s.id.toString() === selectedServiceId.toString());
  const selectedDoctor = doctors.find((d) => d.id.toString() === selectedDoctorId.toString());

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPetId) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa chọn thú cưng',
        text: 'Vui lòng thêm hoặc chọn bé thú cưng để tiếp tục.',
        confirmButtonText: 'Đến trang Thêm thú cưng',
      }).then((res) => {
        if (res.isConfirmed) navigate('/my-pets');
      });
      return;
    }

    if (!selectedServiceId) {
      Swal.fire({ icon: 'warning', title: 'Chưa chọn dịch vụ', text: 'Vui lòng chọn dịch vụ khám.' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        petId: Number(selectedPetId),
        serviceId: Number(selectedServiceId),
        doctorId: selectedDoctorId ? Number(selectedDoctorId) : null,
        appointmentDate,
        appointmentTime: appointmentTime.length === 5 ? `${appointmentTime}:00` : appointmentTime,
        notes,
      };

      const res = await axiosClient.post('/appointments', payload);
      const newAppointment = res.data;

      const swalRes = await Swal.fire({
        icon: 'success',
        title: 'Đặt lịch thành công!',
        html: `
          <p>Mã lịch hẹn: <b>${newAppointment.appointmentCode}</b></p>
          <p>Email xác nhận đã được gửi tới hòm thư của bạn.</p>
          <p class="text-sm text-gray-500 mt-2">Bạn có muốn thanh toán online ngay qua cổng VNPay để giữ chỗ ưu tiên không?</p>
        `,
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#64748b',
        confirmButtonText: '💳 Thanh toán VNPay ngay',
        cancelButtonText: 'Để sau (Thanh toán tại quầy)',
      });

      if (swalRes.isConfirmed) {
        // Tạo link VNPay
        const vnpRes = await axiosClient.post('/payments/create-vnpay-url', {
          appointmentId: newAppointment.id,
        });
        if (vnpRes.data?.paymentUrl) {
          window.location.href = vnpRes.data.paymentUrl;
          return;
        }
      }

      navigate('/my-bookings');
    } catch (err) {
      console.error('Lỗi đặt lịch:', err);
      Swal.fire({
        icon: 'error',
        title: 'Đặt lịch thất bại',
        text: err.response?.data?.message || 'Vui lòng đăng nhập để đặt lịch khám.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-emerald-600 mx-auto mb-2" />
        <p className="text-sm">Đang chuẩn bị lịch hẹn khám...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
          <Calendar className="size-7 text-emerald-600" /> Đặt Lịch Khám & Chăm Sóc Thú Cưng
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Hẹn lịch trực tuyến tại VetCare Clinic để được ưu tiên phục vụ, không phải chờ đợi.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form: Form fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Chọn Thú Cưng */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-sm font-bold flex items-center gap-2">
                <PawPrint className="size-4 text-emerald-600" /> 1. Chọn bé thú cưng đi khám *
              </Label>
              <Link to="/my-pets" className="text-xs font-semibold text-emerald-600 hover:underline">
                + Thêm bé mới
              </Link>
            </div>

            {pets.length === 0 ? (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-400">
                <p className="font-semibold mb-1">Bạn chưa có hồ sơ thú cưng nào!</p>
                <p>Vui lòng bấm <Link to="/my-pets" className="underline font-bold">Thêm bé mới</Link> để tạo hồ sơ trước khi đặt lịch nhé.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => setSelectedPetId(pet.id.toString())}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                      selectedPetId === pet.id.toString()
                        ? 'border-emerald-600 bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'border-border bg-background hover:bg-muted text-foreground'
                    }`}
                  >
                    <div className="size-10 rounded-full bg-muted overflow-hidden shrink-0">
                      <img
                        src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100'}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="truncate text-xs">
                      <div className="font-bold truncate">{pet.name}</div>
                      <div className="text-[11px] text-muted-foreground">{pet.species} • {pet.breed || 'Chưa rõ'}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Chọn Gói Dịch Vụ */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
            <Label className="text-sm font-bold flex items-center gap-2 mb-4">
              <Stethoscope className="size-4 text-emerald-600" /> 2. Chọn dịch vụ thú y *
            </Label>

            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-xs font-medium"
              required
            >
              <option value="">-- Chọn gói dịch vụ khám --</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - {formatPrice(s.price)} ({s.durationMinutes || 30} phút)
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Chọn Bác Sĩ */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
            <Label className="text-sm font-bold flex items-center gap-2 mb-4">
              <Heart className="size-4 text-emerald-600" /> 3. Bác sĩ phụ trách (Tùy chọn)
            </Label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedDoctorId('')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer text-xs ${
                  selectedDoctorId === ''
                    ? 'border-emerald-600 bg-emerald-500/10 dark:bg-emerald-950/40 font-bold text-emerald-700 dark:text-emerald-300'
                    : 'border-border bg-background hover:bg-muted'
                }`}
              >
                <div className="font-bold">Bác sĩ phòng khám chỉ định</div>
                <div className="text-[11px] text-muted-foreground">Phòng khám sẽ phân công bác sĩ tốt nhất</div>
              </button>

              {doctors.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDoctorId(doc.id.toString())}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer text-xs ${
                    selectedDoctorId === doc.id.toString()
                      ? 'border-emerald-600 bg-emerald-500/10 dark:bg-emerald-950/40 font-bold text-emerald-700 dark:text-emerald-300'
                      : 'border-border bg-background hover:bg-muted'
                  }`}
                >
                  <img
                    src={doc.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100'}
                    alt={doc.fullName}
                    className="size-9 rounded-full object-cover shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-bold truncate">{doc.fullName}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{doc.specialization}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Thời Gian & Triệu Chứng */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
            <Label className="text-sm font-bold flex items-center gap-2">
              <Clock className="size-4 text-emerald-600" /> 4. Ngày & Giờ khám
            </Label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground block mb-1">Ngày hẹn khám</Label>
                <Input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="bg-background text-sm rounded-xl"
                  required
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground block mb-1">Giờ hẹn</Label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs font-medium"
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground block mb-1">Mô tả triệu chứng / Yêu cầu đặc biệt</Label>
              <textarea
                rows={3}
                placeholder="Ví dụ: Bé nôn ra bọt trắng sáng nay, lười ăn, cần bác sĩ kiểm tra thêm tai mũi họng..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-3 text-sm shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Right Summary: Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-md sticky top-24">
            <h3 className="text-base font-bold text-foreground pb-3 border-b border-border">
              Tóm Tắt Lịch Hẹn
            </h3>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bé thú cưng:</span>
                <span className="font-bold text-foreground">
                  {pets.find((p) => p.id.toString() === selectedPetId)?.name || 'Chưa chọn'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dịch vụ:</span>
                <span className="font-bold text-foreground text-right max-w-[160px] truncate">
                  {selectedService?.name || 'Chưa chọn'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bác sĩ:</span>
                <span className="font-bold text-foreground">
                  {selectedDoctor?.fullName || 'Chỉ định ngẫu nhiên'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thời gian:</span>
                <span className="font-bold text-foreground">
                  {appointmentTime} • {appointmentDate}
                </span>
              </div>

              <div className="pt-3 border-t border-border flex justify-between items-baseline">
                <span className="text-sm font-bold text-foreground">Tổng chi phí:</span>
                <span className="text-xl font-extrabold text-emerald-600">
                  {formatPrice(selectedService?.price)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl shadow-md"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Đang đặt lịch...
                </>
              ) : (
                'Xác Nhận Đặt Lịch'
              )}
            </Button>

            <p className="text-[11px] text-muted-foreground text-center mt-3">
              Sau khi xác nhận, bạn có thể thanh toán trực tuyến qua <b>VNPay</b> hoặc thanh toán tại quầy sau khi khám.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

