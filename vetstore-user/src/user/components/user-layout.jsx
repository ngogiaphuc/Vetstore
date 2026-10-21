import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Search, Bell, User, Menu, X, Moon, Sun, ChevronDown, Send,
  LogOut, Shield, KeyRound, CalendarDays, Users, Maximize2, PawPrint, Bot, Sparkles, Loader2
} from 'lucide-react';
import { cn } from '@/services/utils';
import { jwtDecode } from "jwt-decode";
import axiosClient from '@/config/axiosClient';

const navLinks = [
  { title: 'Trang chủ', href: '/' },
  { title: 'Dịch vụ thú y', href: '/services' },
  { title: 'Đặt lịch khám', href: '/booking' },
  { title: 'Hồ sơ thú cưng', href: '/my-pets' },
  { title: 'Lịch hẹn của tôi', href: '/my-bookings' },
  { title: 'Tư vấn AI Vet', href: '/chat-support' },
];

function activePath(pathname, href) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function UserLayout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [chatWidgetOpen, setChatWidgetOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [widgetLoading, setWidgetLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const [widgetMessages, setWidgetMessages] = useState([
    { id: 1, sender: 'bot', text: 'Chào bạn! Tôi là Bác sĩ Thú y AI tại VetCare 🐾. Bạn có câu hỏi nào về sức khỏe bé cưng không?', time: '12:00' },
  ]);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark'
      );
    }
    return false;
  });

  const token = localStorage.getItem("accessToken");
  const isAuthenticated = Boolean(token && token !== "undefined" && token !== "null");
  let username = "";
  let email = "";
  let role = [];

  if (token && typeof token === "string" && token !== "undefined" && token !== "null") {
    try {
      const decode = jwtDecode(token);
      username = decode.sub || "";
      email = decode.email || "";
      role = decode.roles || [];
    } catch (error) {
      console.error("Token không hợp lệ:", error);
    }
  }

  const canAccessAdmin = role?.some((r) =>
    ['ROLE_ADMIN', 'ROLE_OWNER', 'ROLE_VET', 'ADMIN', 'OWNER', 'VET'].includes(r)
  );

  useEffect(() => {
    if (!token) return;

    const fetchUserHeader = async () => {
      try {
        const response = await axiosClient.get("/users/me");
        setUserProfile(response.data);
      } catch (err) {
        console.error("Không thể tải avatar trên header:", err);
      }
    };
    fetchUserHeader();

    const handleProfileUpdated = (e) => {
      if (e.detail) {
        setUserProfile(e.detail);
      }
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdated);
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdated);
    };
  }, [token]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleSendWidgetMsg = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || widgetLoading) return;

    const userText = chatInput;
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setWidgetMessages((prev) => [...prev, newMsg]);
    setChatInput('');
    setWidgetLoading(true);

    try {
      const res = await axiosClient.post('/ai/consultation', { prompt: userText });
      setWidgetMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: res.data?.response || 'Bác sĩ thú y đã ghi nhận câu hỏi của bạn.',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setWidgetMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: '🐾 Cảm ơn bạn! Để được hỗ trợ trực tiếp, vui lòng gọi Hotline 1900 888 999 hoặc đặt lịch khám trên web nhé.',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setWidgetLoading(false);
    }
  };

  const currentDisplayName = userProfile?.fullName || userProfile?.username || username || "Thành viên";
  const avatarUrl = userProfile?.avatarUrl;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f1115] text-foreground font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-card/95 backdrop-blur shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight shrink-0">
            <div className="size-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <PawPrint className="size-5" />
            </div>
            <span className="text-foreground">
              Vet<span className="text-emerald-600">Care</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Menu chính">
            {navLinks.map((item) => {
              const active = activePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'text-xs lg:text-sm font-semibold transition-colors relative py-1',
                    active
                      ? 'text-emerald-600 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600 after:rounded-full'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Dark/Light Toggle */}
            <button
              onClick={() => setIsDark((v) => !v)}
              className="flex size-9 items-center justify-center rounded-full hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
              aria-label={isDark ? 'Chế độ sáng' : 'Chế độ tối'}
            >
              {isDark ? <Sun className="size-5 text-amber-400" /> : <Moon className="size-5" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors cursor-pointer border border-border/60"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="size-7 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="flex size-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                      {username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <span className="text-xs font-bold hidden sm:inline-block max-w-[120px] truncate">
                    {currentDisplayName}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground mr-1" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-card p-2 shadow-xl border border-border z-50 text-foreground animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="text-xs font-bold truncate">{currentDisplayName}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{userProfile?.email || email}</p>
                      </div>

                      <button 
                        onClick={() => navigate('/profile')} 
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium hover:bg-accent cursor-pointer w-full text-left"
                      >
                        <User className="size-4 text-emerald-600" /> Hồ sơ cá nhân
                      </button>

                      <Link
                        to="/my-pets"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium hover:bg-accent cursor-pointer"
                      >
                        <PawPrint className="size-4 text-emerald-600" /> Thú cưng của tôi
                      </Link>

                      <Link
                        to="/my-bookings"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium hover:bg-accent cursor-pointer"
                      >
                        <CalendarDays className="size-4 text-emerald-600" /> Lịch hẹn của tôi
                      </Link>

                      <Link
                        to="/change-password"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium hover:bg-accent cursor-pointer"
                      >
                        <KeyRound className="size-4 text-emerald-600" /> Đổi mật khẩu
                      </Link>

                      <div className="my-1 border-t border-border" />

                      {canAccessAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium hover:bg-accent text-emerald-600 font-bold cursor-pointer"
                        >
                          <Shield className="size-4" /> Bác sĩ / Admin Portal
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium hover:bg-destructive/10 text-destructive cursor-pointer w-full text-left"
                      >
                        <LogOut className="size-4" /> Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                >
                  Đăng nhập
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              className="flex size-9 items-center justify-center rounded-lg hover:bg-muted md:hidden cursor-pointer"
              onClick={() => setMobileOpen(true)}
              aria-label="Mở menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-72 bg-card p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-lg text-emerald-600">VetCare Clinic</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Đóng">
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((item) => {
                  const active = activePath(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                        active
                          ? 'bg-emerald-500/10 text-emerald-600 font-bold'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
            {canAccessAdmin && (
              <div className="border-t pt-4">
                <Link 
                  to="/admin" 
                  className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-2"
                >
                  <Shield className="size-4" /> Chuyển sang Bác sĩ / Admin Portal
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Main Body */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* FLOATING CHAT WIDGET POPUP OVERLAY */}
      {chatWidgetOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col h-[480px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="p-3.5 bg-emerald-600 text-white flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="size-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xs leading-tight text-white flex items-center gap-1.5">
                  Bác Sĩ Thú Y AI <Sparkles className="size-3 text-amber-300" />
                </h4>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1 font-medium">
                  <span className="size-1.5 rounded-full bg-emerald-300 animate-pulse" /> Sẵn sàng tư vấn 24/7
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setChatWidgetOpen(false); navigate('/chat-support'); }}
                className="p-1 rounded-md hover:bg-white/10 text-white transition cursor-pointer"
                title="Mở toàn màn hình"
              >
                <Maximize2 className="size-3.5" />
              </button>
              <button
                onClick={() => setChatWidgetOpen(false)}
                className="p-1 rounded-md hover:bg-white/10 text-white transition cursor-pointer"
                title="Đóng"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-muted/20 text-xs">
            {widgetMessages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-xs leading-relaxed whitespace-pre-line',
                      isUser
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-card border border-border text-foreground rounded-bl-none'
                    )}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono mt-0.5 px-1">{m.time}</span>
                </div>
              );
            })}
            {widgetLoading && (
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] p-2 bg-card rounded-xl border border-border/60">
                <Loader2 className="size-3.5 animate-spin text-emerald-600" /> Bác sĩ AI đang viết tư vấn...
              </div>
            )}
          </div>

          <div className="px-3 py-1.5 bg-card border-t border-border/50 flex gap-1.5 overflow-x-auto text-[10px] shrink-0">
            <button
              onClick={() => setChatInput('Chó bị nôn mửa bọt trắng')}
              className="px-2.5 py-1 rounded-full bg-muted hover:bg-emerald-500/10 hover:text-emerald-600 transition shrink-0 font-medium cursor-pointer"
            >
              Chó nôn ói
            </button>
            <button
              onClick={() => setChatInput('Lịch tiêm vắc xin cho mèo con')}
              className="px-2.5 py-1 rounded-full bg-muted hover:bg-emerald-500/10 hover:text-emerald-600 transition shrink-0 font-medium cursor-pointer"
            >
              Lịch tiêm mèo
            </button>
          </div>

          <form onSubmit={handleSendWidgetMsg} className="p-2.5 border-t border-border bg-card flex items-center gap-1.5 shrink-0">
            <input
              type="text"
              placeholder="Hỏi triệu chứng bệnh của bé cưng..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 text-foreground"
            />
            <button
              type="submit"
              disabled={widgetLoading || !chatInput.trim()}
              className="flex size-8 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className="size-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Messenger / Chat Button Trigger */}
      <button
        onClick={() => setChatWidgetOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl hover:scale-105 transition-transform cursor-pointer"
        title="Chat với Bác sĩ Thú y AI"
      >
        {chatWidgetOpen ? (
          <X className="size-6 text-white" />
        ) : (
          <div className="relative">
            <Bot className="size-6 text-white" />
            <span className="absolute -top-1 -right-1 flex size-2.5 rounded-full bg-amber-300 ring-2 ring-emerald-600 animate-ping" />
          </div>
        )}
      </button>
    </div>
  );
}
