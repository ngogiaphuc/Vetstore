import { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';
import { cn } from '@/services/utils';
export function LiveClock({ startMinute = 67, half = 'H2', className }) {
    const [seconds, setSeconds] = useState(startMinute * 60 + 12);
    useEffect(() => {
        const id = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(id);
    }, []);
    const mm = Math.floor(seconds / 60);
    const ss = String(seconds % 60).padStart(2, '0');
    return (<span className={cn('flex items-center gap-1 font-mono text-xs text-destructive', className)}>
      <Radio className="size-3 blink"/>
      <span>
        {half} · {mm}
        <span className="blink">:</span>
        {ss}
      </span>
    </span>);
}
