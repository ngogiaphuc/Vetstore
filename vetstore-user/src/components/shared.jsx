import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/services/utils';

export { FormModal } from './shared/FormModal';
export { ConfirmDeleteModal } from './shared/ConfirmDeleteModal';
export { CrudHeader } from './shared/CrudHeader';

export function PageHeader({ title, description, children, }) {
    return (<div className="subpage-heading motion-reveal">
      <div className="flex items-start gap-3">
        <span className="subpage-heading-mark" aria-hidden="true"/>
        <div className="flex flex-col gap-1">
          <p className="subpage-kicker">SPORTHUB ADMIN</p>
          <h2 className="text-2xl font-bold tracking-tight text-balance">{title}</h2>
          {description && <p className="text-sm text-muted-foreground text-pretty">{description}</p>}
        </div>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>);
}
export function StatCard({ label, value, delta, hint, icon: Icon, }) {
    const up = (delta ?? 0) >= 0;
    return (<Card className="sports-subpage-card motion-reveal">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Icon className="size-4"/>
          </span>
        </div>
        <div className="flex items-end justify-between gap-2">
          <span className="font-mono text-2xl font-semibold tracking-tight">{value}</span>
          {delta !== undefined && (<span className={cn('flex items-center gap-0.5 font-mono text-xs font-medium', up ? 'text-success' : 'text-destructive')}>
              {up ? <ArrowUpRight className="size-3.5"/> : <ArrowDownRight className="size-3.5"/>}
              {Math.abs(delta)}%
            </span>)}
        </div>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </CardContent>
    </Card>);
}
const toneClass = {
    success: 'bg-success/12 text-success border-success/20',
    warning: 'bg-warning/25 text-warning-foreground border-warning/40',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
    neutral: 'bg-muted text-muted-foreground border-border',
    info: 'bg-chart-4/15 text-chart-4 border-chart-4/25',
    primary: 'bg-primary text-primary-foreground border-primary',
};
export function StatusBadge({ tone, children, dot = true, className }) {
    return (<Badge variant="outline" className={cn('gap-1.5 rounded-md', toneClass[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current"/>}
      {children}
    </Badge>);
}
export const bookingStatusMeta = {
    pending: { label: 'Chờ xác nhận', tone: 'warning' },
    confirmed: { label: 'Đã xác nhận', tone: 'info' },
    checked_in: { label: 'Đang chơi', tone: 'success' },
    completed: { label: 'Hoàn thành', tone: 'neutral' },
    cancelled: { label: 'Đã hủy', tone: 'destructive' },
};
export const paymentStatusMeta = {
    unpaid: { label: 'Chưa thanh toán', tone: 'neutral' },
    deposit: { label: 'Đã cọc', tone: 'warning' },
    paid: { label: 'Đã thanh toán', tone: 'success' },
    refunded: { label: 'Đã hoàn', tone: 'destructive' },
    success: { label: 'Thành công', tone: 'success' },
    pending: { label: 'Đang xử lý', tone: 'warning' },
    failed: { label: 'Thất bại', tone: 'destructive' },
};
export const tournamentStatusMeta = {
    draft: { label: 'Bản nháp', tone: 'neutral' },
    registration: { label: 'Mở đăng ký', tone: 'warning' },
    ongoing: { label: 'Đang diễn ra', tone: 'success' },
    finished: { label: 'Đã kết thúc', tone: 'info' },
};
export const courtStatusMeta = {
    available: { label: 'Hoạt động', tone: 'success' },
    maintenance: { label: 'Bảo trì', tone: 'warning' },
    closed: { label: 'Đóng', tone: 'destructive' },
};
export const venueStatusMeta = {
    active: { label: 'Hoạt động', tone: 'success' },
    inactive: { label: 'Tạm ngưng', tone: 'neutral' },
    pending: { label: 'Chờ duyệt', tone: 'warning' },
};
export function Stars({ value, className }) {
    return (<span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${value} trên 5 sao`}>
      {Array.from({ length: 5 }).map((_, i) => (<svg key={i} viewBox="0 0 20 20" className={cn('size-3.5', i < Math.round(value) ? 'fill-warning text-warning' : 'fill-muted text-muted')} aria-hidden="true">
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8z"/>
        </svg>))}
    </span>);
}