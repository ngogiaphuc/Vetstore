import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axiosClient from '@/config/axiosClient';

export default function VNPayReturnPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        const response = await axiosClient.get('/payments/vnpay-return', { params });
        setResult(response.data);
      } catch (err) {
        console.error('Lỗi kiểm tra VNPay:', err);
        setResult({
          isSuccess: searchParams.get('vnp_ResponseCode') === '00',
          amount: Number(searchParams.get('vnp_Amount') || 0) / 100,
          transactionNo: searchParams.get('vnp_TransactionNo'),
          bankCode: searchParams.get('vnp_BankCode'),
          appointmentCode: searchParams.get('vnp_TxnRef'),
        });
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="size-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-foreground">Đang xác thực giao dịch với VNPay...</h2>
        <p className="text-sm text-muted-foreground mt-2">Vui lòng chờ trong giây lát, không tắt trình duyệt.</p>
      </div>
    );
  }

  const isSuccess = result?.isSuccess;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden p-8 text-center">
        {isSuccess ? (
          <>
            <div className="size-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="size-12" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground">Thanh Toán Trực Tuyến Thành Công!</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Lịch hẹn khám thú cưng tại VetCare Clinic đã được xác nhận và thanh toán qua cổng VNPay.
            </p>

            <div className="bg-muted/40 rounded-xl p-5 my-6 text-left space-y-3 text-sm border border-border/60">
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Mã lịch hẹn:</span>
                <span className="font-mono font-bold text-foreground">{result?.appointmentCode || 'VET-ONLINE'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Số tiền thanh toán:</span>
                <span className="text-lg font-extrabold text-emerald-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(result?.amount || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Phương thức:</span>
                <span className="font-semibold text-foreground">Cổng thanh toán VNPay ({result?.bankCode || 'VNPAYQR'})</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Mã giao dịch VNPay:</span>
                <span className="font-mono text-muted-foreground">{result?.transactionNo || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Trạng thái:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <ShieldCheck className="size-3.5" /> ĐÃ THANH TOÁN
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-6">
              📩 Hóa đơn và thông tin lịch hẹn đã được gửi tự động qua email của bạn.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                <Link to="/my-bookings">
                  <Calendar className="mr-2 size-4" /> Xem lịch hẹn của tôi
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Quay về trang chủ</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="size-20 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <XCircle className="size-12" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground">Thanh Toán Không Thành Công</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Giao dịch đã bị hủy hoặc có lỗi xảy ra trong quá trình thanh toán qua VNPay.
            </p>

            <div className="my-6">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                <Link to="/my-bookings">Quay lại danh sách lịch hẹn để thử lại</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

