import { Routes, Route, Navigate } from 'react-router-dom';

// Admin Shell & Pages
import { AdminShell } from '@/admin/components/admin-shell';
import DashboardPage from '@/admin/pages/dashboard';
import BookingsPage from '@/admin/pages/bookings';
import AdminServicesPage from '@/admin/pages/services';
import PaymentsPage from '@/admin/pages/payments';
import UsersPage from '@/admin/pages/users';

// User Layout & Pages
import { UserLayout } from '@/user/components/user-layout';
import UserHomePage from '@/user/pages/home';
import ServicesPage from '@/user/pages/services';
import BookingPage from '@/user/pages/booking';
import MyPetsPage from '@/user/pages/my-pets';
import UserMyBookingsPage from '@/user/pages/my-bookings';
import UserChatSupportPage from '@/user/pages/chat-support';
import VNPayReturnPage from '@/user/pages/vnpay-return';
import UserProfilePage from '@/user/pages/profile';
import UserChangePasswordPage from '@/user/pages/change-password';
import UserLoginPage from '@/user/pages/login';
import UserRegisterPage from '@/user/pages/register';

export default function App() {
  return (
    <Routes>
      {/* ===== Auth Routes ===== */}
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/register" element={<UserRegisterPage />} />

      {/* ===== User Facing Routes ===== */}
      <Route path="/" element={<UserLayout><UserHomePage /></UserLayout>} />
      <Route path="/services" element={<UserLayout><ServicesPage /></UserLayout>} />
      <Route path="/booking" element={<UserLayout><BookingPage /></UserLayout>} />
      <Route path="/my-pets" element={<UserLayout><MyPetsPage /></UserLayout>} />
      <Route path="/my-bookings" element={<UserLayout><UserMyBookingsPage /></UserLayout>} />
      <Route path="/chat-support" element={<UserLayout><UserChatSupportPage /></UserLayout>} />
      <Route path="/vnpay-return" element={<UserLayout><VNPayReturnPage /></UserLayout>} />
      <Route path="/profile" element={<UserLayout><UserProfilePage /></UserLayout>} />
      <Route path="/change-password" element={<UserLayout><UserChangePasswordPage /></UserLayout>} />

      {/* Backward compatible redirects */}
      <Route path="/venues" element={<Navigate to="/services" replace />} />
      <Route path="/court-booking/*" element={<Navigate to="/booking" replace />} />

      {/* ===== Admin & Doctor Routes ===== */}
      <Route path="/admin" element={<AdminShell><DashboardPage /></AdminShell>} />
      <Route path="/admin/bookings" element={<AdminShell><BookingsPage /></AdminShell>} />
      <Route path="/admin/services" element={<AdminShell><AdminServicesPage /></AdminShell>} />
      <Route path="/admin/payments" element={<AdminShell><PaymentsPage /></AdminShell>} />
      <Route path="/admin/users" element={<AdminShell><UsersPage /></AdminShell>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
