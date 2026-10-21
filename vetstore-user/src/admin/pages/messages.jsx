import { useMemo, useState } from 'react';
import { CheckCheck, Clock3, MoreHorizontal, Paperclip, Phone, Search, Send, Smile, UserRound, Video, } from 'lucide-react';
import { PageHeader } from '@/components/shared';
import { users } from '@/services/mock-data';
const conversations = [
    { id: 6, preview: 'Mình muốn đổi giờ sân sang 19:00 được không ạ?', time: '2 phút', unread: 2, online: true, tag: 'Đặt sân' },
    { id: 7, preview: 'Cảm ơn admin, mình đã nhận được xác nhận.', time: '18 phút', unread: 0, online: true, tag: 'Thanh toán' },
    { id: 10, preview: 'Sân Pickleball Sala còn trống cuối tuần không?', time: '1 giờ', unread: 1, online: false, tag: 'Tư vấn sân' },
    { id: 8, preview: 'Tôi cần hỗ trợ về mã giảm giá SPORT20.', time: '3 giờ', unread: 0, online: false, tag: 'Khuyến mãi' },
    { id: 3, preview: 'Đội của tôi muốn đăng ký giải tháng 10.', time: 'Hôm qua', unread: 0, online: true, tag: 'Giải đấu' },
];
const initialMessages = [
    { id: 1, from: 'customer', text: 'Chào admin, mình muốn đổi giờ sân sang 19:00 được không ạ?', time: '14:32' },
    { id: 2, from: 'admin', text: 'Chào bạn Long, mình kiểm tra ngay. Sân 5A tại Sân bóng Thống Nhất còn trống khung 19:00–21:00 nhé.', time: '14:33' },
    { id: 3, from: 'customer', text: 'Vậy admin hỗ trợ đổi giúp mình với ạ.', time: '14:34' },
    { id: 4, from: 'admin', text: 'Đã đổi lịch thành công. Phiếu BK-2409 hiện ở trạng thái đã xác nhận.', time: '14:35' },
    { id: 5, from: 'customer', text: 'Mình muốn đổi giờ sân sang 19:00 được không ạ?', time: '14:36' },
];
function initials(name) {
    if (!name) return 'KH';
    return name.split(' ').slice(-2).map((part) => part[0]).join('').toUpperCase();
}
export default function MessagesPage() {
    const [selectedId, setSelectedId] = useState(6);
    const [query, setQuery] = useState('');
    const [draft, setDraft] = useState('');
    const [messages, setMessages] = useState(initialMessages);
    const selected = users.find((user) => user.id === selectedId) ?? users[0] ?? { fullName: 'Khách hàng', email: 'khach@sporthub.vn', phone: '0901234567', joinedAt: '2024-01-01', bookings: 1 };
    const filtered = useMemo(() => conversations.filter((conversation) => {
        const user = users.find((item) => item.id === conversation.id) ?? { fullName: 'Khách hàng', email: 'khach@sporthub.vn' };
        const name = user?.fullName || 'Khách hàng';
        return name.toLowerCase().includes(query.toLowerCase()) || conversation.preview.toLowerCase().includes(query.toLowerCase());
    }), [query]);
    function sendMessage() {
        const text = draft.trim();
        if (!text)
            return;
        setMessages((current) => [...current, { id: Date.now(), from: 'admin', text, time: 'Bây giờ' }]);
        setDraft('');
    }
    return (<div className="flex flex-col gap-6">
      <PageHeader title="Tin nhắn khách hàng" description="Theo dõi và hỗ trợ khách hàng trong thời gian thực.">
        <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-2 text-xs font-semibold text-success"><span className="size-2 animate-pulse rounded-full bg-success"/> 3 khách đang online</div>
      </PageHeader>

      <div className="mt-6 grid min-h-[650px] overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-[300px_minmax(0,1fr)_240px]">
        <aside className="border-b border-border lg:border-b-0 lg:border-r">
          <div className="border-b border-border p-4"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm khách hàng..." className="h-10 w-full rounded-lg border border-input bg-muted/50 pl-9 pr-3 text-sm outline-none ring-primary focus:ring-2"/></div></div>
          <div className="flex max-h-[570px] flex-col overflow-y-auto">
            {filtered.map((conversation) => {
            const user = users.find((item) => item.id === conversation.id) ?? { fullName: 'Khách hàng', email: 'khach@sporthub.vn' };
            return <button key={conversation.id} onClick={() => setSelectedId(conversation.id)} className={`flex items-start gap-3 border-b border-border p-4 text-left transition hover:bg-muted/60 ${selectedId === conversation.id ? 'bg-primary/8' : ''}`}>
                <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">{initials(user.fullName)}{conversation.online && <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-success"/>}</span>
                <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><strong className="truncate text-sm">{user.fullName}</strong><small className="shrink-0 text-[10px] text-muted-foreground">{conversation.time}</small></span><span className="mt-1 flex items-center justify-between gap-2"><span className="truncate text-xs text-muted-foreground">{conversation.preview}</span>{conversation.unread > 0 && <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{conversation.unread}</span>}</span><span className="mt-2 inline-flex rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">{conversation.tag}</span></span>
              </button>;
        })}
          </div>
        </aside>

        <section className="flex min-h-[650px] flex-col">
          <header className="flex items-center justify-between border-b border-border px-5 py-4"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">{initials(selected.fullName)}</span><div><h3 className="font-bold">{selected.fullName}</h3><p className="flex items-center gap-1 text-xs text-muted-foreground"><span className="size-1.5 rounded-full bg-success"/> Khách hàng · {selected.email}</p></div></div><div className="flex items-center gap-1"><button className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Gọi điện"><Phone className="size-4"/></button><button className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Gọi video"><Video className="size-4"/></button><button className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Thêm"><MoreHorizontal className="size-4"/></button></div></header>
          <div className="flex-1 space-y-4 overflow-y-auto bg-muted/20 p-5">{messages.map((message) => <div key={message.id} className={`flex ${message.from === 'admin' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm ${message.from === 'admin' ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-card shadow-sm'}`}><p>{message.text}</p><div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${message.from === 'admin' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}><span>{message.time}</span>{message.from === 'admin' && <CheckCheck className="size-3"/>}</div></div></div>)}</div>
          <div className="border-t border-border bg-card p-4"><div className="mb-2 flex gap-2"><button className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground hover:bg-muted" onClick={() => setDraft('Mình đã kiểm tra và sẽ hỗ trợ bạn ngay nhé.')}>Mẫu trả lời nhanh</button><button className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground hover:bg-muted" onClick={() => setDraft('Bạn vui lòng gửi thêm thông tin giúp mình nhé.')}>Xin thêm thông tin</button></div><div className="flex items-end gap-2 rounded-xl border border-input bg-muted/30 p-2"><button className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Đính kèm"><Paperclip className="size-4"/></button><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
        event.preventDefault();
        sendMessage();
    } }} placeholder="Nhập tin nhắn..." rows={1} className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-1 py-2 text-sm outline-none"/><button className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Emoji"><Smile className="size-4"/></button><button onClick={sendMessage} className="rounded-lg bg-primary p-2 text-primary-foreground shadow-sm transition hover:brightness-95" aria-label="Gửi tin nhắn"><Send className="size-4"/></button></div></div>
        </section>

        <aside className="hidden border-l border-border bg-muted/20 p-5 lg:block"><div className="flex flex-col items-center border-b border-border pb-5"><span className="flex size-20 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">{initials(selected.fullName)}</span><h3 className="mt-3 font-bold">{selected.fullName}</h3><p className="text-xs text-muted-foreground">Khách hàng thân thiết</p><span className="mt-2 flex items-center gap-1 text-xs text-success"><span className="size-1.5 rounded-full bg-success"/> Đang hoạt động</span></div><div className="space-y-4 py-5 text-xs"><div><p className="mb-1 text-muted-foreground">Email</p><p className="font-medium">{selected.email}</p></div><div><p className="mb-1 text-muted-foreground">Số điện thoại</p><p className="font-medium">{selected.phone}</p></div><div><p className="mb-1 text-muted-foreground">Ngày tham gia</p><p className="font-medium">{selected.joinedAt}</p></div><div><p className="mb-1 text-muted-foreground">Tổng lượt đặt sân</p><p className="font-mono font-bold text-primary">{selected.bookings} lượt</p></div></div><div className="border-t border-border pt-4"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Tác vụ nhanh</p><button className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted"><UserRound className="size-4"/> Xem hồ sơ khách hàng</button><button className="mt-2 flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted"><Clock3 className="size-4"/> Xem lịch sử đặt sân</button></div></aside>
      </div>
    </div>);
}
