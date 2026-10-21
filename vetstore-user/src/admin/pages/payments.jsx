import { useState, useEffect } from 'react';
import { CircleDollarSign, CheckCircle2, Clock, XCircle, Search, CreditCard, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import axiosClient from '@/config/axiosClient';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/payments');
        setPayments(res.data);
      } catch (err) {
        console.error('Lỗi tải danh sách thanh toán:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const filtered = payments.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (p.transactionNo && p.transactionNo.toLowerCase().includes(s)) ||
      (p.bankCode && p.bankCode.toLowerCase().includes(s)) ||
      (p.appointment && p.appointment.appointmentCode && p.appointment.appointmentCode.toLowerCase().includes(s))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <CircleDollarSign className="size-6 text-emerald-600" /> Lịch Sử Thanh Toán Trực Tuyến VNPay
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Danh sách giao dịch thanh toán phí khám và dịch vụ thú y qua cổng VNPay Sandbox.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 flex justify-between items-center shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã GD, ngân hàng, mã hẹn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs">Đang tải lịch sử thanh toán...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
          <CreditCard className="size-12 mx-auto mb-2 text-muted-foreground/40" />
          <p className="font-bold text-foreground">Chưa có giao dịch thanh toán nào</p>
          <p className="text-xs mt-1">Các giao dịch qua cổng VNPay sẽ hiển thị tại đây.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5">Mã Giao Dịch</th>
                  <th className="p-3.5">Mã Lịch Hẹn</th>
                  <th className="p-3.5">Cổng Thanh Toán</th>
                  <th className="p-3.5">Ngân Hàng</th>
                  <th className="p-3.5">Số Tiền</th>
                  <th className="p-3.5">Thời Gian</th>
                  <th className="p-3.5">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition">
                    <td className="p-3.5 font-mono font-bold text-foreground">
                      {p.transactionNo || 'VNP-' + p.id}
                    </td>
                    <td className="p-3.5 font-mono text-emerald-600 font-semibold">
                      {p.appointment?.appointmentCode || 'N/A'}
                    </td>
                    <td className="p-3.5 font-semibold text-foreground">{p.paymentMethod}</td>
                    <td className="p-3.5">{p.bankCode || 'VNPAYQR'}</td>
                    <td className="p-3.5 font-extrabold text-emerald-600">
                      {formatPrice(p.amount)}
                    </td>
                    <td className="p-3.5 text-muted-foreground">
                      {p.paymentTime ? new Date(p.paymentTime).toLocaleString('vi-VN') : 'Vừa xong'}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        p.status === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-rose-500/10 text-rose-600'
                      }`}>
                        {p.status === 'SUCCESS' ? '✓ Thành công' : 'Thất bại'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
