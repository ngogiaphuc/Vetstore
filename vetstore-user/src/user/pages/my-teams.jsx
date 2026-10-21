import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Trophy, Shield, Trash2, Edit, ChevronRight, UserPlus, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { teams as initialTeams, teamMembers as initialMembers, sports, tournaments } from '@/services/mock-data';
import { cn } from '@/services/utils';

export default function UserMyTeamsPage() {
  const [view, setView] = useState('list'); // 'list' (Trang 17) | 'create' (Trang 18) | 'detail' (Trang 19) | 'edit' (Trang 20)
  const [selectedTeam, setSelectedTeam] = useState(initialTeams[0]);
  const [teamList, setTeamList] = useState(initialTeams);
  const [membersList, setMembersList] = useState(initialMembers);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  // Form states
  const [name, setName] = useState('Saigon Smash');
  const [sportId, setSportId] = useState('2');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('Cùng luyện tập và tham gia các giải cầu lông phong trào.');

  const handleCreateTeam = (e) => {
    e.preventDefault();
    const newT = {
      id: Date.now(),
      name,
      shortName: name.slice(0, 2).toUpperCase(),
      sportId: Number(sportId),
      sportName: sports.find((s) => s.id === Number(sportId))?.name || 'Cầu lông',
      captainId: 1,
      captainName: 'Minh Huy',
      memberCount: 1,
      expectedMembers: 4,
      role: 'Bạn là đội trưởng',
      isCaptain: true,
      logo,
      description,
      wins: 0,
      losses: 0,
    };
    setTeamList([...teamList, newT]);
    setSelectedTeam(newT);
    setView('detail');
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberEmail) return;
    const newM = {
      id: Date.now(),
      teamId: selectedTeam.id,
      userId: Date.now(),
      fullName: newMemberEmail.split('@')[0],
      email: newMemberEmail,
      role: 'Thành viên',
      isCaptain: false,
      joinedAt: '15/09/2026',
      position: 'Chưa phân công',
    };
    setMembersList([...membersList, newM]);
    setNewMemberEmail('');
    alert('Đã thêm thành viên mới thành công!');
  };

  const handleDeleteMember = (id) => {
    setMembersList(membersList.filter((m) => m.id !== id));
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Title (Trang 17) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block">
              ĐỘI CỦA TÔI
            </span>
            <h1 className="text-2xl font-black text-foreground sm:text-3xl">Cùng đồng đội, tiến xa hơn.</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Quản lý các đội thể thao của bạn, kết nối đồng đội và cùng nhau chinh phục những giải đấu hấp dẫn.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {view !== 'list' && (
              <Button variant="outline" size="sm" onClick={() => setView('list')} className="font-bold text-xs">
                ← Danh sách đội
              </Button>
            )}
            {view === 'list' && (
              <Button onClick={() => { setName(''); setView('create'); }} className="font-bold text-xs gap-1.5 shadow-md">
                <Plus className="size-4" /> Tạo đội mới
              </Button>
            )}
          </div>
        </div>

        {/* TRANG 17: DANH SÁCH ĐỘI CỦA TÔI */}
        {view === 'list' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-muted-foreground">Môn thể thao:</span>
              <Select defaultValue="all">
                <SelectTrigger className="w-44 bg-card text-xs">
                  <SelectValue placeholder="Tất cả môn thể thao" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả môn thể thao</SelectItem>
                  {sports.map((s) => (
                    <SelectItem key={s.id} value={s.code}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamList.map((team) => (
                <Card key={team.id} className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-4 text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 font-black text-xl text-primary mx-auto">
                      {team.shortName}
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-foreground">{team.name}</h3>
                      <span className="text-xs text-muted-foreground block">{team.sportName}</span>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center justify-center gap-1">
                        <Users className="size-3.5" /> {team.memberCount} thành viên
                      </p>
                      <span className="inline-block rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-600">
                        👑 {team.role}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full font-bold text-xs"
                      onClick={() => { setSelectedTeam(team); setName(team.name); setView('detail'); }}
                    >
                      Xem đội →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty Team Prompt */}
            {teamList.length === 0 && (
              <Card className="rounded-2xl border-dashed border-2 border-border p-8 text-center space-y-4">
                <div className="size-14 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <Users className="size-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Chưa có đội?</h3>
                  <p className="text-xs text-muted-foreground">Tạo đội đầu tiên của bạn. Tập hợp đồng đội, tạo đội và cùng nhau trải nghiệm những trận đấu tuyệt vời.</p>
                </div>
                <Button onClick={() => setView('create')} className="font-bold text-xs gap-1.5">
                  <Plus className="size-4" /> Tạo đội mới
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* TRANG 18: TẠO ĐỘI MỚI (Matching Mockup 18) */}
        {view === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  18. ĐỘI CỦA TÔI &gt; TẠO ĐỘI MỚI
                </span>
                <h2 className="text-2xl font-black text-foreground">Tạo đội mới</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Tạo đội, mời đồng đội và cùng nhau chinh phục những giải đấu hấp dẫn.</p>
              </div>

              <Card className="rounded-2xl border-border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <form onSubmit={handleCreateTeam} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Tên đội *</Label>
                      <Input
                        placeholder="Saigon Smash"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-background text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Môn thể thao *</Label>
                      <Select value={sportId} onValueChange={setSportId}>
                        <SelectTrigger className="bg-background text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sports.map((s) => (
                            <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Logo đội (tùy chọn)</Label>
                      <Input
                        placeholder="https://"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                        className="bg-background text-sm"
                      />
                      <p className="text-[10px] text-muted-foreground">Nhập đường dẫn URL đến logo của đội (ảnh .jpg, .png). Để trống nếu không có.</p>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Mô tả *</Label>
                      <Textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-background text-xs"
                      />
                      <p className="text-[10px] text-muted-foreground text-right font-mono">{description.length}/500</p>
                    </div>

                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      ℹ️ Người tạo đội sẽ là đội trưởng.
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                      <Button type="submit" className="font-bold px-6">Tạo đội</Button>
                      <Button type="button" variant="outline" className="px-6" onClick={() => setView('list')}>Hủy</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Preview (Matching Mockup 18) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-muted-foreground uppercase block">Xem trước đội của bạn</span>
              <Card className="rounded-2xl border-border shadow-sm p-6 text-center space-y-4">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 font-black text-2xl text-primary mx-auto">
                  {name ? name.slice(0, 2).toUpperCase() : 'SS'}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{name || 'Saigon Smash'}</h3>
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary mt-1">
                    {sports.find((s) => s.id === Number(sportId))?.name || 'Cầu lông'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description || 'Cùng luyện tập và tham gia các giải cầu lông phong trào.'}
                </p>
                <div className="space-y-1 text-xs text-muted-foreground border-t border-border pt-3">
                  <p>👥 4 thành viên (dự kiến)</p>
                  <p className="text-amber-600 font-semibold">👑 Bạn sẽ là đội trưởng</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TRANG 19: CHI TIẾT ĐỘI & THÊM THÀNH VIÊN (Matching Mockup 19) */}
        {view === 'detail' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 font-black text-2xl text-primary shrink-0">
                  {selectedTeam.shortName}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-foreground">{selectedTeam.name}</h2>
                  <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary mt-0.5">
                    {selectedTeam.sportName}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{selectedTeam.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="font-bold text-xs gap-1.5" onClick={() => setView('edit')}>
                  <Edit className="size-3.5" /> Chỉnh sửa đội
                </Button>
                <Button size="sm" className="font-bold text-xs gap-1.5 shadow-md" asChild>
                  <Link to="/tournaments">🏆 Đăng ký giải</Link>
                </Button>
              </div>
            </div>

            {/* Grid Thành viên & Thêm thành viên Form (Matching Mockup 19) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Member List Table */}
              <div className="lg:col-span-8 space-y-4">
                <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-bold text-sm text-foreground">Thành viên ({membersList.length})</h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-muted text-muted-foreground uppercase font-bold text-[10px] border-b border-border">
                          <tr>
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Thành viên</th>
                            <th className="py-2.5 px-3">Vai trò</th>
                            <th className="py-2.5 px-3">Tham gia</th>
                            <th className="py-2.5 px-3 text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {membersList.map((m, index) => (
                            <tr key={m.id}>
                              <td className="py-3 px-3 font-semibold">{index + 1}</td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary">
                                    {m.fullName.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-bold text-foreground">{m.fullName}</p>
                                    <p className="text-[10px] text-muted-foreground">{m.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                {m.isCaptain ? (
                                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-600">
                                    👑 Đội trưởng
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground font-medium">Thành viên</span>
                                )}
                              </td>
                              <td className="py-3 px-3 font-mono text-muted-foreground">{m.joinedAt}</td>
                              <td className="py-3 px-3 text-right">
                                {!m.isCaptain && (
                                  <button
                                    onClick={() => handleDeleteMember(m.id)}
                                    className="text-xs text-destructive hover:underline font-medium cursor-pointer"
                                  >
                                    Xóa
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Add Member Form (Matching Mockup 19) */}
              <div className="lg:col-span-4 space-y-4">
                <Card className="rounded-2xl border-border shadow-sm">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-bold text-sm text-foreground">Thêm thành viên</h3>

                    <form onSubmit={handleAddMember} className="space-y-3">
                      <div className="space-y-1.5">
                        <Input
                          placeholder="Tìm tài khoản theo tên hoặc email"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          className="bg-background text-xs"
                          required
                        />
                      </div>

                      {/* Mock result popup (Matching Mockup 19) */}
                      {newMemberEmail && (
                        <div className="p-3 rounded-xl bg-muted flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex size-7 items-center justify-center rounded-full bg-primary text-white font-bold text-xs">
                              L
                            </div>
                            <div className="text-xs">
                              <p className="font-bold">Linh</p>
                              <p className="text-[10px] text-muted-foreground">linh.pham@gmail.com</p>
                            </div>
                          </div>
                          <Check className="size-4 text-primary" />
                        </div>
                      )}

                      <Button type="submit" className="w-full font-bold size-9 text-xs shadow-md">
                        Thêm vào đội
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* TRANG 20: CHỈNH SỬA ĐỘI (Matching Mockup 20) */}
        {view === 'edit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  20. ĐỘI CỦA TÔI &gt; SAIGON SMASH &gt; CHỈNH SỬA
                </span>
                <h2 className="text-2xl font-black text-foreground">Chỉnh sửa đội</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Cập nhật thông tin đội của bạn.</p>
              </div>

              <Card className="rounded-2xl border-border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <form onSubmit={(e) => { e.preventDefault(); alert('Cập nhật đội thành công!'); setView('detail'); }} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Tên đội *</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-background text-sm" required />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Môn thể thao</Label>
                      <Input value="Cầu lông" disabled className="bg-muted text-sm" />
                      <p className="text-[10px] text-muted-foreground">Giữ nguyên môn khi đội đã đăng ký giải.</p>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Logo đội (tùy chọn)</Label>
                      <Input placeholder="https://" value={logo} onChange={(e) => setLogo(e.target.value)} className="bg-background text-sm" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Mô tả *</Label>
                      <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="bg-background text-xs" />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Button type="submit" className="font-bold px-6">Lưu thay đổi</Button>
                      <Button type="button" variant="outline" className="px-6" onClick={() => setView('detail')}>Hủy</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right: Giải đã đăng ký (Matching Mockup 20) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase">Giải đã đăng ký</span>
                <Link to="/tournaments" className="text-xs font-bold text-primary hover:underline">Xem tất cả</Link>
              </div>

              <Card className="rounded-2xl border-border shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0 font-bold">
                    🏆
                  </div>
                  <div className="text-xs">
                    <h4 className="font-bold text-foreground">SportHub Badminton Open 2026</h4>
                    <span className="inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 mt-1">
                      Đã duyệt
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-1">📅 27/09/2026 • 🏸 Cầu lông</p>
                  </div>
                </div>

                <Link to="/tournaments/1" className="text-xs font-bold text-primary hover:underline">
                  Xem giải →
                </Link>
              </Card>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}