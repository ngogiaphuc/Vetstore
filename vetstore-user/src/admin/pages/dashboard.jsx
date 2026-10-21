import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, CheckCircle2, Clock, DollarSign, PawPrint, Users, Stethoscope, ArrowRight,
  TrendingUp, ShieldCheck, Activity, Loader2
} from 'lucide-react';
import axiosClient from '@/config/axiosClient';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    totalPets: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Lỗi tải thống kê dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 text-white rounded-3xl p-8 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-200">
            Hệ thống Quản Trị Y Tế & Phòng Khám Thú Y
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">VetCare Operations Center</h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Theo dõi lưu lượng bệnh nhân thú cưng, trạng thái ca trực bác sĩ và doanh thu thanh toán VNPay theo thời gian thực.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/bookings"
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition shadow-xs"
          >
            Quản lý ca khám
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-semibold">Doanh thu VNPay</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {loading ? '...' : formatPrice(stats.totalRevenue)}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="size-3" /> Cổng thanh toán trực tuyến
            </span>
          </div>
          <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <DollarSign className="size-6" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-semibold">Tổng ca hẹn khám</span>
            <div className="text-2xl font-black text-foreground mt-1">
              {loading ? '...' : stats.totalAppointments}
            </div>
            <span className="text-[11px] text-muted-foreground font-medium mt-1 block">
              {stats.completedAppointments} ca đã hoàn thành
            </span>
          </div>
          <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Calendar className="size-6" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-semibold">Lịch chờ tiếp nhận</span>
            <div className="text-2xl font-black text-amber-500 mt-1">
              {loading ? '...' : stats.pendingAppointments}
            </div>
            <span className="text-[11px] text-amber-600 font-medium mt-1 block">
              Cần bác sĩ duyệt
            </span>
          </div>
          <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Clock className="size-6" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-semibold">Hồ sơ thú cưng</span>
            <div className="text-2xl font-black text-purple-600 mt-1">
              {loading ? '...' : stats.totalPets}
            </div>
            <span className="text-[11px] text-muted-foreground font-medium mt-1 block">
              {stats.totalUsers} khách hàng đăng ký
            </span>
          </div>
          <div className="size-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <PawPrint className="size-6" />
          </div>
        </div>
      </div>

      {/* Quick shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/bookings"
          className="bg-card border border-border rounded-2xl p-6 shadow-xs hover:border-emerald-500 transition group flex flex-col justify-between"
        >
          <div>
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
              <Stethoscope className="size-5" />
            </div>
            <h3 className="font-bold text-foreground text-base group-hover:text-emerald-600 transition">
              Quản lý Lịch Khám & Kê Đơn Thuốc
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Xem danh sách lịch hẹn hôm nay, duyệt ca khám, kê đơn thuốc và ghi bệnh án điện tử cho từng bé thú cưng.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center text-xs font-bold text-emerald-600">
            Mở bảng lịch khám <ArrowRight className="ml-1 size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/services"
          className="bg-card border border-border rounded-2xl p-6 shadow-xs hover:border-emerald-500 transition group flex flex-col justify-between"
        >
          <div>
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
              <Activity className="size-5" />
            </div>
            <h3 className="font-bold text-foreground text-base group-hover:text-emerald-600 transition">
              Danh Mục Dịch Vụ Thú Y
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Thiết lập các gói khám, giá tiêm chủng vắc xin, phẫu thuật triệt sản và combo spa tắm cắt tỉa lông.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center text-xs font-bold text-emerald-600">
            Quản lý gói dịch vụ <ArrowRight className="ml-1 size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/payments"
          className="bg-card border border-border rounded-2xl p-6 shadow-xs hover:border-emerald-500 transition group flex flex-col justify-between"
        >
          <div>
            <div className="size-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="font-bold text-foreground text-base group-hover:text-emerald-600 transition">
              Lịch Sử Giao Dịch VNPay
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Tra cứu mã giao dịch VNPay, số tiền thanh toán, trạng thái thành công và đối soát tài chính phòng khám.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center text-xs font-bold text-emerald-600">
            Xem sao kê thanh toán <ArrowRight className="ml-1 size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
