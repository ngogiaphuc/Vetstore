// Data demo mô phỏng hoàn chỉnh hệ thống SportHub theo mockup thiết kế 24 trang

export const sports = [
  { id: 1, name: 'Bóng đá', code: 'football', icon: '⚽' },
  { id: 2, name: 'Cầu lông', code: 'badminton', icon: '🏸' },
  { id: 3, name: 'Pickleball', code: 'pickleball', icon: '🏓' },
  { id: 4, name: 'Tennis', code: 'tennis', icon: '🎾' },
  { id: 5, name: 'Bóng rổ', code: 'basketball', icon: '🏀' },
];

export const cities = [
  { id: 1, name: 'TP. Hồ Chí Minh' },
  { id: 2, name: 'Hà Nội' },
  { id: 3, name: 'Đà Nẵng' },
  { id: 4, name: 'Việt Trì, Phú Thọ' },
];

export const districts = [
  { id: 1, cityId: 1, name: 'Quận 1' },
  { id: 2, cityId: 1, name: 'Quận 2' },
  { id: 3, cityId: 1, name: 'Quận 7' },
  { id: 4, cityId: 1, name: 'Quận 10' },
  { id: 5, cityId: 1, name: 'Quận 11' },
  { id: 6, cityId: 1, name: 'TP. Thủ Đức' },
  { id: 7, cityId: 1, name: 'Quận Tân Phú' },
  { id: 8, cityId: 1, name: 'Quận Phú Nhuận' },
  { id: 9, cityId: 1, name: 'Quận Gò Vấp' },
];

export const facilities = [
  { id: 1, name: 'Bãi đỗ xe' },
  { id: 2, name: 'Phòng thay đồ' },
  { id: 3, name: 'Căng tin' },
  { id: 4, name: 'Wifi' },
  { id: 5, name: 'Đèn chiếu sáng' },
  { id: 6, name: 'Cho thuê dụng cụ' },
];

export const venues = [
  {
    id: 1,
    name: 'Phú Thọ Sports Center',
    address: '219 Lý Thường Kiệt, Phường 15, Quận 11',
    district: 'Quận 11, TP. Hồ Chí Minh',
    city: 'TP. Hồ Chí Minh',
    ownerId: 3,
    status: 'active',
    openTime: '06:00',
    closeTime: '22:00',
    phone: '028 3865 1234',
    description: 'Phú Thọ Sports Center là tổ hợp thể thao hiện đại với nhiều loại sân chất lượng cao, đáp ứng nhu cầu tập luyện và thi đấu của mọi đối tượng.',
    facilityIds: [1, 2, 3, 4, 5, 6],
    rating: 4.8,
    reviewCount: 120,
    courtCount: 8,
    image: '/images/venue-badminton.png',
  },
  {
    id: 2,
    name: 'An Phú Sports',
    address: '10 Mai Chí Thọ, Phường An Phú',
    district: 'TP. Thủ Đức, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    ownerId: 2,
    status: 'active',
    openTime: '05:30',
    closeTime: '23:00',
    phone: '090 123 4567',
    description: 'Khu phức hợp thể thao An Phú trang bị mặt sân hiện đại, hệ thống chiếu sáng chuẩn thi đấu.',
    facilityIds: [1, 2, 3, 5],
    rating: 4.7,
    reviewCount: 98,
    courtCount: 6,
    image: '/images/venue-football.png',
  },
  {
    id: 3,
    name: 'Saigon Pickleball',
    address: '26 Nguyễn Văn Linh, Phường Tân Phong',
    district: 'Quận 7, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    ownerId: 4,
    status: 'active',
    openTime: '06:00',
    closeTime: '22:30',
    phone: '098 765 4321',
    description: 'Sân pickleball tiêu chuẩn quốc tế tại trung tâm Quận 7, không gian thoáng mát.',
    facilityIds: [1, 3, 4, 5, 6],
    rating: 4.6,
    reviewCount: 76,
    courtCount: 4,
    image: '/images/venue-pickleball.png',
  },
  {
    id: 4,
    name: 'VietGoal Complex',
    address: '02 Lê Trọng Tấn',
    district: 'Quận Tân Phú, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    ownerId: 2,
    status: 'active',
    openTime: '06:00',
    closeTime: '22:00',
    phone: '091 234 5678',
    description: 'Tổ hợp bóng đá và thể thaoVietGoal phong trào.',
    facilityIds: [1, 2, 5],
    rating: 4.5,
    reviewCount: 64,
    courtCount: 5,
    image: '/images/venue-football.png',
  },
  {
    id: 5,
    name: 'Rạch Miễu Sports',
    address: '01 Hoa Phượng',
    district: 'Quận Phú Nhuận, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    ownerId: 3,
    status: 'active',
    openTime: '06:00',
    closeTime: '22:00',
    phone: '028 3995 1111',
    description: 'Trung tâm thể thao Rạch Miễu Phú Nhuận.',
    facilityIds: [1, 2, 3, 4],
    rating: 4.6,
    reviewCount: 82,
    courtCount: 8,
    image: '/images/venue-tennis.png',
  },
  {
    id: 6,
    name: 'Gia Định Tennis Club',
    address: '01 Hoàng Minh Giám',
    district: 'Quận Gò Vấp, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    ownerId: 5,
    status: 'active',
    openTime: '05:30',
    closeTime: '21:30',
    phone: '028 3894 2222',
    description: 'Câu lạc bộ Tennis Gia Định lâu đời và chất lượng.',
    facilityIds: [1, 2, 5, 6],
    rating: 4.4,
    reviewCount: 52,
    courtCount: 4,
    image: '/images/venue-tennis.png',
  },
];

