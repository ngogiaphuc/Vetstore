import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, PawPrint } from 'lucide-react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosClient from '@/config/axiosClient';

export default function UserLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await axiosClient.post('/auth/login', {
        username,
        password,
      });

      const { accessToken, username: loggedUsername, roles } = response.data;
      localStorage.setItem('accessToken', accessToken);

      await Swal.fire({
        icon: 'success',
        title: 'Đăng nhập thành công!',
        text: `Chào mừng ${loggedUsername || 'bạn'} đến với VetCare Clinic.`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Nếu là Admin hoặc Vet, có thể đưa vào admin
      if (roles?.some((r) => ['ROLE_ADMIN', 'ROLE_OWNER', 'ROLE_VET', 'ADMIN', 'VET'].includes(r))) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      const errorMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === 'string' ? error.response.data : null) ||
        'Tài khoản hoặc mật khẩu không chính xác!';

      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại',
        text: errorMsg,
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { value: email } = await Swal.fire({
      title: 'Đăng nhập bằng Google (Gmail)',
      input: 'email',
      inputLabel: 'Nhập địa chỉ Gmail của bạn',
      inputPlaceholder: 'example@gmail.com',
      inputValue: 'chunuoi.demo@gmail.com',
      showCancelButton: true,
      confirmButtonText: 'Đăng nhập với Google',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#10b981',
      inputValidator: (value) => {
        if (!value) {
          return 'Vui lòng nhập email hợp lệ!';
        }
      },
    });

    if (email) {
      try {
        setIsGoogleSubmitting(true);
        const name = email.split('@')[0];
        const res = await axiosClient.post('/auth/google', {
          email,
          name: name.toUpperCase(),
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        });

        const { accessToken, username: loggedUsername } = res.data;
        localStorage.setItem('accessToken', accessToken);

        await Swal.fire({
          icon: 'success',
          title: 'Google Login Thành Công!',
          text: `Đã kết nối tài khoản Google: ${email}`,
          timer: 1500,
          showConfirmButton: false,
        });

        navigate('/');
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập Google thất bại',
          text: err.response?.data?.message || 'Không thể xác thực tài khoản Google.',
        });
      } finally {
        setIsGoogleSubmitting(false);
      }
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'info',
      title: 'Quên mật khẩu?',
      text: 'Vui lòng liên hệ Hotline: 1900 888 999 hoặc nhắn tin qua Trợ lý Bác sĩ AI để được hỗ trợ cấp lại mật khẩu!',
      confirmButtonColor: '#10b981',
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f1115] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-card rounded-2xl border border-border shadow-xl overflow-hidden grid md:grid-cols-2">
        {/* Left Hero Card */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 p-8 text-white flex flex-col justify-between overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-white mb-8">
              <PawPrint className="size-8 text-white" />
              VetCare Clinic
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl leading-tight mb-4">
              Chăm sóc bé cưng bằng cả trái tim.
            </h1>
            <p className="text-sm opacity-90 leading-relaxed max-w-sm">
              Đăng nhập để đặt lịch khám, theo dõi đơn thuốc, bệnh án và nhận thông báo nhắc lịch tiêm phòng định kỳ.
            </p>
          </div>

          <div className="relative z-10 mt-12 pt-6 border-t border-white/20 flex items-center justify-between text-xs">
            <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2 border border-white/20">
              <span className="font-semibold block text-white">Y Bác Sĩ Tận Tâm</span>
              <span className="text-white/80">Trang Thiết Bị Hiện Đại</span>
            </div>
            <div className="flex gap-2 text-[10px] font-mono tracking-widest text-white/80 uppercase">
              <span>24/7 CẤP CỨU</span> • <span>VNPAY</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Đăng Nhập</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Đăng nhập tài khoản của bạn để tiếp tục.
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleSubmitting}
            className="w-full mb-4 py-2.5 px-4 border border-border rounded-xl flex items-center justify-center gap-3 text-xs font-bold bg-background hover:bg-muted text-foreground transition shadow-2xs cursor-pointer"
          >
            <svg className="size-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {isGoogleSubmitting ? 'Đang kết nối Google...' : 'Đăng nhập nhanh với Google (Gmail)'}
          </button>

          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <span className="relative bg-card px-2 text-[11px] text-muted-foreground uppercase">Hoặc tài khoản hệ thống</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs font-semibold">Tài khoản</Label>
              <Input
                id="username"
                type="text"
                placeholder="Nhập username (ví dụ: customer, vet, admin)"
                className="bg-background text-sm rounded-xl"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold">Mật khẩu</Label>
                <a
                  href="#"
                  onClick={handleForgotPassword}
                  className="text-xs text-emerald-600 font-medium hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  className="bg-background text-sm pr-9 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>

          <div className="mt-4 p-2.5 rounded-xl bg-muted/40 border border-border/40 text-[11px] text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Tài khoản mẫu thử nghiệm:</p>
            <p>• Khách hàng: <code>customer</code> / <code>customer123</code></p>
            <p>• Bác sĩ thú y: <code>vet</code> / <code>vet123</code></p>
            <p>• Quản trị viên: <code>admin</code> / <code>admin123</code></p>
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-emerald-600 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
