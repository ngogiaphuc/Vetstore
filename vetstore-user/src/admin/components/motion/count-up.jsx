import { useEffect, useState } from 'react';
export function CountUp({ to, duration = 1300, delay = 0, format = 'number', className, }) {
    const display = (n) => {
        if (format === 'percent')
            return `${Math.round(n)}%`;
        if (format === 'short-currency')
            return `${n.toFixed(1).replace('.', ',')}tr`;
        return Math.round(n).toLocaleString('vi-VN');
    };
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setValue(to);
            return;
        }
        let raf = 0;
        const start = performance.now() + delay;
        const tick = (now) => {
            const p = Math.min(1, Math.max(0, (now - start) / duration));
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(to * eased);
            if (p < 1)
                raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [to, duration, delay]);
    return (<span className={className} aria-label={display(to)}>
      {display(value)}
    </span>);
}