export const courts = [
  { id: 1, venueId: 1, sportId: 2, name: 'Sân cầu lông 01', type: 'Sân đơn/đôi', surface: 'Thảm PVC', status: 'available', capacity: '4 người', indoor: true, basePrice: 80000, peakPrice: 120000, image: '/images/venue-badminton.png' },
  { id: 2, venueId: 1, sportId: 2, name: 'Sân cầu lông 02', type: 'Sân đơn/đôi', surface: 'Thảm PVC', status: 'available', capacity: '4 người', indoor: true, basePrice: 80000, peakPrice: 120000, address: '01 Lữ Gia, Phường 15, Quận 11, TP. Hồ Chí Minh', description: 'Sân cầu lông đạt tiêu chuẩn, mặt sân chất lượng cao, không gian trong nhà thoáng mát, đèn chiếu sáng hiện đại. Phù hợp cho chơi phong trào và thi đấu.', image: '/images/venue-badminton.png' },
  { id: 3, venueId: 1, sportId: 2, name: 'Sân cầu lông 03', type: 'Sân đơn/đôi', surface: 'Thảm PVC', status: 'available', capacity: '4 người', indoor: true, basePrice: 80000, peakPrice: 120000, image: '/images/venue-badminton.png' },
  { id: 4, venueId: 2, sportId: 1, name: 'Sân bóng đá 5 người', type: 'Sân 5 người', surface: 'Cỏ nhân tạo', status: 'available', capacity: '10 người', indoor: false, basePrice: 150000, peakPrice: 250000, image: '/images/venue-football.png' },
  { id: 5, venueId: 3, sportId: 3, name: 'Sân pickleball 01', type: 'Sân tiêu chuẩn', surface: 'Acrylic', status: 'available', capacity: '4 người', indoor: false, basePrice: 150000, peakPrice: 220000, image: '/images/venue-pickleball.png' },
  { id: 6, venueId: 3, sportId: 3, name: 'Sân pickleball 02', type: 'Sân tiêu chuẩn', surface: 'Acrylic', status: 'available', capacity: '4 người', indoor: false, basePrice: 180000, peakPrice: 250000, image: '/images/venue-pickleball.png' },
  { id: 7, venueId: 6, sportId: 4, name: 'Sân tennis Gia Định 01', type: 'Sân cứng', surface: 'Hard court', status: 'available', capacity: '4 người', indoor: false, basePrice: 200000, peakPrice: 300000, image: '/images/venue-tennis.png' },
];

export const timeSlots = [
  { id: 1, label: '16:00 - 17:00', start: '16:00', end: '17:00', price: 80000, peak: false, status: 'available' },
  { id: 2, label: '17:00 - 18:00', start: '17:00', end: '18:00', price: 80000, peak: false, status: 'booked' },
  { id: 3, label: '18:00 - 19:00', start: '18:00', end: '19:00', price: 80000, peak: true, status: 'selected' },
  { id: 4, label: '19:00 - 20:00', start: '19:00', end: '20:00', price: 80000, peak: true, status: 'selected' },
  { id: 5, label: '20:00 - 21:00', start: '20:00', end: '21:00', price: 80000, peak: true, status: 'tournament' },
  { id: 6, label: '21:00 - 22:00', start: '21:00', end: '22:00', price: 80000, peak: false, status: 'available' },
];

