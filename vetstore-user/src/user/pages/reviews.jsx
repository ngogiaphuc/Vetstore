import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { reviews } from '@/services/mock-data';

export default function UserReviewPage() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('Sân sạch, mặt cỏ tốt và nhân viên nhiệt tình.');
  const [reviewsList, setReviewsList] = useState(reviews);

  const handleSendReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const newRev = {
      id: Date.now(),
      userId: 1,
      userName: 'Minh Huy',
      bookingId: 'SH12092603',
      venueId: 2,
      courtName: 'Sân bóng đá An Phú',
      rating,
      date: '12/09/2026',
      comment,
    };
    setReviewsList([newRev, ...reviewsList]);
    alert('Cảm ơn bạn đã gửi đánh giá!');
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block">
            15. ĐÁNH GIÁ SÂN
          </span>
          <h1 className="text-2xl font-black text-foreground">Trải nghiệm của bạn có ý nghĩa</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Chia sẻ cảm nhận để giúp cộng đồng người chơi và nâng cao chất lượng dịch vụ.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Viết đánh giá (Matching Mockup 15) */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="rounded-2xl border-border shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-base text-foreground">Đánh giá đơn đặt sân</h3>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted">
                  <img src="/images/venue-football.png" alt="Sân bóng đá An Phú" className="size-16 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Sân bóng đá An Phú</h4>
                    <p className="text-xs text-muted-foreground">Sân bóng đá An Phú</p>
                    <span className="inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 mt-1">
                      ✓ Hoàn tất
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground font-mono">
                  <p>📅 Thời gian sử dụng: 12/09/2026 (Thứ bảy)</p>
                  <p>🕒 Khung giờ: 17:00 - 18:00</p>
                </div>

                {/* Rating Stars Input */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <label className="text-xs font-bold text-foreground block">Đánh giá của bạn</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-125"
                      >
                        <Star className={cn('size-7', star <= rating ? 'fill-warning text-warning' : 'text-muted/60')} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground block">Chia sẻ trải nghiệm của bạn</label>
                  <Textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-background text-xs"
                    placeholder="Sân sạch, mặt cỏ tốt..."
                  />
                  <p className="text-[10px] text-muted-foreground text-right font-mono">{comment.length}/500</p>
                </div>

                <Button onClick={handleSendReview} className="w-full font-bold size-10 text-sm shadow-md">
                  Gửi đánh giá
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">
                  ℹ️ Một đánh giá cho mỗi lượt đặt sân đã hoàn tất.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Section: Đánh giá từ người chơi (Matching Mockup 15) */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="rounded-2xl border-border shadow-sm">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-bold text-base text-foreground">Đánh giá từ người chơi</h3>

                <div className="flex items-center gap-6 p-4 rounded-xl bg-muted">
                  <div className="text-center">
                    <span className="text-4xl font-black text-foreground block">4.8</span>
                    <div className="flex justify-center gap-0.5 my-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="size-3.5 fill-warning text-warning" />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground block font-mono">(124 đánh giá)</span>
                  </div>

                  {/* Rating Breakdown Progress */}
                  <div className="flex-1 space-y-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-3">5★</span>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-warning w-[72%]" />
                      </div>
                      <span className="w-8 text-right font-mono text-muted-foreground">72%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3">4★</span>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-warning w-[20%]" />
                      </div>
                      <span className="w-8 text-right font-mono text-muted-foreground">20%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3">3★</span>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-warning w-[6%]" />
                      </div>
                      <span className="w-8 text-right font-mono text-muted-foreground">6%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3">2★</span>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-warning w-[1%]" />
                      </div>
                      <span className="w-8 text-right font-mono text-muted-foreground">1%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3">1★</span>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-warning w-[1%]" />
                      </div>
                      <span className="w-8 text-right font-mono text-muted-foreground">1%</span>
                    </div>
                  </div>
                </div>

                {/* List of User Reviews */}
                <div className="space-y-4 pt-2">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-border/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary">
                            {rev.userName.charAt(0)}
                          </div>
                          <span className="font-bold text-xs">{rev.userName}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">{rev.date}</span>
                      </div>

                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={cn('size-3', s <= rev.rating ? 'fill-warning text-warning' : 'text-muted')} />
                        ))}
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}