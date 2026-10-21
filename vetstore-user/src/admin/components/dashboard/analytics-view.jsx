import { useState } from 'react';
import {
    Area,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ComposedChart,
    Legend,
    Line,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    ArrowUpRight,
    Calendar,
    CircleDollarSign,
    Clock,
    Flame,
    LandPlot,
    TrendingUp,
    Users,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { bookingsBySport, formatCompactVND, formatVND, revenueByDay } from '@/services/mock-data';

// Dữ liệu tỷ lệ lấp đầy theo khung giờ
const hourlyOccupancy = [
    { time: '05:00 - 07:00', rate: 45, bookings: 16, peak: false },
    { time: '07:00 - 09:00', rate: 60, bookings: 22, peak: false },
    { time: '09:00 - 11:00', rate: 35, bookings: 12, peak: false },
    { time: '11:00 - 14:00', rate: 25, bookings: 9, peak: false },
    { time: '14:00 - 16:00', rate: 40, bookings: 15, peak: false },
    { time: '16:00 - 17:30', rate: 75, bookings: 28, peak: true },
    { time: '17:30 - 19:30', rate: 96, bookings: 36, peak: true },
    { time: '19:30 - 21:00', rate: 92, bookings: 34, peak: true },
    { time: '21:00 - 23:00', rate: 55, bookings: 20, peak: false },
];

// Dữ liệu doanh thu theo cơ sở
const venueRevenue = [
    { name: 'Sân Thống Nhất', revenue: 48500000, bookings: 142, fill: '#3b82f6' },
    { name: 'CLB Phú Thọ', revenue: 31200000, bookings: 98, fill: '#10b981' },
    { name: 'Pickleball Sala', revenue: 26800000, bookings: 86, fill: '#f59e0b' },
    { name: 'Tennis Lan Anh', revenue: 14800000, bookings: 41, fill: '#8b5cf6' },
];

// Màu sắc cho biểu đồ tròn môn thể thao
const SPORT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function AnalyticsView() {
    const [timeRange, setTimeRange] = useState('7d');

    const totalRevenue = revenueByDay.reduce((acc, cur) => acc + cur.revenue, 0);
    const totalBookings = revenueByDay.reduce((acc, cur) => acc + cur.bookings, 0);
    const avgBookingValue = Math.round(totalRevenue / totalBookings);
    const totalSportBookings = bookingsBySport.reduce((acc, cur) => acc + cur.value, 0);

    return (
        <div className="flex flex-col gap-6">
            {/* Thanh điều khiển khoảng thời gian & Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Trung tâm Phân tích & Thống kê</h2>
                    <p className="text-xs text-muted-foreground">
                        Dữ liệu vận hành sân, doanh thu và hành vi đặt chỗ của khách hàng
                    </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border bg-card p-1">
                    <Button
                        size="xs"
                        variant={timeRange === '7d' ? 'default' : 'ghost'}
                        onClick={() => setTimeRange('7d')}
                    >
                        7 ngày qua
                    </Button>
                    <Button
                        size="xs"
                        variant={timeRange === '30d' ? 'default' : 'ghost'}
                        onClick={() => setTimeRange('30d')}
                    >
                        Tháng này
                    </Button>
                    <Button
                        size="xs"
                        variant={timeRange === 'quarter' ? 'default' : 'ghost'}
                        onClick={() => setTimeRange('quarter')}
                    >
                        Quý này
                    </Button>
                </div>
            </div>

            {/* 4 Thẻ KPI chính */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Card className="bg-card">
                    <CardContent className="flex flex-col gap-2 p-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Tổng doanh thu tuần</span>
                            <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <CircleDollarSign className="size-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="font-mono text-xl font-bold text-foreground">
                                {formatVND(totalRevenue)}
                            </span>
                            <span className="flex items-center text-xs font-semibold text-success">
                                <ArrowUpRight className="size-3.5" /> +15.4%
                            </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">so với tuần trước</span>
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardContent className="flex flex-col gap-2 p-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Lượt đặt sân</span>
                            <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
                                <Calendar className="size-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="font-mono text-xl font-bold text-foreground">
                                {totalBookings} lượt
                            </span>
                            <span className="flex items-center text-xs font-semibold text-success">
                                <ArrowUpRight className="size-3.5" /> +8.2%
                            </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">Trung bình 52 lượt/ngày</span>
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardContent className="flex flex-col gap-2 p-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Lấp đầy giờ cao điểm</span>
                            <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600">
                                <Flame className="size-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="font-mono text-xl font-bold text-foreground">
                                94.6%
                            </span>
                            <span className="flex items-center text-xs font-semibold text-success">
                                <ArrowUpRight className="size-3.5" /> +3.1%
                            </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">Khung giờ 17:00 - 21:00</span>
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardContent className="flex flex-col gap-2 p-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Giá trị TB / đơn</span>
                            <div className="flex size-7 items-center justify-center rounded-md bg-purple-500/10 text-purple-600">
                                <TrendingUp className="size-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="font-mono text-xl font-bold text-foreground">
                                {formatVND(avgBookingValue)}
                            </span>
                            <span className="flex items-center text-xs font-semibold text-success">
                                <ArrowUpRight className="size-3.5" /> +6.7%
                            </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">2.1 giờ/phiếu đặt</span>
                    </CardContent>
                </Card>
            </div>

            {/* Hàng 1: Biểu đồ Doanh thu & Lượt đặt (Composed Chart) + Cơ cấu môn thể thao (Pie Chart) */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Doanh thu kết hợp lượt đặt */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    Doanh thu & Số lượt đặt theo ngày
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Cột: Doanh thu (VND) · Đường: Số lượt đặt sân
                                </CardDescription>
                            </div>
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                Tuần 37 · 2026
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    data={revenueByDay}
                                    margin={{ top: 12, right: 12, left: -4, bottom: 0 }}
                                >
                                    <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 11,
                                            fill: 'var(--muted-foreground)',
                                            fontFamily: 'var(--font-mono)',
                                        }}
                                        tickFormatter={(v) => formatCompactVND(v)}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 11,
                                            fill: 'var(--muted-foreground)',
                                            fontFamily: 'var(--font-mono)',
                                        }}
                                        tickFormatter={(v) => `${v} lượt`}
                                    />
                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (!active || !payload?.length) return null;
                                            const d = payload[0].payload;
                                            return (
                                                <div className="rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg">
                                                    <p className="font-semibold">Thứ {label}</p>
                                                    <p className="font-mono text-sm font-bold text-primary">
                                                        Doanh thu: {formatVND(d.revenue)}
                                                    </p>
                                                    <p className="font-mono text-xs text-emerald-600">
                                                        Lượt đặt: {d.bookings} lượt
                                                    </p>
                                                </div>
                                            );
                                        }}
                                    />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="revenue"
                                        fill="#3b82f6"
                                        radius={[4, 4, 0, 0]}
                                        name="Doanh thu"
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="bookings"
                                        stroke="#10b981"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: '#10b981' }}
                                        name="Lượt đặt"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Cơ cấu môn thể thao (Donut Chart) */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Tỷ lệ theo Môn thể thao</CardTitle>
                        <CardDescription className="text-xs">
                            Tổng cộng {totalSportBookings} lượt đặt trong tuần
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="h-52 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={bookingsBySport}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={52}
                                        outerRadius={78}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {bookingsBySport.map((entry, index) => (
                                            <Cell
                                                key={`cell-${entry.sport}`}
                                                fill={SPORT_COLORS[index % SPORT_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val, name) => [
                                            `${val} lượt (${Math.round((val / totalSportBookings) * 100)}%)`,
                                            name,
                                        ]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Chú thích môn thể thao */}
                        <div className="grid w-full grid-cols-2 gap-2 border-t pt-3 text-xs">
                            {bookingsBySport.map((entry, index) => {
                                const pct = Math.round((entry.value / totalSportBookings) * 100);
                                return (
                                    <div key={entry.sport} className="flex items-center gap-2">
                                        <span
                                            className="size-2.5 shrink-0 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    SPORT_COLORS[index % SPORT_COLORS.length],
                                            }}
                                        />
                                        <span className="truncate text-muted-foreground">
                                            {entry.sport}
                                        </span>
                                        <span className="ml-auto font-mono font-semibold">
                                            {pct}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Hàng 2: Tỷ lệ lấp đầy theo khung giờ + Doanh thu từng cơ sở */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Lấp đầy theo khung giờ */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    Tỷ lệ lấp đầy theo Khung giờ
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Khung giờ cao điểm được đánh dấu nổi bật
                                </CardDescription>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-semibold text-warning-foreground">
                                <Flame className="size-3.5 text-amber-500" /> Giờ vàng 17h-21h
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={hourlyOccupancy}
                                    layout="vertical"
                                    margin={{ top: 4, right: 16, left: 16, bottom: 4 }}
                                >
                                    <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" />
                                    <XAxis
                                        type="number"
                                        domain={[0, 100]}
                                        unit="%"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10.5, fill: 'var(--foreground)' }}
                                        width={85}
                                    />
                                    <Tooltip
                                        formatter={(val) => [`${val}% công suất`, 'Tỷ lệ lấp đầy']}
                                    />
                                    <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                                        {hourlyOccupancy.map((entry, index) => (
                                            <Cell
                                                key={`hour-${index}`}
                                                fill={entry.peak ? '#f59e0b' : '#3b82f6'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Doanh thu theo cơ sở sân */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">
                            Đóng góp Doanh thu theo Cơ sở
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Top 4 cơ sở thể thao có lượng đặt sân cao nhất
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            {venueRevenue.map((v) => {
                                const percent = Math.round((v.revenue / totalRevenue) * 100);
                                return (
                                    <div key={v.name} className="flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-foreground">
                                                {v.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-muted-foreground">
                                                    {v.bookings} lượt
                                                </span>
                                                <span className="font-mono font-bold text-foreground">
                                                    {formatVND(v.revenue)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${percent}%`,
                                                    backgroundColor: v.fill,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-auto flex items-center justify-between rounded-lg bg-accent/40 p-3 text-xs">
                            <span className="text-muted-foreground">Cơ sở tăng trưởng nhanh nhất:</span>
                            <span className="font-semibold text-primary">Pickleball Sala Garden (+32%)</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
