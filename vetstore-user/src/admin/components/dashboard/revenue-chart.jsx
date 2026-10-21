import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCompactVND, formatVND, revenueByDay } from '@/services/mock-data';
export function RevenueChart() {
    return (<div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={revenueByDay} margin={{ top: 8, right: 8, left: -8, bottom: 0 }} barCategoryGap={18}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3"/>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}/>
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }} tickFormatter={(v) => formatCompactVND(v)}/>
          <Tooltip cursor={{ fill: 'var(--accent)', opacity: 0.6 }} content={({ active, payload, label }) => {
            if (!active || !payload?.length)
                return null;
            const d = payload[0].payload;
            return (<div className="rounded-md border bg-popover px-3 py-2 text-popover-foreground shadow-md">
                  <p className="text-xs text-muted-foreground">Thứ {label}</p>
                  <p className="font-mono text-sm font-semibold">{formatVND(d.revenue)}</p>
                  <p className="text-xs text-muted-foreground">{d.bookings} phiếu đặt</p>
                </div>);
        }}/>
          <Bar dataKey="revenue" radius={[4, 4, 0, 0]} fill="var(--chart-1)" isAnimationActive={false}/>
        </BarChart>
      </ResponsiveContainer>
    </div>);
}
