import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Search, MapPin, Star, Clock, Filter, ChevronRight, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { venues, courts, sports, cities, districts } from '@/services/mock-data';
import { cn } from '@/services/utils';

export default function UserVenuesPage() {
  const [searchParams] = useSearchParams();
  const initialSport = searchParams.get('sport') || 'all';

  const [search, setSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState(initialSport);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('venue'); // 'venue' (Trang 06) | 'court' (Trang 08)

  // Filter venues
  const filteredVenues = venues.filter((v) => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.address.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedCity !== 'all' && !v.city.includes(selectedCity)) return false;
    if (selectedDistrict !== 'all' && !v.district.includes(selectedDistrict)) return false;
    if (selectedSport !== 'all') {
      const venueCourts = courts.filter((c) => c.venueId === v.id);
      const hasSport = venueCourts.some((c) => {
        const s = sports.find((sp) => sp.id === c.sportId);
        return s?.code === selectedSport;
      });
      if (!hasSport) return false;
    }
    return true;
  });

  // Filter courts (Trang 08)
  const filteredCourts = courts.filter((c) => {
    const venue = venues.find((v) => v.id === c.venueId);
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !venue?.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedSport !== 'all') {
      const s = sports.find((sp) => sp.id === c.sportId);
      if (s?.code !== selectedSport) return false;
    }
    return true;
  });

  const resetFilters = () => {
    setSearch('');
    setSelectedSport('all');
    setSelectedCity('all');
    setSelectedDistrict('all');
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block">
              KHÁM PHÁ CÁC CƠ SỞ THỂ THAO
            </span>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {viewMode === 'venue' ? 'Tìm nơi cho trận đấu tiếp theo.' : 'Sân phù hợp với bạn.'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Danh sách cơ sở / Danh sách sân */}
            <div className="flex rounded-xl bg-muted p-1 border border-border">
              <button
                onClick={() => setViewMode('venue')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  viewMode === 'venue' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                )}
              >
                Cơ sở (Trang 06)
              </button>
              <button
                onClick={() => setViewMode('court')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                  viewMode === 'court' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                )}
              >
                Danh sách sân (Trang 08)
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-64">
              <Input
                placeholder={viewMode === 'venue' ? 'Tên cơ sở hoặc địa chỉ' : 'Tên sân hoặc tên cơ sở'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-card text-xs pr-8"
              />
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
            <Button size="sm" className="font-bold">Tìm kiếm</Button>
          </div>
        </div>

        {/* Main Grid: Filter Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filter (Exact Mockup) */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-2xl border-border shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Filter className="size-4 text-primary" /> Bộ lọc
                  </h3>
                  <button onClick={resetFilters} className="text-[11px] text-primary hover:underline flex items-center gap-1">
                    <RotateCcw className="size-3" /> Xóa bộ lọc
                  </button>
                </div>

                {/* 1. Thành phố */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Thành phố</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="bg-background text-xs">
                      <SelectValue placeholder="Tất cả thành phố" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả thành phố</SelectItem>
                      {cities.map((c) => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Quận / huyện */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Quận / huyện</label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="bg-background text-xs">
                      <SelectValue placeholder="Tất cả quận / huyện" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả quận / huyện</SelectItem>
                      {districts.map((d) => (
                        <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. Môn thể thao (Checkboxes) */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Môn thể thao</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="sportFilter"
                        checked={selectedSport === 'all'}
                        onChange={() => setSelectedSport('all')}
                        className="accent-primary"
                      />
                      Tất cả môn
                    </label>
                    {sports.map((s) => (
                      <label key={s.id} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="sportFilter"
                          checked={selectedSport === s.code}
                          onChange={() => setSelectedSport(s.code)}
                          className="accent-primary"
                        />
                        {s.name}
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-bold text-foreground">
                {viewMode === 'venue' ? `${filteredVenues.length} cơ sở phù hợp` : `${filteredCourts.length} sân phù hợp`}
              </span>
              <div className="flex items-center gap-2">
                <span>Sắp xếp:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36 bg-card text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Tên A - Z</SelectItem>
                    <SelectItem value="rating">Đánh giá cao</SelectItem>
                    <SelectItem value="price">Giá tăng dần</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* VIEW MODE: DANH SÁCH CƠ SỞ (Trang 06) */}
            {viewMode === 'venue' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredVenues.map((venue) => (
                  <Card key={venue.id} className="group overflow-hidden rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow">
                    <Link to={`/venues/${venue.id}`} className="relative block aspect-[16/10] overflow-hidden">
                      <img src={venue.image} alt={venue.name} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur rounded-lg px-2.5 py-1 text-[10px] font-bold text-white">
                        PLAY MOVE BELONG
                      </div>
                    </Link>
                    <CardContent className="p-4 space-y-2">
                      <Link to={`/venues/${venue.id}`} className="font-bold text-base hover:text-primary transition-colors block">
                        {venue.name}
                      </Link>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3.5 shrink-0 text-primary" /> {venue.district}
                      </p>
                      <Link to={`/venues/${venue.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-2">
                        Xem cơ sở →
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* VIEW MODE: DANH SÁCH SÂN (Trang 08) */}
            {viewMode === 'court' && (
              <div className="space-y-4">
                {filteredCourts.map((court) => {
                  const venue = venues.find((v) => v.id === court.venueId);
                  return (
                    <Card key={court.id} className="rounded-2xl border-border shadow-sm overflow-hidden">
                      <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <img src={court.image} alt={court.name} className="size-20 rounded-xl object-cover shrink-0" />
                          <div className="space-y-1">
                            <h3 className="font-bold text-base text-foreground">{court.name}</h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="size-3.5 text-primary shrink-0" /> {venue?.name} - {venue?.district}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-amber-500 font-bold">
                              ★ 4.8 <span className="text-muted-foreground font-normal">(120 đánh giá)</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                          <span className="text-xs text-muted-foreground">Từ <strong className="text-primary font-mono text-base block sm:inline">80.000đ/giờ</strong></span>
                          <Button asChild size="sm" className="font-bold px-5">
                            <Link to={`/court-booking/${court.id}`}>Xem sân</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls (< 1 2 3 >) */}
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button size="sm" variant="outline" className="size-8 p-0" disabled>&lt;</Button>
              <Button size="sm" className="size-8 p-0 font-bold">1</Button>
              <Button size="sm" variant="outline" className="size-8 p-0">2</Button>
              <Button size="sm" variant="outline" className="size-8 p-0">3</Button>
              <Button size="sm" variant="outline" className="size-8 p-0">&gt;</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}