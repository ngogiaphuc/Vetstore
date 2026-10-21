import { useState, useEffect } from 'react';
import { Calendar, Clock, Stethoscope, PawPrint, CheckCircle2, XCircle, FileText, Loader2, Search, Filter } from 'lucide-react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import axiosClient from '@/config/axiosClient';

export default function BookingsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  // Medical Record Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [savingRecord, setSavingRecord] = useState(false);
  const [recordForm, setRecordForm] = useState({
    symptoms: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    doctorNotes: '',
    reExaminationDate: '',
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error('Lỗi tải danh sách lịch khám:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axiosClient.patch(`/appointments/${id}/status`, { status });
      Swal.fire({ icon: 'success', title: `Đã cập nhật: ${status}`, timer: 1000, showConfirmButton: false });
      fetchAppointments();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể cập nhật trạng thái lịch hẹn.' });
    }
  };

  const handleOpenMedicalRecord = async (appt) => {
    setSelectedAppt(appt);
    try {
      const res = await axiosClient.get(`/medical-records/appointment/${appt.id}`);
      const m = res.data;
      setRecordForm({
        symptoms: m.symptoms || appt.notes || '',
        diagnosis: m.diagnosis || '',
        treatment: m.treatment || '',
        prescription: m.prescription || '',
        doctorNotes: m.doctorNotes || '',
        reExaminationDate: m.reExaminationDate || '',
      });
    } catch (err) {
      setRecordForm({
        symptoms: appt.notes || '',
        diagnosis: '',
        treatment: '',
        prescription: '',
        doctorNotes: '',
        reExaminationDate: '',
      });
    }
    setModalOpen(true);
  };

  const handleSaveMedicalRecord = async (e) => {
    e.preventDefault();
    if (!recordForm.diagnosis.trim()) {
      Swal.fire({ icon: 'warning', title: 'Thiếu chẩn đoán', text: 'Vui lòng nhập chẩn đoán của bác sĩ.' });
      return;
    }

    try {
      setSavingRecord(true);
      await axiosClient.post('/medical-records', {
        appointmentId: selectedAppt.id,
        ...recordForm,
        reExaminationDate: recordForm.reExaminationDate || null,
      });

      Swal.fire({
        icon: 'success',
        title: 'Đã lưu bệnh án & đơn thuốc!',
        text: 'Lịch khám đã được chuyển sang trạng thái HOÀN THÀNH.',
        timer: 1500,
        showConfirmButton: false,
      });

      setModalOpen(false);
      fetchAppointments();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể lưu bệnh án.' });
    } finally {
      setSavingRecord(false);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchStatus = filterStatus === 'ALL' || a.status === filterStatus;
    const matchSearch =
      !search ||
      a.appointmentCode.toLowerCase().includes(search.toLowerCase()) ||
      a.customerName.toLowerCase().includes(search.toLowerCase()) ||
      a.petName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Stethoscope className="size-6 text-emerald-600" /> Quản Lý Lịch Hẹn & Khám Bệnh Thú Y
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dành cho Bác sĩ Thú y & Ban quản lý: duyệt lịch hẹn, theo dõi ca khám và ghi bệnh án điện tử.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === st
                  ? 'bg-emerald-600 text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {st === 'ALL' ? 'Tất cả' : st === 'PENDING' ? 'Chờ duyệt' : st === 'CONFIRMED' ? 'Đã xác nhận' : st === 'COMPLETED' ? 'Đã khám xong' : 'Đã hủy'}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã, tên chủ, tên pet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs">Đang tải lịch khám...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
          <PawPrint className="size-12 mx-auto mb-2 text-muted-foreground/40" />
          <p className="font-bold text-foreground">Không có lịch hẹn nào</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5">Mã Hẹn</th>
                  <th className="p-3.5">Chủ Nuôi</th>
                  <th className="p-3.5">Bé Thú Cưng</th>
                  <th className="p-3.5">Dịch Vụ</th>
                  <th className="p-3.5">Bác Sĩ</th>
                  <th className="p-3.5">Thời Gian</th>
                  <th className="p-3.5">Thanh Toán</th>
                  <th className="p-3.5">Trạng Thái</th>
                  <th className="p-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/20 transition">
                    <td className="p-3.5 font-mono font-bold text-foreground">{a.appointmentCode}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-foreground">{a.customerName}</div>
                      <div className="text-[10px] text-muted-foreground">{a.customerPhone || 'N/A'}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-emerald-600">{a.petName}</span>{' '}
                      <span className="text-[11px] text-muted-foreground">({a.petSpecies})</span>
                    </td>
                    <td className="p-3.5 font-medium">{a.serviceName}</td>
                    <td className="p-3.5">{a.doctorName}</td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div>{a.appointmentTime}</div>
                      <div className="text-[10px] text-muted-foreground">{a.appointmentDate}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        a.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {a.paymentStatus === 'PAID' ? 'Đã TT' : 'Chưa TT'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        a.status === 'CONFIRMED'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : a.status === 'COMPLETED'
                          ? 'bg-blue-500/10 text-blue-600'
                          : a.status === 'CANCELLED'
                          ? 'bg-rose-500/10 text-rose-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {/* Bác sĩ ghi bệnh án & kê đơn */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs text-blue-600 border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        onClick={() => handleOpenMedicalRecord(a)}
                      >
                        <FileText className="size-3.5 mr-1" /> Bệnh Án
                      </Button>

                      {a.status === 'PENDING' && (
                        <Button
                          size="sm"
                          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                          onClick={() => handleUpdateStatus(a.id, 'CONFIRMED')}
                        >
                          Duyệt
                        </Button>
                      )}

                      {a.status !== 'CANCELLED' && a.status !== 'COMPLETED' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-rose-500 hover:text-rose-600"
                          onClick={() => handleUpdateStatus(a.id, 'CANCELLED')}
                        >
                          Hủy
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Bác Sĩ Kê Đơn & Bệnh Án */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600">
              <Stethoscope className="size-5" /> Bệnh Án & Đơn Thuốc Thú Y ({selectedAppt?.appointmentCode})
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveMedicalRecord} className="space-y-3.5 py-2 text-xs">
            <div className="bg-muted/40 p-3 rounded-xl grid grid-cols-2 gap-2">
              <div>Bé thú cưng: <strong>{selectedAppt?.petName} ({selectedAppt?.petSpecies})</strong></div>
              <div>Chủ nuôi: <strong>{selectedAppt?.customerName}</strong></div>
            </div>

            <div>
              <Label className="font-bold">Triệu chứng lâm sàng ghi nhận *</Label>
              <textarea
                rows={2}
                placeholder="Ví dụ: Bé nôn ra bọt vàng, nhiệt độ 39.2°C, hạch họng sưng nhẹ..."
                value={recordForm.symptoms}
                onChange={(e) => setRecordForm({ ...recordForm, symptoms: e.target.value })}
                className="w-full rounded-xl border border-input bg-background p-2.5 mt-1"
              />
            </div>

            <div>
              <Label className="font-bold text-emerald-700 dark:text-emerald-400">Chẩn đoán của Bác sĩ *</Label>
              <Input
                placeholder="Ví dụ: Viêm dạ dày ruột cấp tính / Nhiễm nấm Microsporum..."
                value={recordForm.diagnosis}
                onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="font-bold">Phương pháp & Phác đồ điều trị</Label>
              <Input
                placeholder="Ví dụ: Kháng sinh đường uống kết hợp men vi sinh Bio-Clac..."
                value={recordForm.treatment}
                onChange={(e) => setRecordForm({ ...recordForm, treatment: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="font-bold">Đơn thuốc & Hướng dẫn sử dụng</Label>
              <textarea
                rows={3}
                placeholder={`1. Clavamox 62.5mg: 1 viên/ngày chia 2 lần sau ăn.\n2. Men tiêu hóa Bio: 1 gói/ngày pha nước ấm.\n3. Nhỏ gáy Bravecto 1 tuýp.`}
                value={recordForm.prescription}
                onChange={(e) => setRecordForm({ ...recordForm, prescription: e.target.value })}
                className="w-full rounded-xl border border-input bg-background p-2.5 mt-1 font-mono text-[11px]"
              />
            </div>

            <div>
              <Label className="font-bold">Lời dặn chăm sóc tại nhà</Label>
              <textarea
                rows={2}
                placeholder="Giữ ấm cho bé, kiêng ăn mỡ và sữa bò, uống đủ nước sạch..."
                value={recordForm.doctorNotes}
                onChange={(e) => setRecordForm({ ...recordForm, doctorNotes: e.target.value })}
                className="w-full rounded-xl border border-input bg-background p-2.5 mt-1"
              />
            </div>

            <div>
              <Label className="font-bold">Hẹn ngày tái khám (nếu có)</Label>
              <Input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={recordForm.reExaminationDate}
                onChange={(e) => setRecordForm({ ...recordForm, reExaminationDate: e.target.value })}
                className="mt-1"
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={savingRecord} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                {savingRecord ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                Lưu Bệnh Án & Hoàn Thành Khám
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
