import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Check, Clock, MapPin, Pencil, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { StatusBadge, Stars, courtStatusMeta, venueStatusMeta, FormModal } from '@/components/shared';
import { courts as initialCourts, facilities, findSport, findUser, formatVND, initials, reviews, sports, timeSlots, venues as initialVenues } from '@/services/mock-data';
import { cn } from '@/services/utils';
import { showToast, confirmDeleteAlert } from '@/services/toast';

export default function VenueDetailPage() {
    const { id } = useParams();
    const venueIdNum = Number(id);

    const [venueList, setVenueList] = useState(initialVenues);
    const [courtList, setCourtList] = useState(initialCourts);

    const venue = venueList.find((v) => v.id === venueIdNum);

    const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
    const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);
    const [editingCourt, setEditingCourt] = useState(null);

    if (!venue) return <Navigate to="/admin/venues" replace />;

    const venueCourts = courtList.filter((c) => c.venueId === venue.id);
    const venueReviews = reviews.filter((r) => r.venueId === venue.id);
    const owner = findUser(venue.ownerId);
    const meta = venueStatusMeta[venue.status] || { tone: 'neutral', label: venue.status };

    const venueFields = [
        { name: 'name', label: 'Tên cơ sở', required: true },
        { name: 'province', label: 'Tỉnh / Thành phố', type: 'province', required: true },
        { name: 'district', label: 'Quận / Huyện', type: 'district', required: true },
        { name: 'address', label: 'Số nhà, Tên đường', required: true },
        { name: 'openTime', label: 'Giờ mở cửa', required: true },
        { name: 'closeTime', label: 'Giờ đóng cửa', required: true },
        {
            name: 'status',
            label: 'Trạng thái',
            type: 'select',
            required: true,
            options: [
                { value: 'active', label: 'Hoạt động' },
                { value: 'inactive', label: 'Tạm ngưng' },
                { value: 'pending', label: 'Chờ duyệt' }
            ]
        }
    ];

    const courtFields = [
        { name: 'name', label: 'Tên sân', required: true, placeholder: 'VD: Sân A1, Sân Futsal 1' },
        {
            name: 'sportId',
            label: 'Môn thể thao',
            type: 'select',
            required: true,
            options: sports.map(s => ({ value: s.id, label: s.name }))
        },
        { name: 'basePrice', label: 'Giá cơ bản (VNĐ/giờ)', type: 'number', required: true, placeholder: '150000' },
        { name: 'peakPrice', label: 'Giá cao điểm (VNĐ/giờ)', type: 'number', required: true, placeholder: '200000' },
        {
            name: 'status',
            label: 'Trạng thái',
            type: 'select',
            required: true,
            defaultValue: 'available',
            options: [
                { value: 'available', label: 'Khả dụng' },
                { value: 'maintenance', label: 'Bảo trì' },
                { value: 'reserved', label: 'Đã đặt' }
            ]
        }
    ];

    const handleUpdateVenueSubmit = (formData) => {
        setVenueList(prev => prev.map(v => v.id === venue.id ? { ...v, ...formData } : v));
        setIsVenueModalOpen(false);
        showToast('Cập nhật thông tin cơ sở thành công!', 'success');
    };

    const handleAddCourt = () => {
        setEditingCourt(null);
        setIsCourtModalOpen(true);
    };

    const handleEditCourt = (c) => {
        setEditingCourt(c);
        setIsCourtModalOpen(true);
    };

    const handleDeleteCourtClick = async (c) => {
        const isConfirmed = await confirmDeleteAlert('Sân tập', c.name);
        if (isConfirmed) {
            setCourtList(prev => prev.filter(item => item.id !== c.id));
            showToast(`Đã xóa sân "${c.name}" thành công!`, 'success');
        }
    };

    const handleCourtSubmit = (formData, isEditMode) => {
        if (isEditMode) {
            setCourtList(prev => prev.map(c => c.id === editingCourt.id ? {
                ...c,
                ...formData,
                sportId: Number(formData.sportId),
                basePrice: Number(formData.basePrice),
                peakPrice: Number(formData.peakPrice)
            } : c));
            showToast('Cập nhật thông tin sân tập thành công!', 'success');
        } else {
            const newCourt = {
                ...formData,
                id: Date.now(),
                venueId: venue.id,
                sportId: Number(formData.sportId),
                basePrice: Number(formData.basePrice),
                peakPrice: Number(formData.peakPrice),
                images: ['/placeholder.svg']
            };
            setCourtList(prev => [...prev, newCourt]);
            showToast('Thêm sân tập mới thành công!', 'success');
        }
        setIsCourtModalOpen(false);
    };

    return (<>
      <div className="flex flex-col gap-4">
        <Link to="/admin/venues" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4"/> Quay lại danh sách
        </Link>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg lg:col-span-2 lg:aspect-[21/9]">
            <img src={venue.image} alt={venue.name} className="size-full object-cover"/>
          </div>
          <Card>
            <CardContent className="flex h-full flex-col gap-4 pt-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold leading-tight text-balance">{venue.name}</h2>
                  <span className="flex items-start gap-1 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-4 shrink-0"/> {venue.address}, {venue.district} {venue.province ? `, ${venue.province}` : ''}
                  </span>
                </div>
                <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Giờ hoạt động</dt>
                  <dd className="flex items-center gap-1 font-mono font-medium">
                    <Clock className="size-3.5"/> {venue.openTime}–{venue.closeTime}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Đánh giá</dt>
                  <dd className="flex items-center gap-1.5">
                    <Stars value={venue.rating}/>
                    <span className="font-mono font-medium">{venue.rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({venue.reviewCount})</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Chủ sở hữu</dt>
                  <dd className="font-medium">{owner?.fullName || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Liên hệ</dt>
                  <dd className="font-mono font-medium">{owner?.phone || 'N/A'}</dd>
                </div>
              </dl>
              <div className="mt-auto flex gap-2">
                <Button variant="outline" onClick={() => setIsVenueModalOpen(true)} className="flex-1 bg-card cursor-pointer">
                  <Pencil className="size-4 mr-1"/> Chỉnh sửa cơ sở
                </Button>
                <Button className="flex-1" nativeButton={false} render={<Link to="/admin/schedule"/>}>
                  Xem lịch sân
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="courts" className="gap-4">
        <TabsList variant="line" className="w-full justify-start">
          <TabsTrigger value="courts">Sân ({venueCourts.length})</TabsTrigger>
          <TabsTrigger value="prices">Bảng giá</TabsTrigger>
          <TabsTrigger value="facilities">Tiện ích</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá ({venueReviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="courts">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Danh sách sân</CardTitle>
                <CardDescription>Bảng courts · court_images · court_schedules</CardDescription>
              </div>
              <Button onClick={handleAddCourt} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 cursor-pointer">
                <Plus className="size-4" /> Thêm sân mới
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên sân</TableHead>
                    <TableHead>Môn thể thao</TableHead>
                    <TableHead>Giá cơ bản</TableHead>
                    <TableHead>Giá cao điểm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {venueCourts.map((c) => {
                    const sport = findSport(c.sportId);
                    const cMeta = courtStatusMeta[c.status] || { tone: 'neutral', label: c.status };
                    return (<TableRow key={c.id}>
                        <TableCell className="font-semibold">{c.name}</TableCell>
                        <TableCell>{sport?.name || 'N/A'}</TableCell>
                        <TableCell className="font-mono text-xs">{formatVND(c.basePrice)}</TableCell>
                        <TableCell className="font-mono text-xs">{formatVND(c.peakPrice)}</TableCell>
                        <TableCell>
                          <StatusBadge tone={cMeta.tone}>{cMeta.label}</StatusBadge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="icon" variant="ghost" onClick={() => handleEditCourt(c)} title="Sửa sân" className="size-8 text-amber-600 hover:bg-amber-50">
                              <Edit className="size-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteCourtClick(c)} title="Xóa sân" className="size-8 text-red-600 hover:bg-red-50">
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>);
                  })}
                  {venueCourts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Cơ sở này chưa có sân tập nào. Nhấn "Thêm sân mới" để tạo.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prices">
          <Card>
            <CardHeader>
              <CardTitle>Bảng giá theo khung giờ</CardTitle>
              <CardDescription>Bảng court_prices × time_slots · khung giờ cao điểm được tô đậm</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">Khung giờ</th>
                    {venueCourts.map((c) => (<th key={c.id} className="pb-2 pr-3 text-right font-medium">
                        {c.name}
                      </th>))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (<tr key={slot.id} className={cn('border-t', slot.peak && 'bg-warning/10')}>
                      <td className="py-2 pr-3 font-mono text-xs">
                        {slot.start}–{slot.end}
                        {slot.peak && <span className="ml-2 rounded bg-warning px-1 py-0.5 text-[10px] font-semibold text-warning-foreground">Cao điểm</span>}
                      </td>
                      {venueCourts.map((c) => (<td key={c.id} className="py-2 pr-3 text-right font-mono">
                          {formatVND(slot.peak ? c.peakPrice : c.basePrice)}
                        </td>))}
                    </tr>))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities">
          <Card>
            <CardHeader>
              <CardTitle>Tiện ích cơ sở</CardTitle>
              <CardDescription>Bảng facilities ↔ venue_facilities</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.map((f) => {
                const has = venue.facilityIds.includes(f.id);
                return (<div key={f.id} className={cn('flex items-center justify-between rounded-md border px-3 py-2.5 text-sm', has ? 'border-success/30 bg-success/5' : 'border-dashed text-muted-foreground')}>
                    <span className="flex items-center gap-2">
                      {has && <Check className="size-4 text-success"/>}
                      {f.name}
                    </span>
                    <Switch defaultChecked={has} aria-label={`Bật ${f.name}`}/>
                  </div>);
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá của khách</CardTitle>
              <CardDescription>Bảng reviews · {venueReviews.length} đánh giá</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col divide-y">
              {venueReviews.length === 0 && <p className="text-sm text-muted-foreground">Chưa có đánh giá.</p>}
              {venueReviews.map((r) => {
                const u = findUser(r.userId);
                const c = courtList.find((x) => x.id === r.courtId);
                return (<div key={r.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">{initials(u?.fullName ?? '')}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{u?.fullName}</span>
                        <span className="text-xs text-muted-foreground">· {c?.name} · {r.createdAt}</span>
                        <Stars value={r.rating} className="ml-auto"/>
                      </div>
                      <p className="text-sm text-pretty">{r.comment}</p>
                      {r.replied ? (<span className="text-xs text-success">Đã phản hồi</span>) : (<Button variant="link" size="xs" className="w-fit px-0">
                          Phản hồi
                        </Button>)}
                    </div>
                  </div>);
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FormModal
        isOpen={isVenueModalOpen}
        onClose={() => setIsVenueModalOpen(false)}
        title="Cơ sở thể thao"
        initialValues={venue}
        fields={venueFields}
        onSubmit={handleUpdateVenueSubmit}
      />

      <FormModal
        isOpen={isCourtModalOpen}
        onClose={() => setIsCourtModalOpen(false)}
        title="Sân tập"
        initialValues={editingCourt}
        fields={courtFields}
        onSubmit={handleCourtSubmit}
      />
    </>);
}