export const users = [
  { id: 1, username: 'minhhuy', fullName: 'Minh Huy', email: 'minhhuy@email.com', phone: '0901234567', dob: '15/08/1995', gender: 'Nam', address: '123 Đường Nguyễn Văn Cừ', city: 'Hà Nội', avatar: '/placeholder-user.jpg', roles: ['customer'], status: 'active', joinedAt: '2024-06-01', bookings: 12 },
  { id: 2, username: 'anphu_owner', fullName: 'Nguyễn Văn An', email: 'anphu@sporthub.vn', phone: '0901112222', roles: ['owner'], status: 'active', joinedAt: '2024-01-10' },
  { id: 3, username: 'phutho_owner', fullName: 'Nhà thi đấu Phú Thọ', email: 'phutho@sporthub.vn', phone: '0903334444', roles: ['owner'], status: 'active', joinedAt: '2024-02-15' },
  { id: 4, username: 'saigon_owner', fullName: 'Lê Thị Thu', email: 'saigonpickleball@sporthub.vn', phone: '0905556666', roles: ['owner'], status: 'active', joinedAt: '2024-03-20' },
  { id: 5, username: 'hoang_user', fullName: 'Nguyễn Hoàng', email: 'hoang.nguyen@gmail.com', phone: '0908889999', roles: ['customer'], status: 'active', joinedAt: '2024-08-15' },
  { id: 6, username: 'duc_user', fullName: 'Trần Minh Đức', email: 'dat.tran@gmail.com', phone: '0907778888', roles: ['customer'], status: 'active', joinedAt: '2024-08-20' },
  { id: 7, username: 'tuan_user', fullName: 'Tuấn Lê', email: 'tuan.le@gmail.com', phone: '0906665555', roles: ['customer'], status: 'active', joinedAt: '2024-09-01' },
];

export const vouchers = [
  { id: 1, code: 'SPORT20', description: 'Giảm 20% tối đa 50.000đ cho đơn đặt sân', type: 'percent', value: 20, minOrder: 100000, maxDiscount: 50000, used: 45, usageLimit: 100, expiresAt: '2026-12-31', active: true },
  { id: 2, code: 'SUMMER50K', description: 'Giảm trực tiếp 50.000đ cho đơn từ 200.000đ', type: 'fixed', value: 50000, minOrder: 200000, maxDiscount: 50000, used: 80, usageLimit: 100, expiresAt: '2026-10-31', active: true },
  { id: 3, code: 'WELCOME10', description: 'Giảm 10% cho khách hàng mới', type: 'percent', value: 10, minOrder: 50000, maxDiscount: 30000, used: 12, usageLimit: 50, expiresAt: '2026-11-30', active: false },
];

