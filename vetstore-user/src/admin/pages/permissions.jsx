import { useMemo, useState } from 'react';
import { Check, ChevronDown, KeyRound, Plus, Search, ShieldCheck, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PageHeader, StatusBadge } from '@/components/shared';
import { cn } from '@/services/utils';
const groups = [
    {
        label: 'Tổng quan', tone: 'bg-sky-500/12 text-sky-700', permissions: [
            { id: 1, name: 'dashboard.view', description: 'Xem chỉ số và báo cáo tổng quan', group: 'Tổng quan' },
        ],
    },
    {
        label: 'Người dùng & phân quyền', tone: 'bg-violet-500/12 text-violet-700', permissions: [
            { id: 2, name: 'users.view', description: 'Xem danh sách tài khoản và hồ sơ', group: 'Người dùng & phân quyền' },
            { id: 3, name: 'users.manage', description: 'Tạo, sửa, khóa tài khoản người dùng', group: 'Người dùng & phân quyền' },
            { id: 4, name: 'roles.manage', description: 'Quản lý vai trò và gán vai trò', group: 'Người dùng & phân quyền' },
            { id: 5, name: 'permissions.manage', description: 'Cấu hình quyền và quyền theo vai trò', group: 'Người dùng & phân quyền' },
        ],
    },
    {
        label: 'Cơ sở & sân', tone: 'bg-emerald-500/12 text-emerald-700', permissions: [
            { id: 6, name: 'venues.view', description: 'Xem cơ sở, sân và tiện ích', group: 'Cơ sở & sân' },
            { id: 7, name: 'venues.manage', description: 'Tạo, sửa, duyệt và tạm ngưng cơ sở', group: 'Cơ sở & sân' },
            { id: 8, name: 'courts.manage', description: 'Quản lý sân, lịch hoạt động và giá', group: 'Cơ sở & sân' },
        ],
    },
    {
        label: 'Đặt sân & thanh toán', tone: 'bg-amber-500/15 text-amber-700', permissions: [
            { id: 9, name: 'bookings.view', description: 'Xem và tra cứu phiếu đặt sân', group: 'Đặt sân & thanh toán' },
            { id: 10, name: 'bookings.manage', description: 'Xác nhận, check-in, hủy phiếu đặt', group: 'Đặt sân & thanh toán' },
            { id: 11, name: 'payments.view', description: 'Xem giao dịch và trạng thái thanh toán', group: 'Đặt sân & thanh toán' },
            { id: 12, name: 'payments.refund', description: 'Duyệt hoàn tiền cho giao dịch', group: 'Đặt sân & thanh toán' },
            { id: 13, name: 'vouchers.manage', description: 'Tạo và quản lý mã giảm giá', group: 'Đặt sân & thanh toán' },
        ],
    },
    {
        label: 'Giải đấu & đội', tone: 'bg-rose-500/12 text-rose-700', permissions: [
            { id: 14, name: 'teams.manage', description: 'Quản lý đội và thành viên', group: 'Giải đấu & đội' },
            { id: 15, name: 'tournaments.manage', description: 'Tạo, duyệt và điều hành giải đấu', group: 'Giải đấu & đội' },
            { id: 16, name: 'matches.manage', description: 'Xếp lịch, cập nhật tỷ số trận đấu', group: 'Giải đấu & đội' },
            { id: 17, name: 'reviews.moderate', description: 'Kiểm duyệt và phản hồi đánh giá', group: 'Giải đấu & đội' },
        ],
    },
];
const roleData = [
    { key: 'admin', label: 'Quản trị viên', description: 'Toàn quyền trên hệ thống', color: 'bg-primary text-primary-foreground', count: 1, coverage: 17 },
    { key: 'owner', label: 'Chủ sân', description: 'Quản lý cơ sở và vận hành sân', color: 'bg-amber-500 text-white', count: 4, coverage: 10 },
    { key: 'staff', label: 'Nhân viên', description: 'Hỗ trợ booking, check-in và thanh toán', color: 'bg-sky-600 text-white', count: 1, coverage: 7 },
    { key: 'customer', label: 'Khách hàng', description: 'Đặt sân, đội và giải đấu', color: 'bg-muted text-muted-foreground', count: 5, coverage: 5 },
];
const rolePermissions = {
    admin: Array.from({ length: 17 }, (_, i) => i + 1),
    owner: [1, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16],
    staff: [1, 6, 9, 10, 11, 12, 17],
    customer: [1, 6, 9, 14, 15],
};
export default function PermissionsPage() {
    const [role, setRole] = useState('admin');
    const [query, setQuery] = useState('');
    const [expanded, setExpanded] = useState(groups.map((group) => group.label));
    const [selected, setSelected] = useState(rolePermissions.admin);
    const activeRole = roleData.find((item) => item.key === role);
    const visibleGroups = useMemo(() => groups.map((group) => ({
        ...group,
        permissions: group.permissions.filter((permission) => `${permission.name} ${permission.description}`.toLowerCase().includes(query.toLowerCase())),
    })).filter((group) => group.permissions.length > 0), [query]);
    function selectRole(key) {
        setRole(key);
        setSelected(rolePermissions[key]);
    }
    function togglePermission(id) {
        setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    }
    return (<>
      <PageHeader title="Phân quyền" description="roles · permissions · user_roles · role_permissions">
        <Button><Plus className="size-4"/> Tạo vai trò</Button>
      </PageHeader>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Tổng quan phân quyền">
        <Card><CardContent className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-sky-500/12 text-sky-700"><ShieldCheck className="size-5"/></span><div><p className="text-sm font-semibold">{roleData.length} vai trò</p><p className="text-xs text-muted-foreground">Theo cấu hình hệ thống</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-violet-500/12 text-violet-700"><KeyRound className="size-5"/></span><div><p className="text-sm font-semibold">{groups.reduce((sum, group) => sum + group.permissions.length, 0)} quyền</p><p className="text-xs text-muted-foreground">Policy-based authorization</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/12 text-emerald-700"><Users className="size-5"/></span><div><p className="text-sm font-semibold">11 người dùng</p><p className="text-xs text-muted-foreground">Đang được gán vai trò</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700"><Check className="size-5"/></span><div><p className="text-sm font-semibold">Đã đồng bộ</p><p className="text-xs text-muted-foreground">Role permissions hoạt động</p></div></CardContent></Card>
      </section>

      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader><CardTitle>Vai trò hệ thống</CardTitle><CardDescription>Chọn role để cấu hình quyền</CardDescription></CardHeader>
          <CardContent className="grid gap-2">
            {roleData.map((item) => <button key={item.key} onClick={() => selectRole(item.key)} className={cn('flex items-start gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-muted', role === item.key && 'border-primary bg-primary/5')} aria-pressed={role === item.key}><span className={cn('mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold', item.color)}>{item.label.slice(0, 1)}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">{item.label}</span><Badge variant="outline" className="text-[10px]">{item.count}</Badge></span><span className="mt-1 block text-xs leading-4 text-muted-foreground">{item.description}</span></span></button>)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="gap-4 border-b md:flex-row md:items-center md:justify-between"><div><CardTitle>Quyền của {activeRole.label}</CardTitle><CardDescription>{activeRole.coverage}/{groups.reduce((sum, group) => sum + group.permissions.length, 0)} quyền đang được cấp</CardDescription></div><div className="relative w-full md:w-64"><Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm quyền..." className="pl-8" aria-label="Tìm quyền"/></div></CardHeader>
          <CardContent className="space-y-3 pt-5">
            {visibleGroups.map((group) => { const isOpen = expanded.includes(group.label); return <div key={group.label} className="overflow-hidden rounded-xl border"><button className="flex w-full items-center gap-3 bg-muted/40 px-4 py-3 text-left" onClick={() => setExpanded((current) => isOpen ? current.filter((item) => item !== group.label) : [...current, group.label])} aria-expanded={isOpen}><span className={cn('rounded-md px-2 py-1 text-[11px] font-semibold', group.tone)}>{group.label}</span><span className="text-xs text-muted-foreground">{group.permissions.length} quyền</span><ChevronDown className={cn('ml-auto size-4 transition-transform', isOpen && 'rotate-180')}/></button>{isOpen && <div className="divide-y">{group.permissions.map((permission) => { const granted = selected.includes(permission.id); return <div key={permission.id} className="flex items-center gap-3 px-4 py-3"><button onClick={() => togglePermission(permission.id)} className={cn('flex size-5 shrink-0 items-center justify-center rounded border transition-colors', granted ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background')} aria-label={`${granted ? 'Thu hồi' : 'Cấp'} quyền ${permission.name}`} aria-pressed={granted}>{granted && <Check className="size-3.5"/>}</button><span className="min-w-0 flex-1"><span className="block font-mono text-xs font-semibold">{permission.name}</span><span className="block text-xs text-muted-foreground">{permission.description}</span></span><StatusBadge tone={granted ? 'success' : 'neutral'} dot={false} className="hidden sm:inline-flex">{granted ? 'Được cấp' : 'Chưa cấp'}</StatusBadge></div>; })}</div>}</div>; })}
            {visibleGroups.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">Không tìm thấy quyền phù hợp.</div>}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4"><p className="text-xs text-muted-foreground">Thay đổi sẽ áp dụng cho người dùng đang gán vai trò này.</p><div className="flex gap-2"><Button variant="outline" onClick={() => setSelected(rolePermissions[role])}><X className="size-4"/> Hủy thay đổi</Button><Button onClick={() => setSelected([...selected])}><Check className="size-4"/> Lưu phân quyền</Button></div></div>
          </CardContent>
        </Card>
      </div>
    </>);
}
