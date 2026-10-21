import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Filter, MapPin, MessageSquare, MessageSquareReply, Search, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PageHeader, Stars } from '@/components/shared';
import { courts, findCourt, findSport, findUser, findVenue, initials, reviews as initialReviews, sports, venues } from '@/services/mock-data';
import { cn } from '@/services/utils';

export default function ReviewsPage() {
    const [reviewsList, setReviewsList] = useState(initialReviews);
    const [selectedVenueId, setSelectedVenueId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSport, setSelectedSport] = useState('all');
    const [starFilter, setStarFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [replyInputs, setReplyInputs] = useState({});
    const [replySuccess, setReplySuccess] = useState({});

    const selectedVenue = venues.find((v) => v.id === selectedVenueId);

    // Tính toán thống kê theo sân
    const getVenueStats = (venueId) => {
        const vReviews = reviewsList.filter((r) => r.venueId === venueId);
        const count = vReviews.length;
        const unreplied = vReviews.filter((r) => !r.replied).length;
        const avg = count > 0 ? vReviews.reduce((s, r) => s + r.rating, 0) / count : 0;
        return { count, unreplied, avg, reviews: vReviews };
    };

    // Lọc danh sách sân
    const filteredVenues = venues.filter((v) => {
        const matchesQuery =
            v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.district.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesQuery) return false;

        if (selectedSport !== 'all') {
            const venueCourts = courts.filter((c) => c.venueId === v.id);
            const hasSport = venueCourts.some((c) => {
                const sp = sports.find((s) => s.id === c.sportId);
                return sp && sp.code === selectedSport;
            });
            if (!hasSport) return false;
        }

        return true;
    });

    // Lọc đánh giá của sân đang chọn
    const currentVenueReviews = selectedVenue
        ? reviewsList.filter((r) => {
              if (r.venueId !== selectedVenue.id) return false;
              if (starFilter !== 'all' && r.rating !== Number(starFilter)) return false;
              if (statusFilter === 'unreplied' && r.replied) return false;
              if (statusFilter === 'replied' && !r.replied) return false;
              return true;
          })
        : [];

    const handleSendReply = (reviewId) => {
        const text = replyInputs[reviewId]?.trim();
        if (!text) return;

        setReviewsList((prev) =>
            prev.map((r) => (r.id === reviewId ? { ...r, replied: true, replyText: text } : r))
        );
        setReplySuccess((prev) => ({ ...prev, [reviewId]: true }));
    };

    const totalAllReviews = reviewsList.length;
    const totalAllUnreplied = reviewsList.filter((r) => !r.replied).length;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title={selectedVenue ? `Đánh giá · ${selectedVenue.name}` : 'Quản lý Đánh giá Cơ sở & Sân'}
                description={
                    selectedVenue
                        ? `${selectedVenue.address}, ${selectedVenue.district} · Nhấp vào nút quay lại để xem địa điểm khác`
                        : 'Chọn địa điểm cơ sở sân thể thao bên dưới để xem chi tiết đánh giá và gửi phản hồi cho khách'
                }
            >
                {selectedVenue && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSelectedVenueId(null);
                            setStarFilter('all');
                            setStatusFilter('all');
                        }}
                        className="gap-1.5 bg-card"
                    >
                        <ArrowLeft className="size-4" /> Danh sách địa điểm sân
                    </Button>
                )}
            </PageHeader>

            {/* GIAO DIỆN 1: KHI CHƯA CHỌN SÂN (HIỂN THỊ DANH SÁCH CÁC ĐỊA ĐIỂM SÂN) */}
            {!selectedVenue && (
                <div className="flex flex-col gap-5">
                    {/* Thống kê tổng quan nhanh */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Card className="bg-card/70">
                            <CardContent className="flex items-center gap-4 py-4">
                                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <MapPin className="size-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Tổng địa điểm sân</p>
                                    <p className="font-mono text-2xl font-bold">{venues.length}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/70">
                            <CardContent className="flex items-center gap-4 py-4">
                                <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                                    <MessageSquare className="size-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Tổng lượt đánh giá</p>
                                    <p className="font-mono text-2xl font-bold">{totalAllReviews}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className={cn('bg-card/70', totalAllUnreplied > 0 && 'border-warning/50')}>
                            <CardContent className="flex items-center gap-4 py-4">
                                <div className="flex size-11 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground">
                                    <MessageSquareReply className="size-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Đang chờ phản hồi</p>
                                    <p className="font-mono text-2xl font-bold text-warning-foreground">
                                        {totalAllUnreplied}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bộ lọc tìm kiếm địa điểm sân */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 sm:max-w-md">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Tìm cơ sở theo tên, địa chỉ hoặc quận..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-card pl-9"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-muted-foreground">Môn:</span>
                            <div className="flex flex-wrap gap-1">
                                <Button
                                    size="xs"
                                    variant={selectedSport === 'all' ? 'default' : 'outline'}
                                    onClick={() => setSelectedSport('all')}
                                >
                                    Tất cả
                                </Button>
                                {sports.map((s) => (
                                    <Button
                                        key={s.id}
                                        size="xs"
                                        variant={selectedSport === s.code ? 'default' : 'outline'}
                                        onClick={() => setSelectedSport(s.code)}
                                    >
                                        {s.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Danh sách thẻ địa điểm sân */}
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filteredVenues.map((v) => {
                            const stats = getVenueStats(v.id);
                            const venueCourts = courts.filter((c) => c.venueId === v.id);
                            const sportNames = Array.from(
                                new Set(venueCourts.map((c) => sports.find((s) => s.id === c.sportId)?.name).filter(Boolean))
                            );

                            return (
                                <Card
                                    key={v.id}
                                    onClick={() => setSelectedVenueId(v.id)}
                                    className="group cursor-pointer overflow-hidden border transition-all duration-200 hover:border-primary/50 hover:shadow-md"
                                >
                                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                                        <img
                                            src={v.image}
                                            alt={v.name}
                                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold shadow backdrop-blur">
                                            <Star className="size-3.5 fill-warning text-warning" />
                                            <span>{stats.avg > 0 ? stats.avg.toFixed(1) : v.rating.toFixed(1)}</span>
                                        </div>
                                        {stats.unreplied > 0 && (
                                            <div className="absolute left-3 top-3 rounded-full bg-warning px-2.5 py-1 text-xs font-bold text-warning-foreground shadow">
                                                {stats.unreplied} chưa phản hồi
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="flex flex-col gap-3 p-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="font-bold leading-tight group-hover:text-primary">
                                                    {v.name}
                                                </h3>
                                                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                                            </div>
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MapPin className="size-3.5 shrink-0" /> {v.address}, {v.district}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-1">
                                            {sportNames.map((sn) => (
                                                <span
                                                    key={sn}
                                                    className="rounded bg-accent px-1.5 py-0.5 text-[11px] font-medium text-accent-foreground"
                                                >
                                                    {sn}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between border-t pt-3 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <MessageSquare className="size-3.5 text-muted-foreground" />
                                                <span className="font-mono font-semibold">
                                                    {stats.count}
                                                </span>{' '}
                                                đánh giá
                                            </div>
                                            <span className="font-medium text-primary group-hover:underline">
                                                Xem đánh giá →
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {filteredVenues.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center text-muted-foreground">
                            <MapPin className="size-10 opacity-30" />
                            <p className="mt-3 text-sm font-medium">Không tìm thấy địa điểm sân phù hợp</p>
                            <p className="text-xs">Hãy thử từ khóa tìm kiếm hoặc môn thể thao khác.</p>
                        </div>
                    )}
                </div>
            )}

            {/* GIAO DIỆN 2: KHI ĐÃ CHỌN SÂN (XEM ĐÁNH GIÁ CỦA RIÊNG SÂN ĐÓ) */}
            {selectedVenue && (() => {
                const stats = getVenueStats(selectedVenue.id);
                const venueReviewsAll = stats.reviews;
                const venueAvg = stats.avg;
                const venueDist = [5, 4, 3, 2, 1].map((star) => ({
                    star,
                    count: venueReviewsAll.filter((r) => r.rating === star).length,
                }));

                return (
                    <div className="flex flex-col gap-6">
                        {/* Thanh thông tin sân hiện tại */}
                        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedVenue.image}
                                    alt={selectedVenue.name}
                                    className="size-16 rounded-lg object-cover"
                                />
                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-lg font-bold">{selectedVenue.name}</h2>
                                        <Badge variant="outline" className="text-xs">
                                            {selectedVenue.courtCount} sân
                                        </Badge>
                                    </div>
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <MapPin className="size-3.5" /> {selectedVenue.address}, {selectedVenue.district}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedVenueId(null)}
                                    className="gap-1.5"
                                >
                                    <ArrowLeft className="size-4" /> Đổi sân khác
                                </Button>
                            </div>
                        </div>

                        {/* Bố cục 2 cột: Thống kê sao & Danh sách nhận xét */}
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Cột trái: Thống kê phân bổ sao & Bộ lọc */}
                            <div className="flex flex-col gap-4">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">Tổng quan đánh giá</CardTitle>
                                        <CardDescription>
                                            {venueReviewsAll.length} đánh giá · {stats.unreplied} chưa phản hồi
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        <div className="flex items-end gap-3">
                                            <span className="font-mono text-4xl font-bold leading-none">
                                                {venueAvg > 0 ? venueAvg.toFixed(1) : selectedVenue.rating.toFixed(1)}
                                            </span>
                                            <div className="flex flex-col gap-1 pb-1">
                                                <Stars value={venueAvg > 0 ? venueAvg : selectedVenue.rating} />
                                                <span className="text-xs text-muted-foreground">trên 5 sao</span>
                                            </div>
                                        </div>

                                        <ul className="flex flex-col gap-2 border-t pt-3">
                                            {venueDist.map((d) => (
                                                <li key={d.star} className="flex items-center gap-2 text-xs">
                                                    <span className="w-6 font-mono">{d.star}★</span>
                                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                                        <div
                                                            className="h-full rounded-full bg-warning"
                                                            style={{
                                                                width: `${
                                                                    venueReviewsAll.length > 0
                                                                        ? (d.count / venueReviewsAll.length) * 100
                                                                        : 0
                                                                }%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="w-4 text-right font-mono text-muted-foreground">
                                                        {d.count}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                {/* Bộ lọc đánh giá */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                            <Filter className="size-4" /> Lọc đánh giá
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Số sao:</label>
                                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                                {['all', '5', '4', '3', '2', '1'].map((st) => (
                                                    <Button
                                                        key={st}
                                                        size="xs"
                                                        variant={starFilter === st ? 'default' : 'outline'}
                                                        onClick={() => setStarFilter(st)}
                                                    >
                                                        {st === 'all' ? 'Tất cả sao' : `${st}★`}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t pt-3">
                                            <label className="text-xs font-medium text-muted-foreground">Trạng thái:</label>
                                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                                <Button
                                                    size="xs"
                                                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                                                    onClick={() => setStatusFilter('all')}
                                                >
                                                    Tất cả ({venueReviewsAll.length})
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant={statusFilter === 'unreplied' ? 'default' : 'outline'}
                                                    onClick={() => setStatusFilter('unreplied')}
                                                >
                                                    Chưa phản hồi ({stats.unreplied})
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant={statusFilter === 'replied' ? 'default' : 'outline'}
                                                    onClick={() => setStatusFilter('replied')}
                                                >
                                                    Đã phản hồi ({venueReviewsAll.length - stats.unreplied})
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Cột phải: Danh sách đánh giá của sân */}
                            <div className="flex flex-col gap-4 lg:col-span-2">
                                {currentVenueReviews.length === 0 && (
                                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center text-muted-foreground">
                                        <MessageSquare className="size-10 opacity-30" />
                                        <p className="mt-3 text-sm font-medium">Chưa có đánh giá nào</p>
                                        <p className="text-xs">
                                            {venueReviewsAll.length === 0
                                                ? 'Sân này hiện tại chưa nhận được phản hồi đánh giá nào từ khách hàng.'
                                                : 'Không có đánh giá nào phù hợp với bộ lọc hiện tại.'}
                                        </p>
                                    </div>
                                )}

                                {currentVenueReviews.map((r) => {
                                    const u = findUser(r.userId);
                                    const c = findCourt(r.courtId);
                                    const isSuccess = replySuccess[r.id];

                                    return (
                                        <Card key={r.id} className={cn(!r.replied && 'border-warning/50')}>
                                            <CardContent className="flex flex-col gap-3.5 p-4">
                                                <div className="flex items-start gap-3">
                                                    <Avatar className="size-10">
                                                        <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                                                            {initials(u?.fullName ?? '')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-1 flex-col gap-1">
                                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                            <span className="font-semibold text-foreground">
                                                                {u?.fullName}
                                                            </span>
                                                            <Stars value={r.rating} />
                                                            <span className="text-xs text-muted-foreground">
                                                                {r.createdAt.split('-').reverse().join('/')}
                                                            </span>
                                                            {!r.replied ? (
                                                                <span className="ml-auto rounded bg-warning/20 px-2 py-0.5 text-[11px] font-semibold text-warning-foreground">
                                                                    Chưa phản hồi
                                                                </span>
                                                            ) : (
                                                                <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-success">
                                                                    <CheckCircle2 className="size-3.5" /> Đã phản hồi
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                                                            {c?.name} · {selectedVenue.name}
                                                        </span>
                                                        <p className="mt-1 text-sm text-pretty leading-relaxed">
                                                            {r.comment}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Phản hồi của chủ sân */}
                                                {r.replied ? (
                                                    <div className="ml-13 flex gap-2 rounded-lg bg-muted/60 p-3 text-sm">
                                                        <MessageSquareReply className="mt-0.5 size-4 shrink-0 text-primary" />
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-xs font-semibold text-foreground">
                                                                Phản hồi của ban quản lý sân
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {r.replyText ||
                                                                    'Cảm ơn bạn đã ghé sân và để lại đánh giá quý giá, chúc bạn có những trải nghiệm thể thao tuyệt vời!'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="ml-13 flex flex-col gap-2 border-t pt-2.5">
                                                        <Textarea
                                                            placeholder="Viết phản hồi gửi tới khách hàng..."
                                                            value={replyInputs[r.id] || ''}
                                                            onChange={(e) =>
                                                                setReplyInputs((prev) => ({
                                                                    ...prev,
                                                                    [r.id]: e.target.value,
                                                                }))
                                                            }
                                                            className="min-h-16 bg-background text-sm"
                                                            aria-label={`Phản hồi đánh giá của ${u?.fullName}`}
                                                        />
                                                        <div className="flex items-center justify-between">
                                                            {isSuccess && (
                                                                <span className="flex items-center gap-1 text-xs text-success">
                                                                    <CheckCircle2 className="size-3.5" /> Gửi phản hồi thành công!
                                                                </span>
                                                            )}
                                                            <div className="ml-auto">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleSendReply(r.id)}
                                                                >
                                                                    Gửi phản hồi
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