export const bookings = [
  {
    id: 'SH20092601',
    userId: 1,
    userName: 'Minh Huy',
    userPhone: '0901234567',
    userEmail: 'minhhuy@email.com',
    venueId: 1,
    venueName: 'Nhà thi đấu Phú Thọ',
    courtId: 2,
    courtName: 'Sân cầu lông 02',
    sportName: 'Cầu lông',
    date: '20/09/2026',
    dateIso: '2026-09-20',
    dateDayName: 'Chủ nhật',
    slotIds: [3, 4],
    slotLabels: ['18:00 - 19:00', '19:00 - 20:00'],
    timeSlotText: '18:00 - 20:00 (2 khung giờ)',
    slotCount: 2,
    subtotal: 160000,
    voucherCode: 'SPORT20',
    discount: 32000,
    total: 128000,
    status: 'confirmed', // 'confirmed' | 'pending' | 'completed' | 'cancelled'
    paymentStatus: 'paid', // 'paid' | 'unpaid'
    paymentMethod: 'MoMo',
    createdAt: '15/09/2026 14:32',
    image: '/images/venue-badminton.png',
    address: 'Quận 11, TP. Hồ Chí Minh',
  },
  {
    id: 'SH22092602',
    userId: 1,
    userName: 'Minh Huy',
    userPhone: '0901234567',
    userEmail: 'minhhuy@email.com',
    venueId: 3,
    venueName: 'PickleHub Thảo Điền',
    courtId: 5,
    courtName: 'Sân Pickleball 01',
    sportName: 'Pickleball',
    date: '22/09/2026',
    dateIso: '2026-09-22',
    dateDayName: 'Thứ ba',
    slotIds: [3, 4],
    slotLabels: ['18:00 - 19:00', '19:00 - 20:00'],
    timeSlotText: '18:00 - 20:00 (2 khung giờ)',
    slotCount: 2,
    subtotal: 150000,
    voucherCode: '',
    discount: 0,
    total: 150000,
    status: 'pending',
    paymentStatus: 'unpaid',
    paymentMethod: 'Chuyển khoản',
    createdAt: '16/09/2026 09:15',
    image: '/images/venue-pickleball.png',
    address: 'Thành phố Thủ Đức, TP. HCM',
  },
  {
    id: 'SH12092603',
    userId: 1,
    userName: 'Minh Huy',
    userPhone: '0901234567',
    userEmail: 'minhhuy@email.com',
    venueId: 2,
    venueName: 'Sân bóng đá An Phú',
    courtId: 4,
    courtName: 'Sân bóng đá An Phú',
    sportName: 'Bóng đá',
    date: '12/09/2026',
    dateIso: '2026-09-12',
    dateDayName: 'Thứ bảy',
    slotIds: [2],
    slotLabels: ['17:00 - 18:00'],
    timeSlotText: '17:00 - 18:00 (1 khung giờ)',
    slotCount: 1,
    subtotal: 250000,
    voucherCode: '',
    discount: 0,
    total: 250000,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'Ví MoMo',
    createdAt: '10/09/2026 18:00',
    image: '/images/venue-football.png',
    address: 'Quận 2, TP. Hồ Chí Minh',
  },
];

export const reviews = [
  {
    id: 1,
    userId: 5,
    userName: 'Nguyễn Hoàng',
    bookingId: 'SH12092603',
    venueId: 2,
    courtName: 'Sân bóng đá An Phú',
    rating: 5,
    date: '10/09/2026',
    comment: 'Sân rất đẹp, mặt cỏ êm và chất lượng. Nhân viên hỗ trợ nhiệt tình, sẽ quay lại!',
  },
  {
    id: 2,
    userId: 6,
    userName: 'Trần Minh Đức',
    bookingId: 'SH05092604',
    venueId: 1,
    courtName: 'Sân cầu lông 01',
    rating: 5,
    date: '05/09/2026',
    comment: 'Không gian thoáng, sân tốt. Chỉ mong có thêm chỗ gửi xe.',
  },
];

export const teams = [
  {
    id: 1,
    name: 'Saigon Smash',
    shortName: 'SS',
    sportId: 2,
    sportName: 'Cầu lông',
    captainId: 1,
    captainName: 'Minh Huy',
    memberCount: 4,
    expectedMembers: 4,
    role: 'Bạn là đội trưởng',
    isCaptain: true,
    logo: '',
    description: 'Cùng luyện tập và tham gia các giải cầu lông phong trào.',
    wins: 12,
    losses: 3,
  },
  {
    id: 2,
    name: 'An Phú FC',
    shortName: 'AP',
    sportId: 1,
    sportName: 'Bóng đá',
    captainId: 5,
    captainName: 'Nguyễn Hoàng',
    memberCount: 8,
    expectedMembers: 10,
    role: 'Bạn là thành viên',
    isCaptain: false,
    logo: '',
    description: 'Đội bóng đá giao hữu hàng tuần khu vực An Phú Quận 2.',
    wins: 8,
    losses: 2,
  },
  {
    id: 3,
    name: 'Blue Court',
    shortName: 'BC',
    sportId: 3,
    sportName: 'Pickleball',
    captainId: 1,
    captainName: 'Minh Huy',
    memberCount: 4,
    expectedMembers: 4,
    role: 'Bạn là đội trưởng',
    isCaptain: true,
    logo: '',
    description: 'Đam mê pickleball, luyện tập giao lưu thi đấu giải phong trào.',
    wins: 6,
    losses: 1,
  },
];

