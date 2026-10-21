import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Bot, User, Sparkles, Stethoscope, PawPrint, Calendar, RefreshCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axiosClient from '@/config/axiosClient';

const QUICK_PROMPTS = [
  '🐶 Chó bị nôn mửa bọt trắng và bỏ ăn thì phải làm sao?',
  '🐱 Mèo bị ngứa và rụng lông từng mảng tròn có phải bị nấm không?',
  '💉 Lịch tiêm phòng vắc xin chuẩn cho chó mèo con là gì?',
  '✂️ Khi nào nên triệt sản cho mèo cái an toàn nhất?',
  '🦷 Chó bị hôi miệng và vàng răng thì xử lý thế nào?',
];

export default function ChatSupportPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Xin chào bạn! Tôi là Bác sĩ Thú y AI của VetCare Clinic 🐾. Bạn đang lo lắng về triệu chứng hay muốn tư vấn chăm sóc sức khỏe cho bé chó, mèo cưng nào?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: promptText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axiosClient.post('/ai/consultation', {
        prompt: promptText,
      });

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.data?.response || 'Rất tiếc, tôi đang gặp chút sự cố kết nối. Bạn vui lòng thử lại nhé!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Lỗi gọi AI:', err);
      const fallbackMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: '🐾 Xin lỗi bạn, hệ thống AI tạm thời gián đoạn. Nếu bé cưng đang trong tình trạng nguy cấp, vui lòng gọi ngay Hotline cấp cứu: **1900 888 999** hoặc đưa bé đến VetCare Clinic gần nhất!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="bg-card border border-border rounded-t-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shadow-inner">
            <Bot className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-foreground text-base">Bác Sĩ Thú Y AI (VetCare Assistant)</h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <Sparkles className="size-3" /> GenAI 2.5
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Tư vấn bệnh lý, sơ cứu và chế độ dinh dưỡng thú cưng 24/7</p>
          </div>
        </div>

        <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs">
          <Link to="/booking">
            <Calendar className="mr-1.5 size-3.5" /> Đặt lịch khám thực tế
          </Link>
        </Button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-muted/20 border-x border-border p-4 sm:p-6 space-y-4">
        {messages.map((m) => {
          const isBot = m.sender === 'bot';
          return (
            <div key={m.id} className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
              <div className={`size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                isBot
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-primary text-primary-foreground shadow-xs'
              }`}>
                {isBot ? <Bot className="size-4" /> : <User className="size-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                isBot
                  ? 'bg-card text-foreground border border-border/80'
                  : 'bg-emerald-600 text-white font-medium'
              }`}>
                {m.text}
                <div className={`text-[10px] mt-2 text-right ${isBot ? 'text-muted-foreground' : 'text-emerald-100'}`}>
                  {m.time}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Bot className="size-4" />
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 text-xs text-muted-foreground flex items-center gap-2 shadow-xs">
              <Loader2 className="size-4 animate-spin text-emerald-600" />
              <span>Bác sĩ AI đang phân tích triệu chứng của bé...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="bg-card border-x border-t border-border px-4 py-2 overflow-x-auto flex gap-2 shrink-0 scrollbar-none">
        {QUICK_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-medium bg-muted hover:bg-emerald-500/10 hover:text-emerald-600 border border-border/60 transition cursor-pointer shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="bg-card border border-border rounded-b-2xl p-3 sm:p-4 flex gap-2 shadow-xs shrink-0"
      >
        <Input
          placeholder="Hỏi Bác sĩ AI (ví dụ: Chó bị nôn mửa, mèo biếng ăn, sốt...)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-background text-xs sm:text-sm rounded-xl"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 rounded-xl shadow-xs"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
