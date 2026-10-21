import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Plus, LandPlot, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader, Stars, StatusBadge, venueStatusMeta, FormModal } from '@/components/shared';
import { courts, facilities, findUser, sports, venues as initialVenues, users } from '@/services/mock-data';
import { showToast, confirmDeleteAlert } from '@/services/toast';

export default function VenuesPage() {
    const [venueList, setVenueList] = useState(initialVenues);
    const [searchQuery, setSearchQuery] = useState('');
    const [sportFilter, setSportFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVenue, setEditingVenue] = useState(null);

    const venueFields = [
        { name: 'name', label: 'Tên cơ sở', required: true, placeholder: 'Nhập tên cơ sở...' },
        { name: 'province', label: 'Tỉnh / Thành phố', type: 'province', required: true, defaultValue: 'Thành phố Hồ Chí Minh' },
        { name: 'district', label: 'Quận / Huyện', type: 'district', required: true, defaultValue: 'Quận 1' },
        { name: 'address', label: 'Số nhà, Tên đường', required: true, placeholder: 'VD: 123 Nguyễn Huệ' },
        { name: 'openTime', label: 'Giờ mở cửa', required: true, placeholder: 'VD: 06:00' },
        { name: 'closeTime', label: 'Giờ đóng cửa', required: true, placeholder: 'VD: 23:00' },
        {
            name: 'ownerId',
            label: 'Chủ sở hữu',
            type: 'select',
            required: true,
            options: users
                .filter(u => (u.roles && u.roles.includes('owner')) || u.role === 'owner')
                .map(u => ({ value: String(u.id), label: `${u.fullName} (${u.phone})` }))
        },
        {
            name: 'status',
            label: 'Trạng thái',
            type: 'select',
            required: true,
            defaultValue: 'active',
            options: [
                { value: 'active', label: 'Hoạt động' },
                { value: 'inactive', label: 'Tạm ngưng' },
                { value: 'pending', label: 'Chờ duyệt' }
            ]
        }
    ];

    const handleCreateNew = () => {
        setEditingVenue(null);
        setIsFormOpen(true);
    };

    const handleEdit = (v, e) => {
        e.stopPropagation();
        setEditingVenue({
            ...v,
            ownerId: String(v.ownerId)
        });
        setIsFormOpen(true);
    };

    const handleDeleteClick = async (v, e) => {
        e.stopPropagation();
        const isConfirmed = await confirmDeleteAlert('Cơ sở thể thao', v.name);
        if (isConfirmed) {
            setVenueList(prev => prev.filter(item => item.id !== v.id));
            showToast(`Đã xóa cơ sở "${v.name}" thành công!`, 'success');
        }
    };

    const handleFormSubmit = (formData, isEditMode) => {
        if (isEditMode) {
            setVenueList(prev => prev.map(item => item.id === editingVenue.id ? { ...item, ...formData, ownerId: Number(formData.ownerId) } : item));
            showToast('Cập nhật cơ sở thành công!', 'success');
        } else {
            const newVenue = {
                ...formData,
                id: Date.now(),
                ownerId: Number(formData.ownerId),
                courtCount: 0,
                rating: 0,
                reviewCount: 0,
                facilityIds: [1, 2],
                image: '/images/venue-football.png'
            };
            setVenueList(prev => [newVenue, ...prev]);
            showToast('Thêm cơ sở mới thành công!', 'success');
        }
        setIsFormOpen(false);
    };

    const filteredVenues = venueList.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (v.address && v.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
                              (v.district && v.district.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (<>
      <PageHeader title="Cơ sở & Sân" description={`${filteredVenues.length} cơ sở · ${courts.length} sân · ${sports.length} môn thể thao`}>
        <Button onClick={handleCreateNew} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer">
          <Plus className="size-4"/> Thêm cơ sở
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <Input 
          placeholder="Tìm theo tên, địa chỉ, quận huyện..." 
          className="bg-card md:max-w-xs" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Tìm cơ sở"
        />
        <Select value={sportFilter} onValueChange={setSportFilter}>
          <SelectTrigger className="bg-card md:w-44" aria-label="Lọc theo môn">
            <SelectValue placeholder="Tất cả môn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả môn</SelectItem>
            {sports.map((s) => (<SelectItem key={s.id} value={s.code}>
                {s.name}
              </SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-card md:w-44" aria-label="Lọc theo trạng thái">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Tạm ngưng</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Danh sách cơ sở">
        {filteredVenues.map((v) => {
            const owner = findUser(v.ownerId);
            const venueCourts = courts.filter((c) => c.venueId === v.id);
            const sportNames = Array.from(new Set(venueCourts.map((c) => sports.find((s) => s.id === c.sportId)?.name)));
            const meta = venueStatusMeta[v.status] || { tone: 'neutral', label: v.status };
            return (<Card key={v.id} className="group overflow-hidden pt-0 relative flex flex-col justify-between">
              <div>
                <Link to={`/admin/venues/${v.id}`} className="relative block aspect-[16/9] overflow-hidden">
                  <img src={v.image} alt={v.name} className="size-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                  <div className="absolute left-3 top-3">
                    <StatusBadge tone={meta.tone} className="bg-card/95 backdrop-blur">
                      {meta.label}
                    </StatusBadge>
                  </div>
                </Link>
                <CardContent className="flex flex-col gap-3 pt-4">
                  <div className="flex flex-col gap-1">
                    <Link to={`/admin/venues/${v.id}`} className="text-base font-semibold leading-tight hover:underline">
                      {v.name}
                    </Link>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3.5"/> {v.address}, {v.district} {v.province ? `, ${v.province}` : ''}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sportNames.map((s) => (<span key={s} className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                        {s}
                      </span>))}
                    {sportNames.length === 0 && <span className="text-xs text-muted-foreground">Chưa có sân</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 border-t pt-3 text-xs">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Số sân</span>
                      <span className="flex items-center gap-1 font-mono font-semibold">
                        <LandPlot className="size-3.5 text-muted-foreground"/> {v.courtCount}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Giờ mở</span>
                      <span className="flex items-center gap-1 font-mono font-semibold">
                        <Clock className="size-3.5 text-muted-foreground"/> {v.openTime}–{v.closeTime}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Đánh giá</span>
                      {v.reviewCount > 0 ? (<span className="flex items-center gap-1">
                          <Stars value={v.rating}/>
                          <span className="font-mono font-semibold">{v.rating.toFixed(1)}</span>
                        </span>) : (<span className="text-muted-foreground">Chưa có</span>)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Chủ sở hữu: <span className="font-medium text-foreground">{owner?.fullName || 'N/A'}</span></span>
                    <span>{(v.facilityIds || []).length}/{facilities.length} tiện ích</span>
                  </div>
                </CardContent>
              </div>

              <div className="flex items-center justify-end gap-2 border-t p-3 bg-muted/20">
                <Button size="xs" variant="outline" asChild>
                  <Link to={`/admin/venues/${v.id}`} className="flex items-center gap-1">
                    <Eye className="size-3.5" /> Chi tiết
                  </Link>
                </Button>
                <Button size="xs" variant="outline" onClick={(e) => handleEdit(v, e)} className="flex items-center gap-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 cursor-pointer">
                  <Edit className="size-3.5" /> Sửa
                </Button>
                <Button size="xs" variant="outline" onClick={(e) => handleDeleteClick(v, e)} className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer">
                  <Trash2 className="size-3.5" /> Xóa
                </Button>
              </div>
            </Card>);
        })}
      </section>

      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Cơ sở"
        initialValues={editingVenue}
        fields={venueFields}
        onSubmit={handleFormSubmit}
      />
    </>);
}