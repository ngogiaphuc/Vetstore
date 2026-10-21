import { useEffect, useState, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { User, KeyRound, CalendarDays, Users, LogOut, Camera, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/services/utils';
import axiosClient from '@/config/axiosClient';

export function ProfileSidebar({ activeTab }) {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
  };

  return (
    <div className="flex flex-col gap-1 w-full md:w-64 shrink-0">
      <Link
        to="/profile"
        className={cn(
          'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
          activeTab === 'profile'
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
      >
        <User className="size-4" />
        Hồ sơ cá nhân
      </Link>
      <Link
        to="/change-password"
        className={cn(
          'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
          activeTab === 'password'
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
      >
        <KeyRound className="size-4" />
        Đổi mật khẩu
      </Link>
      <Link
        to="/my-bookings"
        className={cn(
          'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
          activeTab === 'bookings'
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
      >
        <CalendarDays className="size-4" />
        Lịch đặt của tôi
      </Link>
      <Link
        to="/my-teams"
        className={cn(
          'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
          activeTab === 'teams'
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
      >
        <Users className="size-4" />
        Đội của tôi
      </Link>
      <Link
        to="/"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors mt-4"
      >
        <LogOut className="size-4" />
        Đăng xuất
      </Link>
    </div>
  );
}

export default function UserProfilePage() {
  const token = localStorage.getItem("accessToken");
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Nam',
    city: 'TP. Hồ Chí Minh',
    address: ''
  });

  if (!token || token === "undefined" || token === "null") {
    return <Navigate to="/login" replace />;
  }

  // 1. Tải thông tin tài khoản ban đầu
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/users/me");
        const data = response.data;

        setUserData(data);
        setForm({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || 'Nam',
          city: data.city || 'TP. Hồ Chí Minh',
          address: data.address || ''
        });
      } catch (error) {
        console.error("Lỗi khi tải thông tin hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 2. Chọn ảnh xem trước (Preview)
  const handleSelectImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: 'warning',
        title: 'Định dạng không hợp lệ',
        text: 'Vui lòng chọn đúng file hình ảnh (jpg, png, webp...)!',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPreviewAvatar(previewUrl);
  };

  // 3. Khôi phục trạng thái khi bấm Hủy
  const handleCancel = () => {
    if (userData) {
      setForm({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || 'Nam',
        city: userData.city || 'TP. Hồ Chí Minh',
        address: userData.address || ''
      });
    }
    setSelectedFile(null);
    setPreviewAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 4. Lưu thông tin và Upload ảnh
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      // Cập nhật thông tin văn bản trước
      let updatedUserResponse = (await axiosClient.put("/users/me", form)).data;

      // Nếu có chọn ảnh mới thì cập nhật ảnh sau cùng để không bị đè dữ liệu
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const avatarResponse = await axiosClient.put("/users/me/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        updatedUserResponse = avatarResponse.data;
      }

      setUserData(updatedUserResponse);
      setSelectedFile(null);
      setPreviewAvatar(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Phát sự kiện để Header tự động đổi avatar theo ngay lập tức
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: updatedUserResponse }));

      // Popup SweetAlert2 thông báo thành công
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Cập nhật thông tin cá nhân thành công!',
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: 'Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-sm font-medium">Đang tải hồ sơ...</span>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="py-12 text-center text-sm text-destructive">
        Không thể tải thông tin hồ sơ cá nhân. Vui lòng thử lại sau!
      </div>
    );
  }

  const initials = form.fullName
    ? form.fullName.trim().split(" ").slice(-2).map(n => n[0]).join("").toUpperCase()
    : userData.username?.substring(0, 2).toUpperCase();

  const currentAvatarSrc = previewAvatar || userData.avatarUrl;

  return (
    <div className="py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <ProfileSidebar activeTab="profile" />

          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Hồ sơ cá nhân</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Cập nhật thông tin cá nhân để hoàn thiện trải nghiệm SportHub.
              </p>
            </div>

            <Card className="rounded-2xl border-border shadow-sm">
              <CardContent className="p-6 sm:p-8">
                {/* Header Avatar & Tên tài khoản */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                  <div className="relative">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleSelectImage} 
                    />

                    {currentAvatarSrc ? (
                      <img 
                        src={currentAvatarSrc} 
                        alt="Avatar" 
                        className="size-20 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                        {initials}
                      </div>
                    )}

                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-md hover:brightness-110 transition cursor-pointer"
                      title="Chọn ảnh đại diện"
                    >
                      <Camera className="size-3.5" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{userData.username}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{userData.email}</p>
                    <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                      {selectedFile ? "Đã chọn ảnh mới (chưa lưu)" : "Thành viên"}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Họ và tên</Label>
                      <Input
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        className="bg-background text-sm"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Email</Label>
                      <Input
                        type="email"
                        value={form.email}
                        disabled
                        className="bg-muted text-sm cursor-not-allowed opacity-75"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Số điện thoại</Label>
                      <Input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="bg-background text-sm"
                        placeholder="0912345678"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Ngày sinh</Label>
                      <Input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                        className="bg-background text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Giới tính</Label>
                      <Select 
                        value={form.gender} 
                        onValueChange={(val) => setForm({ ...form, gender: val })}
                      >
                        <SelectTrigger className="bg-background text-sm">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nam">Nam</SelectItem>
                          <SelectItem value="Nữ">Nữ</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Thành phố</Label>
                      <Select 
                        value={form.city} 
                        onValueChange={(val) => setForm({ ...form, city: val })}
                      >
                        <SelectTrigger className="bg-background text-sm">
                          <SelectValue placeholder="Chọn thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
                          <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                          <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                          <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Địa chỉ</Label>
                    <Input
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Số nhà, tên đường, phường/xã..."
                      className="bg-background text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="font-bold px-6">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        'Lưu thay đổi'
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="px-6" 
                      disabled={isSubmitting}
                      onClick={handleCancel}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}