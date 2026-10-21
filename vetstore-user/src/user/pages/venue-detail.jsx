import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Phone, ChevronRight, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { venues, courts, sports, facilities } from '@/services/mock-data';

export default function UserVenueDetailPage() {
  const { id } = useParams();
  const venue = venues.find((v) => v.id === Number(id)) || venues[0];
  const venueCourts = courts.filter((c) => c.venueId === venue.id);

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Breadcrumb (Trang 07) */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Khám phá</Link>
          <ChevronRight className="size-3" />
          <Link to="/venues" className="hover:text-foreground">Danh sách cơ sở</Link>
          <ChevronRight className="size-3" />
          <span className="font-semibold text-foreground">{venue.name}</span>
        </div>

        {/* Venue Title & Info */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-foreground">{venue.name}</h1>
          <p className="text-xs text-muted-foreground">{venue.description}</p>
        </div>

        {/* Hero Gallery Grid (Exact Mockup Trang 07) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 aspect-[16/10] rounded-2xl overflow-hidden border border-border shadow-md relative">
            <img src={venue.image} alt={venue.name} className="size-full object-cover" />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur rounded-lg px-3 py-1 text-xs font-bold text-white">
              PLAY MOVE BELONG
            </div>
          </div>

          <div className="md:col-span-4 space-y-4 flex flex-col justify-center">
            <Card className="rounded-2xl border-border shadow-sm">
              <CardContent className="p-6 space-y-4 text-xs">
                <div className="space-y-2">
                  <span className="font-bold text-muted-foreground uppercase block">Địa chỉ</span>
                  <p className="font-semibold text-foreground flex items-start gap-2">
                    <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                    {venue.address}
                  </p>
                </div>

                <div className="space-y-2 border-t border-border/60 pt-3">
                  <span className="font-bold text-muted-foreground uppercase block">Giờ mở cửa</span>
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    <Clock className="size-4 text-primary shrink-0" />
                    {venue.openTime} – {venue.closeTime} (Hằng ngày)
                  </p>
                </div>

                <div className="space-y-2 border-t border-border/60 pt-3">
                  <span className="font-bold text-muted-foreground uppercase block">Điện thoại</span>
                  <p className="font-semibold text-foreground flex items-center gap-2 font-mono">
                    <Phone className="size-4 text-primary shrink-0" />
                    {venue.phone}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card/60 backdrop-blur shadow-sm">
              <CardContent className="p-4 text-xs space-y-2">
                <span className="font-bold text-muted-foreground uppercase block">Tiện ích cơ sở</span>
                <div className="flex flex-wrap gap-1.5">
                  {venue.facilityIds.map((fid) => {
                    const fac = facilities.find((f) => f.id === fid);
                    return (
                      <span key={fid} className="rounded-lg bg-accent px-2.5 py-1 font-semibold text-accent-foreground">
                        ✓ {fac?.name}
                      </span>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section: Các sân tại cơ sở (Trang 07) */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Các sân tại cơ sở</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {venueCourts.map((court) => {
              const sport = sports.find((s) => s.id === court.sportId);
              return (
                <Card key={court.id} className="rounded-2xl border-border shadow-sm overflow-hidden group">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={court.image} alt={court.name} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-base text-foreground">{court.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>🏸 {sport?.name}</span>
                        <span>• {court.indoor ? 'Trong nhà' : 'Ngoài trời'}</span>
                        <span>• {court.capacity}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      <span className="text-xs text-muted-foreground">Từ <strong className="text-primary font-mono text-sm">80.000đ/giờ</strong></span>
                      <Button asChild size="sm" className="font-bold px-4">
                        <Link to={`/court-booking/${court.id}`}>Xem lịch trống</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}