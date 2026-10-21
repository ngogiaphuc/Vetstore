import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProfileSidebar } from './profile';
import axiosClient from '@/config/axiosClient';

export default function UserChangePasswordPage() {

  const token = localStorage.getItem("accessToken");
  if(token === null) {
    return <Navigate to="/login" />
  }

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra khớp mật khẩu xác nhận
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa khớp mật khẩu',
        text: 'Mật khẩu mới và mật khẩu xác nhận không trùng khớp!',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    // 2. Kiểm tra độ dài tối thiểu
    if (newPassword.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Mật khẩu quá ngắn',
        text: 'Mật khẩu mới phải có ít nhất 6 ký tự!',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    // 3. Không cho đặt mật khẩu mới trùng mật khẩu cũ
    if (currentPassword === newPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Trùng mật khẩu cũ',
        text: 'Mật khẩu mới không được trùng với mật khẩu hiện tại!',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Gửi request lên Spring Boot
      // Truyền cả currentPassword lẫn oldPassword phòng trường hợp DTO đặt tên khác
      const response = await axiosClient.put('/users/me/password', {
        currentPassword: currentPassword,
        oldPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });

      // Thông báo thành công
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: response.data?.message || 'Đổi mật khẩu thành công!',
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset toàn bộ ô nhập liệu
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);

      // Lấy thông báo lỗi từ backend trả về (nếu có)
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data ||
        'Mật khẩu hiện tại không chính xác hoặc có lỗi xảy ra!';

      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: typeof errorMsg === 'string' ? errorMsg : 'Đổi mật khẩu thất bại!',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPasswordMismatch = Boolean(confirmPassword && confirmPassword !== newPassword);

  return (
    <div className="py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <ProfileSidebar activeTab="password" />

          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Đổi mật khẩu</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Đặt mật khẩu mới để bảo vệ tài khoản của bạn tốt hơn.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2 rounded-2xl border-border shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Mật khẩu hiện tại */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Mật khẩu hiện tại</Label>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          placeholder="Nhập mật khẩu hiện tại"
                          className="bg-background text-sm pr-9"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Mật khẩu mới */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Mật khẩu mới</Label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                          className="bg-background text-sm pr-9"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Xác nhận mật khẩu mới */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Xác nhận mật khẩu mới</Label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Nhập lại mật khẩu mới"
                          className={`bg-background text-sm pr-9 ${
                            isPasswordMismatch ? 'border-destructive focus-visible:ring-destructive' : ''
                          }`}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                      {isPasswordMismatch && (
                        <p className="text-[11px] text-destructive mt-1 font-semibold">
                          ⚠️ Mật khẩu xác nhận chưa khớp.
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="font-bold px-6 mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Đang cập nhật...
                        </>
                      ) : (
                        'Cập nhật mật khẩu'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Hộp gợi ý bảo mật */}
              <div className="lg:col-span-1">
                <Card className="rounded-2xl border-border bg-card shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                      <ShieldCheck className="size-6" />
                    </div>
                    <h3 className="font-bold text-base mb-2">Bảo mật tài khoản</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Sử dụng mật khẩu mạnh để bảo vệ tài khoản và thông tin cá nhân của bạn.
                    </p>
                    <ul className="space-y-2.5 text-xs">
                      <li className="flex items-center gap-2 text-foreground font-medium">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        Ít nhất 6-8 ký tự
                      </li>
                      <li className="flex items-center gap-2 text-foreground font-medium">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        Bao gồm chữ và số
                      </li>
                      <li className="flex items-center gap-2 text-foreground font-medium">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        Không sử dụng thông tin cá nhân
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}