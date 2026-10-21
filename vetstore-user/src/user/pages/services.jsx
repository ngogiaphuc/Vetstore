import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Tag, ArrowRight, Sparkles, CheckCircle2, Stethoscope, Syringe, Scissors, ShieldAlert } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axiosClient from '@/config/axiosClient';

const CATEGORIES = [
  { id: '', label: 'Tất cả dịch vụ' },
  { id: 'EXAMINATION', label: 'Khám tổng quát & Siêu âm' },
  { id: 'VACCINATION', label: 'Tiêm chủng vắc xin' },
  { id: 'SURGERY', label: 'Phẫu thuật & Triệt sản' },
  { id: 'SPA_GROOMING', label: 'Spa tắm & Cắt tỉa' },
  { id: 'DENTAL', label: 'Nha khoa thú cưng' },
];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        if (searchQuery) params.search = searchQuery;

        const res = await axiosClient.get('/services', { params });
        setServices(res.data);
      } catch (err) {
        console.error('Lỗi tải danh mục dịch vụ:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory, searchQuery]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'EXAMINATION':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Khám bệnh</Badge>;
      case 'VACCINATION':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Tiêm vắc xin</Badge>;
      case 'SURGERY':
        return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">Phẫu thuật</Badge>;
      case 'SPA_GROOMING':
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">Spa & Cắt tỉa</Badge>;
      case 'DENTAL':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Nha khoa</Badge>;
      default:
        return <Badge variant="outline">Thú y</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-white/20 text-white border-none mb-3 px-3 py-1 text-xs">
            🐾 Tiêu chuẩn Y tế Thú Y Quốc tế
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Dịch Vụ Y Tế & Chăm Sóc Thú Cưng Toàn Diện
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-100 leading-relaxed">
            Hệ thống phòng mổ vô trùng, máy siêu âm màu 4D, phòng xét nghiệm sinh hóa đạt chuẩn, cam kết mang đến sự chăm sóc tận tâm nhất cho bé yêu của bạn.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none flex items-center justify-center">
          <Stethoscope className="size-64" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm tên dịch vụ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          <div className="size-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Đang tải danh sách dịch vụ...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
          <p className="text-base font-bold text-foreground">Không tìm thấy dịch vụ phù hợp</p>
          <p className="text-xs mt-1">Vui lòng thử chọn danh mục khác hoặc tìm kiếm từ khóa khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500'; }}
                  />
                  <div className="absolute top-3 left-3">
                    {getCategoryBadge(item.category)}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="size-3" /> {item.durationMinutes || 30} phút
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-600 transition leading-snug line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {item.description || 'Dịch vụ khám và điều trị thú y uy tín tại phòng khám VetCare.'}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-border/40 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Giá dịch vụ:</span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs">
                  <Link to={`/booking?serviceId=${item.id}`}>
                    Đặt lịch ngay <ArrowRight className="ml-1 size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