export const teamMembers = [
  { id: 1, teamId: 1, userId: 1, fullName: 'Minh Huy', email: 'minhhuy@gmail.com', role: 'Đội trưởng', isCaptain: true, joinedAt: '12/08/2024', position: 'Đơn/Đôi' },
  { id: 2, teamId: 1, userId: 5, fullName: 'Hoàng', email: 'hoang.nguyen@gmail.com', role: 'Thành viên', isCaptain: false, joinedAt: '15/08/2024', position: 'Đánh đôi' },
  { id: 3, teamId: 1, userId: 6, fullName: 'Đạt', email: 'dat.tran@gmail.com', role: 'Thành viên', isCaptain: false, joinedAt: '20/08/2024', position: 'Đánh đơn' },
  { id: 4, teamId: 1, userId: 7, fullName: 'Tuấn', email: 'tuan.le@gmail.com', role: 'Thành viên', isCaptain: false, joinedAt: '01/09/2024', position: 'Dự bị' },
];

export const tournaments = [
  {
    id: 1,
    name: 'SportHub Badminton Open 2026',
    sportId: 2,
    sportName: 'Cầu lông',
    status: 'registration', // 'registration' | 'ongoing' | 'finished'
    statusLabel: 'Đang nhận đăng ký',
    startDate: '27/09/2026',
    endDate: '28/09/2026',
    dateRangeText: '27 - 28/09/2026',
    registrationDeadline: '24/09/2026',
    venueId: 1,
    venueName: 'Phú Thọ Sports Center',
    locationText: 'Số 219 Lý Thường Kiệt, Việt Trì, Phú Thọ',
    maxTeams: 16,
    registeredTeams: 12,
    entryFee: 200000,
    entryFeeText: '200.000đ / đội',
    banner: '/images/venue-badminton.png',
    format: 'Đôi nam, đôi nữ, đôi nam nữ (Phong trào, không phân hạng)',
    description: 'SportHub Badminton Open 2026 là giải đấu phong trào dành cho các tay vợt yêu thích bộ môn cầu lông, thi đấu nội dung đôi nam, đôi nữ và đôi nam nữ. Giải đấu hướng đến tinh thần thể thao lành mạnh, giao lưu và kết nối cộng đồng.',
  },
  {
    id: 2,
    name: 'Saigon Football Cup',
    sportId: 1,
    sportName: 'Bóng đá',
    status: 'ongoing',
    statusLabel: 'Sắp diễn ra',
    startDate: '15/10/2026',
    endDate: '16/10/2026',
    dateRangeText: '15 - 16/10/2026',
    registrationDeadline: '10/10/2026',
    venueId: 2,
    venueName: 'Sân vận động Thống Nhất',
    locationText: '138 Đào Duy Từ, Quận 10, TP. HCM',
    maxTeams: 16,
    registeredTeams: 8,
    entryFee: 200000,
    entryFeeText: '200.000đ mỗi đội',
    banner: '/images/venue-football.png',
    format: 'Loại trực tiếp (Sân 7 người)',
    description: 'Giải bóng đá phong trào cup Sài Gòn quy tụ các đội bóng đá mạnh trên địa bàn TP.HCM.',
  },
  {
    id: 3,
    name: 'Pickleball Weekend',
    sportId: 3,
    sportName: 'Pickleball',
    status: 'finished',
    statusLabel: 'Đã kết thúc',
    startDate: '12/08/2026',
    endDate: '13/08/2026',
    dateRangeText: '12 - 13/08/2026',
    registrationDeadline: '08/08/2026',
    venueId: 3,
    venueName: 'VietPickle Club',
    locationText: 'TP. Thủ Đức, TP. HCM',
    maxTeams: 16,
    registeredTeams: 16,
    entryFee: 250000,
    entryFeeText: '250.000đ mỗi đội',
    banner: '/images/venue-pickleball.png',
    format: 'Vòng tròn tính điểm',
    description: 'Giải pickleball giao lưu cuối tuần.',
  },
];

export const tournamentBrackets = [
  {
    round: 'Bán kết',
    matches: [
      { id: 1, team1: 'Saigon Smash', score1: 2, team2: 'Blue Wings', score2: 1, winner: 'Saigon Smash' },
      { id: 2, team1: 'City Rackets', score1: 0, team2: 'Phú Thọ Club', score2: 2, winner: 'Phú Thọ Club' },
    ],
  },
  {
    round: 'Chung kết',
    matches: [
      { id: 3, team1: 'Saigon Smash', score1: null, team2: 'Phú Thọ Club', score2: null, status: 'Chưa diễn ra', date: '28/09/2026', time: '18:00 - 19:00', court: 'Sân cầu lông 02' },
    ],
  },
];

