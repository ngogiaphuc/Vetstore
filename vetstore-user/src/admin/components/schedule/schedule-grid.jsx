import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge, bookingStatusMeta } from '@/components/shared';
import { bookings, courts, findUser, formatVND, timeSlots, venues } from '@/services/mock-data';
import { cn } from '@/services/utils';
const today = '2026-09-07';
export function ScheduleGrid() {
    const [venueId, setVenueId] = useState('1');
    const [selected, setSelected] = useState(null);
    const venue = venues.find((v) => v.id === Number(venueId));
    const venueCourts = courts.filter((c) => c.venueId === Number(venueId));
    const dayBookings = bookings.filter((b) => b.date === today && b.status !== 'cancelled');
    const cellFor = (court, slot) => dayBookings.find((b) => b.courtId === court.id && b.slotIds.includes(slot.id));
    const bookedCount = venueCourts.reduce((sum, c) => sum + timeSlots.filter((s) => cellFor(c, s)).length, 0);
    const capacity = venueCourts.filter((c) => c.status === 'available').length * timeSlots.length;
    const occupancy = capacity ? Math.round((bookedCount / capacity) * 100) : 0;
    return (<div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={venueId} onValueChange={(v) => setVenueId(v)} items={Object.fromEntries(venues.map((v) => [String(v.id), v.name]))}>
            <SelectTrigger className="w-60 bg-card" aria-label="Chọn cơ sở">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {venues.map((v) => (<SelectItem key={v.id} value={String(v.id)}>
                  {v.name}
                </SelectItem>))}
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-lg border bg-card">
            <Button variant="ghost" size="icon" aria-label="Ngày trước">
              <ChevronLeft className="size-4"/>
            </Button>
            <span className="px-2 font-mono text-sm font-medium">CN, 07/09/2026</span>
            <Button variant="ghost" size="icon" aria-label="Ngày sau">
              <ChevronRight className="size-4"/>
            </Button>
          </div>
          <Button variant="outline" size="sm" className="bg-card">
            Hôm nay
          </Button>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            Lấp sân: <span className="font-mono font-semibold text-foreground">{occupancy}%</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-primary"/> Đã đặt
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm border border-warning bg-warning/30"/> Chờ xác nhận
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-warning/15"/> Cao điểm
          </span>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <div className="grid min-w-[900px] text-xs" style={{ gridTemplateColumns: `140px repeat(${timeSlots.length}, minmax(0, 1fr))` }} role="grid" aria-label={`Lịch sân ${venue?.name}`}>
            <div className="sticky left-0 z-10 border-b border-r bg-card px-3 py-2 font-medium text-muted-foreground" role="columnheader">
              Sân / Giờ
            </div>
            {timeSlots.map((s) => (<div key={s.id} role="columnheader" className={cn('border-b px-1 py-2 text-center font-mono font-medium', s.peak ? 'bg-warning/15 text-warning-foreground' : 'text-muted-foreground')}>
                {s.label}
              </div>))}

            {venueCourts.map((court) => (<CourtRow key={court.id} court={court} cellFor={cellFor} onPick={(slot) => setSelected({ court, slot })}/>))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo phiếu đặt sân</DialogTitle>
            <DialogDescription>
              {selected?.court.name} · {venue?.name} · {selected?.slot.start}–{selected?.slot.end} · {today}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="customer">Khách hàng</Label>
              <Input id="customer" placeholder="Số điện thoại hoặc tên"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="duration">Số giờ</Label>
                <Input id="duration" type="number" defaultValue={1} min={1} max={4} className="font-mono"/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="voucher">Mã giảm giá</Label>
                <Input id="voucher" placeholder="WELCOME10" className="font-mono uppercase"/>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
              <span className="text-muted-foreground">Tạm tính</span>
              <span className="font-mono font-semibold">
                {selected ? formatVND(selected.slot.peak ? selected.court.peakPrice : selected.court.basePrice) : ''}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Hủy
            </Button>
            <Button onClick={() => setSelected(null)}>Tạo phiếu & giữ sân</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);
}
function CourtRow({ court, cellFor, onPick, }) {
    const disabled = court.status !== 'available';
    return (<>
      <div className="sticky left-0 z-10 flex flex-col justify-center border-b border-r bg-card px-3 py-2" role="rowheader">
        <span className="text-sm font-semibold">{court.name}</span>
        <span className="text-[11px] text-muted-foreground">{court.type}</span>
      </div>
      {timeSlots.map((slot, idx) => {
            const b = cellFor(court, slot);
            const prev = idx > 0 ? cellFor(court, timeSlots[idx - 1]) : undefined;
            const isStart = b && (!prev || prev.id !== b.id);
            const next = idx < timeSlots.length - 1 ? cellFor(court, timeSlots[idx + 1]) : undefined;
            const isEnd = b && (!next || next.id !== b.id);
            const user = b ? findUser(b.userId) : undefined;
            const pending = b?.status === 'pending';
            return (<div key={slot.id} role="gridcell" className={cn('border-b p-0.5', slot.peak && !b && 'bg-warning/10')}>
            {disabled ? (<div className="flex h-12 items-center justify-center rounded-sm bg-muted/70 text-muted-foreground" title={court.status === 'maintenance' ? 'Bảo trì' : 'Đóng'}>
                <Lock className="size-3"/>
              </div>) : b ? (<button type="button" title={`${b.id} · ${user?.fullName} · ${bookingStatusMeta[b.status].label}`} className={cn('flex h-12 w-full flex-col justify-center overflow-hidden px-1.5 text-left leading-tight transition-opacity hover:opacity-90', pending ? 'border border-warning bg-warning/30 text-warning-foreground' : 'bg-primary text-primary-foreground', isStart && 'rounded-l-md', isEnd && 'rounded-r-md')}>
                {isStart && (<>
                    <span className="truncate text-[11px] font-semibold">{user?.fullName}</span>
                    <span className="truncate font-mono text-[10px] opacity-80">{b.id}</span>
                  </>)}
              </button>) : (<button type="button" onClick={() => onPick(slot)} aria-label={`Đặt ${court.name} lúc ${slot.label}`} className="flex h-12 w-full items-center justify-center rounded-sm border border-dashed border-transparent font-mono text-[10px] text-muted-foreground/0 transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground">
                +
              </button>)}
          </div>);
        })}
    </>);
}
export function SelectedBookingLegend() {
    return (<div className="flex flex-wrap gap-2">
      {Object.entries(bookingStatusMeta).map(([k, m]) => (<StatusBadge key={k} tone={m.tone}>
          {m.label}
        </StatusBadge>))}
    </div>);
}
