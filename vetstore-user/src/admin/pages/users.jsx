import { MoreHorizontal, Plus, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageHeader, StatusBadge } from '@/components/shared';
import { initials, users } from '@/services/mock-data';
import { cn } from '@/services/utils';
const roleMeta = {
    admin: { label: 'Quản trị', className: 'bg-primary text-primary-foreground', desc: 'Toàn quyền hệ thống' },
    owner: { label: 'Chủ sân', className: 'bg-warning text-warning-foreground', desc: 'Quản lý cơ sở, sân, giá, giải đấu' },
    staff: { label: 'Nhân viên', className: 'bg-chart-4/20 text-chart-4', desc: 'Check-in, xác nhận phiếu, thu tiền' },
    customer: { label: 'Khách hàng', className: 'bg-muted text-muted-foreground', desc: 'Đặt sân, tham gia đội & giải' },
};
export default function UsersPage() {
    return (<>
      <PageHeader title="Người dùng" description="Bảng users · user_profiles · roles · user_roles">
        <Button>
          <Plus className="size-4"/> Thêm người dùng
        </Button>
      </PageHeader>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Vai trò">
        {Object.keys(roleMeta).map((r) => {
            const count = users.filter((u) => u.roles.includes(r)).length;
            return (<Card key={r}>
              <CardContent className="flex items-center gap-3">
                <span className={cn('flex size-10 items-center justify-center rounded-lg', roleMeta[r].className)}>
                  <ShieldCheck className="size-5"/>
                </span>
                <div className="flex flex-1 flex-col leading-tight">
                  <span className="text-sm font-semibold">{roleMeta[r].label}</span>
                  <span className="text-xs text-muted-foreground">{roleMeta[r].desc}</span>
                </div>
                <span className="font-mono text-xl font-semibold">{count}</span>
              </CardContent>
            </Card>);
        })}
      </section>

      <Card>
        <CardHeader className="flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Danh sách tài khoản</CardTitle>
            <CardDescription>{users.length} tài khoản</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
              <Input placeholder="Tên, email, số điện thoại..." className="h-9 w-60 pl-8" aria-label="Tìm người dùng"/>
            </div>
            <Select defaultValue="all" items={{ all: 'Mọi vai trò', ...Object.fromEntries(Object.keys(roleMeta).map((r) => [r, roleMeta[r].label])) }}>
              <SelectTrigger className="h-9 w-36" aria-label="Lọc vai trò">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Mọi vai trò</SelectItem>
                {Object.keys(roleMeta).map((r) => (<SelectItem key={r} value={r}>
                    {roleMeta[r].label}
                  </SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Người dùng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead className="text-right">Lượt đặt</TableHead>
                <TableHead>Tham gia</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-10 pr-4"/>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (<TableRow key={u.id}>
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-accent text-[11px] font-semibold text-accent-foreground">{initials(u.fullName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-medium">{u.fullName}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">#{String(u.id).padStart(4, '0')}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm">{u.email}</span>
                      <span className="font-mono text-xs text-muted-foreground">{u.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (<span key={r} className={cn('rounded-md px-2 py-0.5 text-[11px] font-medium', roleMeta[r].className)}>
                          {roleMeta[r].label}
                        </span>))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{u.bookings}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{u.joinedAt.split('-').reverse().join('/')}</TableCell>
                  <TableCell>
                    {u.status === 'active' ? <StatusBadge tone="success">Hoạt động</StatusBadge> : <StatusBadge tone="destructive">Bị khóa</StatusBadge>}
                  </TableCell>
                  <TableCell className="pr-4">
                    <Button variant="ghost" size="icon-sm" aria-label={`Thao tác với ${u.fullName}`}>
                      <MoreHorizontal className="size-4"/>
                    </Button>
                  </TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>);
}
