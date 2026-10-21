import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Stethoscope, Clock, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import axiosClient from '@/config/axiosClient';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    durationMinutes: 30,
    category: 'EXAMINATION',
    imageUrl: '',
    status: 'ACTIVE',
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/services/admin');
      setServices(res.data);
    } catch (err) {
      console.error('Lỗi tải dịch vụ:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      durationMinutes: 30,
      category: 'EXAMINATION',
      imageUrl: '',
      status: 'ACTIVE',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingService(s);
    setFormData({
      name: s.name,
      description: s.description || '',
      price: s.price,
      durationMinutes: s.durationMinutes || 30,
      category: s.category || 'EXAMINATION',
      imageUrl: s.imageUrl || '',
      status: s.status || 'ACTIVE',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        durationMinutes: Number(formData.durationMinutes),
      };

      if (editingService) {
        await axiosClient.put(`/services/${editingService.id}`, payload);
        Swal.fire({ icon: 'success', title: 'Cập nhật thành công!', timer: 1200, showConfirmButton: false });
      } else {
        await axiosClient.post('/services', payload);
        Swal.fire({ icon: 'success', title: 'Đã thêm dịch vụ!', timer: 1200, showConfirmButton: false });
      }

      setModalOpen(false);
      fetchServices();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || 'Không thể lưu dịch vụ.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    const res = await Swal.fire({
      title: `Vô hiệu hóa ${name}?`,
      text: 'Dịch vụ này sẽ không còn hiển thị cho khách hàng đặt lịch.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
    });

    if (res.isConfirmed) {
      try {
        await axiosClient.delete(`/services/${id}`);
        Swal.fire({ icon: 'success', title: 'Đã ngừng cung cấp dịch vụ', timer: 1200, showConfirmButton: false });
        fetchServices();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể xóa dịch vụ.' });
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Stethoscope className="size-6 text-emerald-600" /> Quản Lý Gói Dịch Vụ Thú Y
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cấu hình bảng giá dịch vụ khám bệnh, tiêm chủng, siêu âm và spa làm đẹp cho thú cưng.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0">
          <Plus className="mr-1.5 size-4" /> Thêm dịch vụ mới
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs">Đang tải danh sách dịch vụ...</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5">Hình Ảnh</th>
                  <th className="p-3.5">Tên Dịch Vụ</th>
                  <th className="p-3.5">Phân Loại</th>
                  <th className="p-3.5">Thời Gian</th>
                  <th className="p-3.5">Đơn Giá</th>
                  <th className="p-3.5">Trạng Thái</th>
                  <th className="p-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20 transition">
                    <td className="p-3.5">
                      <img
                        src={s.imageUrl || 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=100'}
                        alt={s.name}
                        className="size-12 rounded-xl object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=100'; }}
                      />
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-foreground text-sm">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-sm mt-0.5">{s.description}</div>
                    </td>
                    <td className="p-3.5 font-semibold text-emerald-600">{s.category}</td>
                    <td className="p-3.5">{s.durationMinutes || 30} phút</td>
                    <td className="p-3.5 font-bold text-emerald-600">{formatPrice(s.price)}</td>
                    <td className="p-3.5">
                      <Badge variant={s.status === 'ACTIVE' ? 'default' : 'outline'} className={s.status === 'ACTIVE' ? 'bg-emerald-600' : ''}>
                        {s.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <Button size="sm" variant="outline" onClick={() => handleOpenEdit(s)}>
                        <Edit2 className="size-3.5 mr-1" /> Sửa
                      </Button>
                      <Button size="sm" variant="ghost" className="text-rose-500 hover:text-rose-600" onClick={() => handleDelete(s.id, s.name)}>
                        <Trash2 className="size-3.5 mr-1" /> Vô hiệu
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Service */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Sửa Gói Dịch Vụ' : 'Thêm Dịch Vụ Mới'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 py-2 text-xs">
            <div>
              <Label className="font-semibold">Tên dịch vụ *</Label>
              <Input
                placeholder="Ví dụ: Tiêm phòng vắc xin 7 bệnh..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label className="font-semibold">Phân loại *</Label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
              >
                <option value="EXAMINATION">Khám tổng quát & Siêu âm</option>
                <option value="VACCINATION">Tiêm chủng vắc xin</option>
                <option value="SURGERY">Phẫu thuật & Triệt sản</option>
                <option value="SPA_GROOMING">Spa tắm & Cắt tỉa lông</option>
                <option value="DENTAL">Nha khoa thú cưng</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-semibold">Đơn giá (VNĐ) *</Label>
                <Input
                  type="number"
                  placeholder="250000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label className="font-semibold">Thời lượng (phút)</Label>
                <Input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="font-semibold">Link ảnh đại diện (URL)</Label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            <div>
              <Label className="font-semibold">Mô tả chi tiết dịch vụ</Label>
              <textarea
                rows={3}
                placeholder="Mô tả công dụng và các bước kiểm tra..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border border-input bg-background p-2 text-xs"
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                {submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                Lưu dịch vụ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

