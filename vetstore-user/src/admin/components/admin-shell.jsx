import { useLocation, Link } from 'react-router-dom';
import {
  CalendarDays, CircleDollarSign, Home, Menu, Moon, Shield, Sun, Stethoscope, PawPrint, X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/services/utils';

const operations = [
  { title: 'Tổng quan', href: '/admin', icon: Home },
  { title: 'Lịch khám bệnh', href: '/admin/bookings', icon: CalendarDays },
  { title: 'Dịch vụ thú y', href: '/admin/services', icon: Stethoscope },
  { title: 'Thanh toán VNPay', href: '/admin/payments', icon: CircleDollarSign },
  { title: 'Người dùng', href: '/admin/users', icon: Shield },
  { title: 'Trang người dùng', href: '/', icon: PawPrint },
];

const topNav = [
  { label: 'TỔNG QUAN', href: '/admin' },
  { label: 'LỊCH KHÁM BỆNH', href: '/admin/bookings' },
  { label: 'DỊCH VỤ THÚ Y', href: '/admin/services' },
  { label: 'THANH TOÁN VNPAY', href: '/admin/payments' },
  { label: 'NGƯỜI DÙNG', href: '/admin/users' },
  { label: 'VỀ TRANG CHỦ', href: '/' },
];

function activePath(pathname, href) {
  if (href === '/admin') {
    return pathname === '/admin';
  }
  return pathname.startsWith(href);
}

export function AdminShell({ children }) {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className={cn('sports-rail', mobileOpen && 'sports-rail-open')}>
        <div className="flex items-center justify-between px-2 lg:justify-center">
          <Link to="/admin" className="flex items-center justify-center gap-2" aria-label="VetCare Admin">
            <div className="size-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <PawPrint className="size-5" />
            </div>
          </Link>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Đóng menu"><X className="size-5"/></button>
        </div>
        <div className="my-5 h-px bg-border/70"/>
        <nav className="flex flex-col gap-2 px-2" aria-label="Điều hướng quản trị">
          {operations.map((item) => {
            const Icon = item.icon;
            const active = activePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn('rail-link group', active && 'rail-link-active text-emerald-600')}
                title={item.title}
              >
                <Icon className="size-5"/>
                <span className="rail-label">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="sports-content">
        <header className="sports-header">
          <button className="mr-3 rounded-lg p-2 hover:bg-muted lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Mở menu"><Menu className="size-5"/></button>
          <Link to="/admin" className="sports-wordmark" aria-label="VetCare">
            Vet<span className="text-emerald-600">Care</span>
          </Link>
          <nav className="top-nav hidden lg:flex" aria-label="Danh mục">
            {topNav.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn('top-nav-link flex items-center gap-1.5', activePath(pathname, item.href) && 'top-nav-link-active text-emerald-600 font-bold')}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setIsDark((v) => !v)}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-card/80 p-2 text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4" />}
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
