import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, PawPrint } from 'lucide-react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosClient from '@/config/axiosClient';

export default function UserRegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      await axiosClient.post('/auth/register', formData);

      await Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công!',
        text: 'Tài khoản của bạn đã được khởi tạo. Hãy đăng nhập để bắt đầu.',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/login');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      const errorMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === 'string' ? error.response.data : null) ||
        'Đăng ký không thành công, vui lòng kiểm tra lại thông tin!';

      Swal.fire({
        icon: 'error',
        title: 'Đăng ký thất bại',
        text: errorMsg,
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f1115] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-card rounded-2xl border border-border shadow-xl overflow-hidden grid md:grid-cols-2">
        {/* Left Hero */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 p-8 text-white flex flex-col justify-between">
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-white mb-8">
              <PawPrint className="size-8" />
              VetCare Clinic
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl leading-tight mb-4">
              Gia nhập cộng đồng yêu thú cưng.
            </h1>
            <p className="text-sm opacity-90 leading-relaxed max-w-sm">
              Đăng ký tài khoản miễn phí để quản lý hồ sơ thú cưng, đặt lịch hẹn nhanh chóng và nhận tư vấn sức khỏe từ Bác sĩ Thú y AI.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Tạo Tài Khoản Mới</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Điền các thông tin dưới đây để đăng ký.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <Label className="text-xs font-semibold">Họ và tên của bạn *</Label>
              <Input
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="bg-background text-sm rounded-xl"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Tên đăng nhập (Username) *</Label>
              <Input
                type="text"
                placeholder="nguyenvana"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-background text-sm rounded-xl"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Địa chỉ Email *</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background text-sm rounded-xl"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Mật khẩu *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tối thiểu 6 ký tự"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-background text-sm pr-9 rounded-xl"
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

            <Button type="submit" disabled={isSubmitting} className="w-full mt-4 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Đang khởi tạo tài khoản...
                </>
              ) : (
                'Đăng ký tài khoản'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
