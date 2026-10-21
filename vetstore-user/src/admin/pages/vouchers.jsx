import { Copy, Plus, TicketPercent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/shared';
import { findUser, formatVND, voucherUsages, vouchers } from '@/services/mock-data';
import { cn } from '@/services/utils';
export default function VouchersPage() {
    return (<>
      <PageHeader title="Mã giảm giá" description="Bảng vouchers · voucher_usages">
        <Button>
          <Plus className="size-4"/> Tạo voucher
        </Button>
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Danh sách voucher">
        {vouchers.map((v) => {
            const used = Math.round((v.used / v.usageLimit) * 100);
            const exhausted = v.used >= v.usageLimit;
            return (<Card key={v.id} className={cn('relative overflow-hidden', !v.active && 'opacity-70')}>
              <div className="absolute -left-2 top-1/2 size-4 -translate-y-1/2 rounded-full border bg-background" aria-hidden="true"/>
              <div className="absolute -right-2 top-1/2 size-4 -translate-y-1/2 rounded-full border bg-background" aria-hidden="true"/>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-mono text-lg font-bold tracking-wider">{v.code}</span>
                    <span className="text-xs text-muted-foreground">{v.description}</span>
                  </div>
                  <Switch defaultChecked={v.active} aria-label={`Bật ${v.code}`}/>
                </div>
                <div className="flex items-end justify-between border-y border-dashed py-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Giảm</span>
                    <span className="font-mono text-2xl font-bold text-primary">{v.type === 'percent' ? `${v.value}%` : formatVND(v.value)}</span>
                  </div>
                  <div className="flex flex-col items-end text-xs text-muted-foreground">
                    <span>Đơn tối thiểu</span>
                    <span className="font-mono font-medium text-foreground">{formatVND(v.minOrder)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Đã dùng</span>
                    <span className={cn('font-mono font-medium', exhausted && 'text-destructive')}>
                      {v.used}/{v.usageLimit}
                    </span>
                  </div>
                  <Progress value={used}/>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>HSD: <span className="font-mono">{(v.expiresAt || '2026-12-31').split('-').reverse().join('/')}</span></span>
                  <Button variant="ghost" size="xs">
                    <Copy className="size-3"/> Sao chép
                  </Button>
                </div>
              </CardContent>
            </Card>);
        })}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TicketPercent className="size-4 text-primary"/> Lịch sử sử dụng
          </CardTitle>
          <CardDescription>Bảng voucher_usages · mỗi dòng gắn với một phiếu đặt</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Mã</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Phiếu đặt</TableHead>
                <TableHead className="text-right">Giảm</TableHead>
                <TableHead className="pr-4 text-right">Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {voucherUsages.map((u) => (<TableRow key={u.id}>
                  <TableCell className="pl-4 font-mono font-semibold">{vouchers.find((v) => v.id === u.voucherId)?.code}</TableCell>
                  <TableCell>{findUser(u.userId)?.fullName}</TableCell>
                  <TableCell className="font-mono">{u.bookingId}</TableCell>
                  <TableCell className="text-right font-mono text-success">-{formatVND(u.discount)}</TableCell>
                  <TableCell className="pr-4 text-right font-mono text-xs text-muted-foreground">{u.usedAt}</TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>);
}
