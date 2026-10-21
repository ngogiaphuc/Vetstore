import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CreditCard, Stethoscope, FileText, XCircle, CheckCircle2, AlertCircle, Loader2, PawPrint } from 'lucide-react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axiosClient from '@/config/axiosClient';

export default function MyBookingsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [recordLoading, setRecordLoading] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/appointments/my');
      setAppointments(res.data);
    } catch (err) {
      console.error('Lỗi tải lịch hẹn:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handlePayVNPay = async (appointmentId, code) => {
    try {
      const res = await axiosClient.post('/payments/create-vnpay-url', {
        appointmentId,
      });
      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không tạo được đường link thanh toán VNPay.' });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Thất bại', text: err.response?.data?.message || 'Lỗi kết nối cổng thanh toán VNPay' });
    }
  };

  const handleCancel = async (id, code) => {
    const res = await Swal.fire({
      title: `Hủy lịch hẹn ${code}?`,
      text: 'Bạn có chắc chắn muốn hủy lịch hẹn khám này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Đồng ý hủy',
      cancelButtonText: 'Không',
    });

    if (res.isConfirmed) {
      try {
        await axiosClient.post(`/appointments/${id}/cancel`);
        Swal.fire({ icon: 'success', title: 'Đã hủy lịch hẹn', timer: 1200, showConfirmButton: false });
        fetchAppointments();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể hủy lịch hẹn này.' });
      }
    }
  };

  const handleViewMedicalRecord = async (appointmentId) => {
    try {
      setRecordLoading(true);
      setRecordModalOpen(true);
      const res = await axiosClient.get(`/medical-records/appointment/${appointmentId}`);
      setSelectedRecord(res.data);
    } catch (err) {
      setSelectedRecord(null);
    } finally {
      setRecordLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Đã xác nhận</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Đã khám xong</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">Đã hủy</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Chờ duyệt</Badge>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <Calendar className="size-7 text-emerald-600" /> Lịch Hẹn Khám Thú Cưng Của Tôi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Theo dõi trạng thái lịch khám, thanh toán trực tuyến qua VNPay và xem đơn thuốc, bệnh án điện tử.
          </p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shrink-0">
          <Link to="/booking">+ Đặt lịch hẹn mới</Link>
        </Button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-sm">Đang tải danh sách lịch khám...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
          <PawPrint className="size-16 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground">Bạn chưa có lịch hẹn khám nào</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Hãy đặt lịch chăm sóc sức khỏe cho bé yêu của bạn ngay hôm nay.
          </p>
          <Button asChild className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
            <Link to="/booking">Đặt lịch khám ngay</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-extrabold px-2.5 py-1 bg-muted rounded-md text-foreground">
                    {item.appointmentCode}
                  </span>
                  {getStatusBadge(item.status)}
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    item.paymentStatus === 'PAID'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {item.paymentStatus === 'PAID' ? '✓ Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground">{item.serviceName}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      🐾 Bé: <strong className="text-emerald-600">{item.petName}</strong> ({item.petSpecies})
                    </span>
                    <span>👨‍⚕️ Bác sĩ: <strong>{item.doctorName}</strong></span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" /> {item.appointmentTime} ngày {item.appointmentDate}
                    </span>
                  </div>
                </div>

                {item.notes && (
                  <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border/40">
                    <span className="font-semibold text-foreground">Ghi chú triệu chứng:</span> {item.notes}
                  </p>
                )}
              </div>

              {/* Actions & Price */}
              <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-border/60 shrink-0">
                <div className="text-left md:text-right mb-4">
                  <span className="text-[11px] text-muted-foreground block">Chi phí:</span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    {formatPrice(item.totalAmount)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Nút Xem bệnh án khi đã khám xong */}
                  {item.status === 'COMPLETED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-blue-500/30 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      onClick={() => handleViewMedicalRecord(item.id)}
                    >
                      <FileText className="mr-1.5 size-3.5" /> Xem Bệnh Án & Đơn Thuốc
                    </Button>
                  )}

                  {/* Nút Thanh toán VNPay khi chưa thanh toán và chưa hủy */}
                  {item.paymentStatus !== 'PAID' && item.status !== 'CANCELLED' && (
                    <Button
                      size="sm"
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      onClick={() => handlePayVNPay(item.id, item.appointmentCode)}
                    >
                      <CreditCard className="mr-1.5 size-3.5" /> Thanh toán VNPay
                    </Button>
                  )}

                  {/* Nút Hủy lịch khi đang chờ duyệt */}
                  {item.status === 'PENDING' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      onClick={() => handleCancel(item.id, item.appointmentCode)}
                    >
                      <XCircle className="mr-1 size-3.5" /> Hủy hẹn
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Bệnh Án Điện Tử */}
      <Dialog open={recordModalOpen} onOpenChange={setRecordModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600">
              <FileText className="size-5" /> Hồ Sơ Bệnh Án & Đơn Thuốc Điện Tử
            </DialogTitle>
          </DialogHeader>

          {recordLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              <Loader2 className="size-6 animate-spin mx-auto mb-2 text-emerald-600" />
              <p className="text-xs">Đang tải thông tin bệnh án...</p>
            </div>
          ) : selectedRecord ? (
            <div className="space-y-4 py-2 text-xs">
              <div className="bg-muted/40 p-3 rounded-xl border border-border/60 grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Mã hẹn:</span> <strong>{selectedRecord.appointmentCode}</strong></div>
                <div><span className="text-muted-foreground">Bé cưng:</span> <strong>{selectedRecord.petName}</strong></div>
                <div><span className="text-muted-foreground">Bác sĩ:</span> <strong>{selectedRecord.doctorName}</strong></div>
                <div><span className="text-muted-foreground">Ngày lập:</span> <strong>{new Date(selectedRecord.createdAt).toLocaleDateString('vi-VN')}</strong></div>
              </div>

              <div>
                <Label className="font-bold text-foreground">Triệu chứng lâm sàng:</Label>
                <div className="bg-background p-2.5 rounded-lg border border-border mt-1">
                  {selectedRecord.symptoms || 'Không ghi nhận triệu chứng bất thường.'}
                </div>
              </div>

              <div>
                <Label className="font-bold text-emerald-700 dark:text-emerald-400">Chẩn đoán của Bác sĩ:</Label>
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg mt-1 font-semibold text-foreground">
                  {selectedRecord.diagnosis}
                </div>
              </div>

              <div>
                <Label className="font-bold text-foreground">Đơn thuốc & Hướng dẫn sử dụng:</Label>
                <div className="bg-background p-2.5 rounded-lg border border-border mt-1 whitespace-pre-line font-mono text-[11px]">
                  {selectedRecord.prescription || 'Không cần dùng thuốc.'}
                </div>
              </div>

              <div>
                <Label className="font-bold text-foreground">Lời dặn chăm sóc tại nhà:</Label>
                <div className="bg-background p-2.5 rounded-lg border border-border mt-1">
                  {selectedRecord.doctorNotes || 'Ăn uống nghỉ ngơi đầy đủ, tái khám theo lịch hẹn.'}
                </div>
              </div>

              {selectedRecord.reExaminationDate && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg text-amber-700 dark:text-amber-400 font-bold">
                  📅 Hẹn tái khám ngày: {selectedRecord.reExaminationDate}
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <AlertCircle className="size-8 mx-auto mb-2 text-muted-foreground/60" />
              <p className="text-xs">Bác sĩ chưa cập nhật bệnh án chi tiết cho ca khám này.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
