import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Heart, ShieldAlert, PawPrint, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import axiosClient from '@/config/axiosClient';

export default function MyPetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    species: 'Chó',
    breed: '',
    age: '',
    weight: '',
    gender: 'Đực',
    notes: '',
    imageUrl: '',
  });

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/pets');
      setPets(res.data);
    } catch (err) {
      console.error('Lỗi tải danh sách thú cưng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleOpenAdd = () => {
    setEditingPet(null);
    setFormData({
      name: '',
      species: 'Chó',
      breed: '',
      age: '',
      weight: '',
      gender: 'Đực',
      notes: '',
      imageUrl: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name || '',
      species: pet.species || 'Chó',
      breed: pet.breed || '',
      age: pet.age || '',
      weight: pet.weight || '',
      gender: pet.gender || 'Đực',
      notes: pet.notes || '',
      imageUrl: pet.imageUrl || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        age: formData.age ? Number(formData.age) : null,
        weight: formData.weight ? Number(formData.weight) : null,
      };

      if (editingPet) {
        await axiosClient.put(`/pets/${editingPet.id}`, payload);
        Swal.fire({ icon: 'success', title: 'Cập nhật thành công!', timer: 1200, showConfirmButton: false });
      } else {
        await axiosClient.post('/pets', payload);
        Swal.fire({ icon: 'success', title: 'Đã thêm bé thú cưng!', timer: 1200, showConfirmButton: false });
      }

      setModalOpen(false);
      fetchPets();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Thất bại', text: err.response?.data?.message || 'Không thể lưu thông tin thú cưng.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `Xóa bé ${name}?`,
      text: 'Thông tin hồ sơ và lịch sử khám liên quan có thể bị ảnh hưởng.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Đồng ý xóa',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/pets/${id}`);
        Swal.fire({ icon: 'success', title: 'Đã xóa!', timer: 1200, showConfirmButton: false });
        fetchPets();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể xóa thú cưng này.' });
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <PawPrint className="size-7 text-emerald-600" /> Hồ Sơ Thú Cưng Của Tôi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý thông tin, giống loài, tiền sử bệnh án của các bé cưng để bác sĩ theo dõi tốt nhất.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shrink-0">
          <Plus className="mr-2 size-4" /> Thêm bé cưng mới
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-emerald-600 mb-2" />
          <p className="text-sm">Đang tải danh sách thú cưng...</p>
        </div>
      ) : pets.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
          <div className="size-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="size-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Bạn chưa thêm thú cưng nào</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Hãy tạo hồ sơ cho bé chó, mèo cưng của bạn để dễ dàng đặt lịch khám và lưu trữ bệnh án điện tử.
          </p>
          <Button onClick={handleOpenAdd} className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
            <Plus className="mr-2 size-4" /> Thêm bé thú cưng đầu tiên
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between">
              <div>
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img
                    src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'; }}
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                    {pet.species} • {pet.gender}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 transition">
                        {pet.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                        {pet.breed || 'Chưa rõ giống'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-4 text-xs">
                    <div className="bg-muted/50 p-2.5 rounded-lg">
                      <span className="text-muted-foreground block">Tuổi:</span>
                      <span className="font-bold text-foreground">{pet.age ? `${pet.age} tuổi` : 'Chưa cập nhật'}</span>
                    </div>
                    <div className="bg-muted/50 p-2.5 rounded-lg">
                      <span className="text-muted-foreground block">Cân nặng:</span>
                      <span className="font-bold text-foreground">{pet.weight ? `${pet.weight} kg` : 'Chưa cập nhật'}</span>
                    </div>
                  </div>

                  {pet.notes && (
                    <div className="text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg flex items-start gap-1.5">
                      <ShieldAlert className="size-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{pet.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-border/60 bg-muted/20 flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => handleOpenEdit(pet)}>
                  <Edit2 className="size-3.5 mr-1" /> Sửa
                </Button>
                <Button size="sm" variant="ghost" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40" onClick={() => handleDelete(pet.id, pet.name)}>
                  <Trash2 className="size-3.5 mr-1" /> Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Pet */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPet ? 'Cập Nhật Hồ Sơ Thú Cưng' : 'Thêm Thú Cưng Mới'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
            <div>
              <Label className="text-xs font-semibold">Tên thú cưng *</Label>
              <Input
                placeholder="Ví dụ: Bắp, Miu Miu, Lu..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Loài *</Label>
                <select
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                >
                  <option value="Chó">Chó</option>
                  <option value="Mèo">Mèo</option>
                  <option value="Thỏ">Thỏ</option>
                  <option value="Chim">Chim</option>
                  <option value="Hamster">Hamster</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold">Giới tính</Label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                >
                  <option value="Đực">Đực</option>
                  <option value="Cái">Cái</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Giống loài cụ thể</Label>
              <Input
                placeholder="Ví dụ: Corgi, Poodle, Mèo Anh lông ngắn..."
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Tuổi (năm)</Label>
                <Input
                  type="number"
                  placeholder="2"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Cân nặng (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="8.5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Link ảnh đại diện (URL)</Label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Tiền sử bệnh & Dị ứng (nếu có)</Label>
              <textarea
                rows={2}
                placeholder="Ví dụ: Dị ứng thịt gà, đã tiêm vắc xin 7 bệnh..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-md border border-input bg-background p-2 text-sm shadow-xs"
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                {submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                {editingPet ? 'Lưu thay đổi' : 'Thêm thú cưng'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