export const chatMessages = [
  { id: 1, sender: 'admin', text: 'Xin chào Minh Huy! SportHub có thể hỗ trợ gì cho bạn?', time: '14:20' },
  { id: 2, sender: 'user', text: 'Chào bạn, mình muốn kiểm tra đơn đặt sân mã SH20092601. Lịch này đã được xác nhận chưa ạ?', time: '14:22' },
  { id: 3, sender: 'admin', text: 'Bạn vui lòng đợi mình kiểm tra thông tin nhé.', time: '14:24' },
  {
    id: 4,
    sender: 'card',
    bookingCard: {
      title: 'Sân cầu lông 02',
      venue: 'Nhà thi đấu Phú Thọ',
      date: '20/09/2026 - 18:00 - 20:00',
      bookingId: 'SH20092601',
    },
    time: '14:25',
  },
  { id: 5, sender: 'user', text: 'Cảm ơn bạn. Mình chỉ muốn chắc chắn vì sắp xếp công việc rồi ạ.', time: '14:26' },
  { id: 6, sender: 'admin', text: 'Mình đã kiểm tra, lịch sản của bạn được xác nhận nhé.', time: '14:32' },
];

export const findUser = (id) => users.find((u) => u.id === id);
export const findVenue = (id) => venues.find((v) => v.id === id);
export const findCourt = (id) => courts.find((c) => c.id === id);
export const findSport = (id) => sports.find((s) => s.id === id);
export const notifications = [
  { id: 1, title: 'Đơn đặt mới #SH20092601', time: '10 phút trước', read: false },
  { id: 2, title: 'Thanh toán MoMo thành công', time: '1 giờ trước', read: false },
  { id: 3, title: 'Đánh giá 5 sao từ Minh Huy', time: '3 giờ trước', read: true },
];

export const matches = [
  { id: 1, homeTeamId: 1, awayTeamId: 2, homeScore: 2, awayScore: 1, status: 'live', minute: "38'" },
  { id: 2, homeTeamId: 3, awayTeamId: 1, homeScore: 0, awayScore: 0, status: 'scheduled', time: '18:00' },
];

export const paymentMethods = [
  { id: 1, name: 'Thẻ ATM / Thẻ tín dụng', code: 'card' },
  { id: 2, name: 'Ví MoMo', code: 'momo' },
  { id: 3, name: 'Chuyển khoản ngân hàng', code: 'bank' },
];

export const payments = [
  { id: 'PAY-101', bookingId: 'SH20092601', amount: 128000, method: 'MoMo', status: 'success', createdAt: '15/09/2026 14:32' },
  { id: 'PAY-102', bookingId: 'SH22092602', amount: 150000, method: 'Chuyển khoản', status: 'pending', createdAt: '16/09/2026 09:15' },
];

export const voucherUsages = [
  { id: 1, voucherId: 1, userId: 1, bookingId: 'SH20092601', discount: 32000, usedAt: '15/09/2026 14:32' },
];

export const tournamentRounds = [
  { id: 1, tournamentId: 1, roundName: 'Bán kết', matches: [ { team1: 'Saigon Smash', score1: 2, team2: 'Blue Wings', score2: 1 } ] },
];

export const tournamentTeams = [
  { id: 1, tournamentId: 1, teamId: 1, teamName: 'Saigon Smash', status: 'approved' },
];

export const bookingStatusHistory = [
  { id: 1, bookingId: 'SH20092601', status: 'confirmed', updatedAt: '15/09/2026 14:32' },
];

export const revenueByDay = [
  { day: 'Thứ 2', revenue: 1200000 },
  { day: 'Thứ 3', revenue: 1800000 },
  { day: 'Thứ 4', revenue: 1500000 },
  { day: 'Thứ 5', revenue: 2100000 },
  { day: 'Thứ 6', revenue: 2800000 },
  { day: 'Thứ 7', revenue: 4200000 },
  { day: 'Chủ nhật', revenue: 3900000 },
];

export const bookingsBySport = [
  { name: 'Cầu lông', value: 45 },
  { name: 'Bóng đá', value: 30 },
  { name: 'Pickleball', value: 15 },
  { name: 'Tennis', value: 10 },
];

export const formatVND = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n || 0);

export const formatCompactVND = (n) => {
  if (!n) return '0đ';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'Mđ';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'k';
  return n + 'đ';
};

export const initials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
};

export const findTeam = (id) => (id == null ? undefined : teams.find((t) => t.id === id));
export const findSlot = (id) => timeSlots.find((s) => s.id === id);