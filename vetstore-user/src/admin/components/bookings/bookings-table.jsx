import { useState } from 'react';
import { Download, Filter, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge, bookingStatusMeta, paymentStatusMeta } from '@/components/shared';
import { bookingStatusHistory, bookings, findCourt, findSlot, findUser, findVenue, formatVND, initials, payments, paymentMethods, sports, venues, courts, timeSlots, } from '@/services/mock-data';
import { cn } from '@/services/utils';
const filters = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'checked_in', label: 'Đang chơi' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
];
export function BookingsTable() {
    const [filter, setFilter] = useState('all');
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(null);
    const rows = bookings
        .filter((b) => filter === 'all' || b.status === filter)
        .filter((b) => {
        if (!query)
            return true;
        const q = query.toLowerCase();
        return b.id.toLowerCase().includes(q) || findUser(b.userId)?.fullName.toLowerCase().includes(q);
    })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const count = (s) => (s === 'all' ? bookings.length : bookings.filter((b) => b.status === s).length);
    return (<div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v)} className="overflow-x-auto">
          <TabsList className="h-9">
            {filters.map((f) => (<TabsTrigger key={f.value} value={f.value} className="gap-1.5 px-2.5">
                {f.label}
                <span className="rounded bg-background/80 px-1 font-mono text-[10px] text-muted-foreground">{count(f.value)}</span>
              </TabsTrigger>))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Mã phiếu, tên khách..." className="h-9 w-56 bg-card pl-8" aria-label="Tìm phiếu đặt"/>
          </div>
          <Button variant="outline" size="icon-lg" className="bg-card" aria-label="Bộ lọc nâng cao">
            <Filter className="size-4"/>
          </Button>
          <Button variant="outline" size="icon-lg" className="bg-card" aria-label="Xuất Excel">
            <Download className="size-4"/>
          </Button>
          <CreateBookingDialog />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Mã phiếu</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Sân</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="pr-4 text-right">Tạo lúc</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((b) => {
            const u = findUser(b.userId);
            const c = findCourt(b.courtId);
            const v = c ? findVenue(c.venueId) : undefined;
            const slotIds = b.slotIds || [3, 4];
            const first = findSlot(slotIds[0]);
            const last = findSlot(slotIds[slotIds.length - 1]);
            const sm = bookingStatusMeta[b.status];
            const pm = paymentStatusMeta[b.paymentStatus];
            return (<TableRow key={b.id} className="cursor-pointer" onClick={() => setActive(b)}>
                    <TableCell className="pl-4 font-mono font-semibold">{b.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                          <AvatarFallback className="bg-accent text-[10px] font-semibold text-accent-foreground">{initials(u?.fullName ?? '')}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col leading-tight">
                          <span className="text-sm font-medium">{u?.fullName}</span>
                          <span className="font-mono text-[11px] text-muted-foreground">{u?.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col leading-tight">
                        <span className="font-medium">{c?.name}</span>
                        <span className="text-xs text-muted-foreground">{v?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col font-mono leading-tight">
                        <span>{b.date.split('-').reverse().join('/')}</span>
                        <span className="text-xs text-muted-foreground">
                          {first?.start}–{last?.end}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <div className="flex flex-col leading-tight">
                        <span className="font-semibold">{formatVND(b.total - b.discount)}</span>
                        {b.discount > 0 && <span className="text-xs text-success">-{formatVND(b.discount)}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={pm.tone} dot={false}>
                        {pm.label}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={sm.tone}>{sm.label}</StatusBadge>
                    </TableCell>
                    <TableCell className="pr-4 text-right font-mono text-xs text-muted-foreground">{b.createdAt}</TableCell>
                  </TableRow>);
        })}
              {rows.length === 0 && (<TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    Không có phiếu đặt phù hợp.
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BookingSheet booking={active} onClose={() => setActive(null)}/>
    </div>);
}
function BookingSheet({ booking, onClose }) {
    const b = booking;
    const u = b ? findUser(b.userId) : undefined;
    const c = b ? findCourt(b.courtId) : undefined;
    const v = c ? findVenue(c.venueId) : undefined;
    const history = b ? bookingStatusHistory.filter((h) => h.bookingId === b.id) : [];
    const pays = b ? payments.filter((p) => p.bookingId === b.id) : [];
    return (<Sheet open={!!b} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
        {b && (<>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 font-mono">
                {b.id}
                <StatusBadge tone={bookingStatusMeta[b.status].tone}>{bookingStatusMeta[b.status].label}</StatusBadge>
              </SheetTitle>
              <SheetDescription>Phiếu đặt sân · tạo lúc {b.createdAt}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-5 px-4 pb-6">
              <section className="flex items-center gap-3 rounded-lg border p-3">
                <Avatar className="size-10"><AvatarFallback className="bg-accent text-sm font-semibold text-accent-foreground">{initials(u?.fullName ?? '')}</AvatarFallback></Avatar>
                <div className="flex min-w-0 flex-col leading-tight"><span className="font-semibold">{u?.fullName}</span><span className="truncate font-mono text-xs text-muted-foreground">{u?.phone} · {u?.email}</span></div>
              </section>
              <section className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Chi tiết đặt sân</h3>
                <div className="rounded-lg border">
                  {(b.slotIds || [3, 4]).map((sid, i) => { const s = findSlot(sid); const price = s?.peak ? c?.peakPrice : c?.basePrice; return <div key={sid} className={cn('flex items-center justify-between px-3 py-2 text-sm', i > 0 && 'border-t')}><div className="flex flex-col leading-tight"><span className="font-medium">{c?.name} · {v?.name}</span><span className="font-mono text-xs text-muted-foreground">{b.date.split('-').reverse().join('/')} · {s?.start}–{s?.end}{s?.peak && <span className="ml-1.5 text-warning-foreground">Cao điểm</span>}</span></div><span className="font-mono">{formatVND(price ?? 0)}</span></div>; })}
                  <div className="flex justify-between border-t bg-muted/50 px-3 py-2 text-sm font-semibold"><span>Tổng cộng</span><span className="font-mono">{formatVND(b.total - b.discount)}</span></div>
                </div>
              </section>
              <section className="flex flex-col gap-2"><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Thanh toán</h3>{pays.length === 0 && <p className="text-sm text-muted-foreground">Chưa có giao dịch.</p>}{pays.map((p) => <div key={p.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"><span>{paymentMethods.find((m) => m.id === p.methodId)?.name}</span><StatusBadge tone={paymentStatusMeta[p.status].tone} dot={false}>{paymentStatusMeta[p.status].label}</StatusBadge></div>)}</section>
              <section className="flex flex-col gap-2"><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lịch sử trạng thái</h3><ol className="flex flex-col gap-3 border-l pl-4">{(history.length ? history : [{ id: 0, from: null, to: b.status, by: u?.fullName ?? '', at: b.createdAt, note: 'Khách tạo phiếu' }]).map((h) => <li key={h.id} className="relative text-sm"><span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full border-2 border-card bg-primary"/><span className="font-medium">{h.from ? `${bookingStatusMeta[h.from].label} → ` : ''}{bookingStatusMeta[h.to].label}</span><span className="block text-xs text-muted-foreground">{h.by} · {h.at}</span></li>)}</ol></section>
              <Separator /><div className="flex gap-2">{b.status === 'pending' && <Button className="flex-1">Xác nhận phiếu</Button>}{b.status === 'confirmed' && <Button className="flex-1">Check-in</Button>}{b.status === 'checked_in' && <Button className="flex-1">Hoàn thành</Button>}{['pending', 'confirmed'].includes(b.status) && <Button variant="destructive" className="flex-1">Hủy phiếu</Button>}</div>
            </div>
          </>)}
      </SheetContent>
    </Sheet>);
}
function CreateBookingDialog() {
    const [sportId, setSportId] = useState('1');
    const [venueId, setVenueId] = useState('1');
    const [courtId, setCourtId] = useState('');
    const [date, setDate] = useState('2026-09-08');
    const [slotId, setSlotId] = useState('');
    const sportVenues = venues.filter((venue) => courts.some((court) => court.venueId === venue.id && String(court.sportId) === sportId));
    const venueCourts = courts.filter((court) => court.venueId === Number(venueId) && String(court.sportId) === sportId && court.status === 'available');
    return (<Dialog>
      <DialogTrigger asChild>
        <Button size="lg"><Plus className="size-4"/> Tạo phiếu</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo phiếu đặt sân</DialogTitle>
          <DialogDescription>Chọn môn thể thao, địa điểm và khung giờ trước khi xác nhận.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Môn thể thao</Label>
            <Select value={sportId} onValueChange={(value) => { setSportId(value); setVenueId(''); setCourtId(''); }}>
              <SelectTrigger><SelectValue placeholder="Chọn môn"/></SelectTrigger>
              <SelectContent>{sports.map((sport) => <SelectItem key={sport.id} value={String(sport.id)}>{sport.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Địa điểm sân</Label>
            <Select value={venueId} onValueChange={(value) => { setVenueId(value); setCourtId(''); }}>
              <SelectTrigger><SelectValue placeholder="Chọn địa điểm"/></SelectTrigger>
              <SelectContent>{sportVenues.map((venue) => <SelectItem key={venue.id} value={String(venue.id)}>{venue.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Sân cụ thể</Label>
            <Select value={courtId} onValueChange={setCourtId} disabled={!venueId}>
              <SelectTrigger><SelectValue placeholder="Chọn sân"/></SelectTrigger>
              <SelectContent>{venueCourts.map((court) => <SelectItem key={court.id} value={String(court.id)}>{court.name} · {court.type}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Ngày đặt</Label>
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)}/>
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label>Khung giờ</Label>
            <Select value={slotId} onValueChange={setSlotId}>
              <SelectTrigger><SelectValue placeholder="Chọn khung giờ"/></SelectTrigger>
              <SelectContent>{timeSlots.map((slot) => <SelectItem key={slot.id} value={String(slot.id)}>{slot.start}–{slot.end}{slot.peak ? ' · Cao điểm' : ''}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button">Hủy</Button>
          <Button type="button" disabled={!sportId || !venueId || !courtId || !date || !slotId}>Tiếp tục thanh toán</Button>
        </div>
      </DialogContent>
    </Dialog>);
}
function BookingSheetLegacy({ booking, onClose }) {
    const b = booking;
    const u = b ? findUser(b.userId) : undefined;
    const c = b ? findCourt(b.courtId) : undefined;
    const v = c ? findVenue(c.venueId) : undefined;
    const history = b ? bookingStatusHistory.filter((h) => h.bookingId === b.id) : [];
    const pays = b ? payments.filter((p) => p.bookingId === b.id) : [];
    return (<Sheet open={!!b} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
        {b && (<>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 font-mono">
                {b.id}
                <StatusBadge tone={bookingStatusMeta[b.status].tone}>{bookingStatusMeta[b.status].label}</StatusBadge>
              </SheetTitle>
              <SheetDescription>Phiếu đặt sân · tạo lúc {b.createdAt}</SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-5 px-4 pb-6">
              <section className="flex items-center gap-3 rounded-lg border p-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-accent text-sm font-semibold text-accent-foreground">{initials(u?.fullName ?? '')}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="font-semibold">{u?.fullName}</span>
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {u?.phone} · {u?.email}
                  </span>
                </div>
                <span className="ml-auto shrink-0 whitespace-nowrap rounded-md bg-muted px-2 py-1 font-mono text-xs">{u?.bookings} lượt</span>
              </section>

              <section className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Chi tiết đặt sân</h3>
                <div className="rounded-lg border">
                  {(b.slotIds || [3, 4]).map((sid, i) => {
                const s = findSlot(sid);
                const price = s?.peak ? c?.peakPrice : c?.basePrice;
                return (<div key={sid} className={cn('flex items-center justify-between px-3 py-2 text-sm', i > 0 && 'border-t')}>
                        <div className="flex flex-col leading-tight">
                          <span className="font-medium">
                            {c?.name} · {v?.name}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {b.date.split('-').reverse().join('/')} · {s?.start}–{s?.end}
                            {s?.peak && <span className="ml-1.5 text-warning-foreground">Cao điểm</span>}
                          </span>
                        </div>
                        <span className="font-mono">{formatVND(price ?? 0)}</span>
                      </div>);
            })}
                  <div className="flex flex-col gap-1 border-t bg-muted/50 px-3 py-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tạm tính</span>
                      <span className="font-mono">{formatVND(b.total)}</span>
                    </div>
                    {b.discount > 0 && (<div className="flex justify-between text-success">
                        <span>Giảm giá</span>
                        <span className="font-mono">-{formatVND(b.discount)}</span>
                      </div>)}
                    <div className="flex justify-between font-semibold">
                      <span>Tổng cộng</span>
                      <span className="font-mono">{formatVND(b.total - b.discount)}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Thanh toán</h3>
                {pays.length === 0 && <p className="text-sm text-muted-foreground">Chưa có giao dịch.</p>}
                {pays.map((p) => (<div key={p.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium">{paymentMethods.find((m) => m.id === p.methodId)?.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {p.id} · {p.txnRef}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono font-semibold">{formatVND(p.amount)}</span>
                      <StatusBadge tone={paymentStatusMeta[p.status].tone} dot={false}>
                        {paymentStatusMeta[p.status].label}
                      </StatusBadge>
                    </div>
                  </div>))}
              </section>

              <section className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lịch sử trạng thái</h3>
                <ol className="flex flex-col gap-3 border-l pl-4">
                  {(history.length
                ? history
                : [{ id: 0, from: null, to: b.status, by: u?.fullName ?? '', at: b.createdAt, note: 'Khách tạo phiếu' }]).map((h) => (<li key={h.id} className="relative flex flex-col text-sm">
                      <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full border-2 border-card bg-primary"/>
                      <span className="font-medium">
                        {h.from ? `${bookingStatusMeta[h.from].label} → ` : ''}
                        {bookingStatusMeta[h.to].label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {h.by} · <span className="font-mono">{h.at}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">{h.note}</span>
                    </li>))}
                </ol>
              </section>

              <Separator />
              <div className="flex gap-2">
                {b.status === 'pending' && <Button className="flex-1">Xác nhận phiếu</Button>}
                {b.status === 'confirmed' && <Button className="flex-1">Check-in</Button>}
                {b.status === 'checked_in' && <Button className="flex-1">Hoàn thành</Button>}
                {['pending', 'confirmed'].includes(b.status) && (<Button variant="destructive" className="flex-1">
                    Hủy phiếu
                  </Button>)}
                {['completed', 'cancelled'].includes(b.status) && (<Button variant="outline" className="flex-1">
                    In hóa đơn
                  </Button>)}
              </div>
            </div>
          </>)}
      </SheetContent>
    </Sheet>);
}
