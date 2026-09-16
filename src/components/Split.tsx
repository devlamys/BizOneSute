import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/format';

const readFrac = (key: string, fb: number) => {
  const v = Number(localStorage.getItem(key));
  return v > 0.05 && v < 0.95 ? v : fb;
};

/* Draggable divider between two panes. Pointer + keyboard accessible,
   double-click (or Home) resets. Hidden below the split breakpoint. */
function Gutter({ onDelta, onReset, label, showAt }: { onDelta: (dx: number) => void; onReset: () => void; label: string; showAt: 'lg' | 'xl' }) {
  const startX = useRef(0);
  const dragging = useRef(false);
  return (
    <div
      role="separator" aria-orientation="vertical" aria-label={label} title="Drag to resize · double-click to reset"
      tabIndex={0}
      className={cx('hidden shrink-0 cursor-col-resize touch-none self-stretch px-[3px] outline-none', showAt === 'xl' ? 'xl:block' : 'lg:block')}
      onPointerDown={e => {
        dragging.current = true; startX.current = e.clientX;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={e => { if (dragging.current) { onDelta(e.clientX - startX.current); startX.current = e.clientX; } }}
      onPointerUp={() => { dragging.current = false; }}
      onPointerCancel={() => { dragging.current = false; }}
      onDoubleClick={onReset}
      onKeyDown={e => {
        if (e.key === 'ArrowLeft') { onDelta(-24); e.preventDefault(); }
        if (e.key === 'ArrowRight') { onDelta(24); e.preventDefault(); }
        if (e.key === 'Home') { onReset(); e.preventDefault(); }
      }}
    >
      <div className="mx-auto h-full w-[3px] rounded-full bg-gray-200 dark:bg-gray-700 transition-colors hover:bg-primary focus-visible:bg-primary" />
    </div>
  );
}

/* Two-pane resizable split. The LEFT pane fraction persists to localStorage.
   Panes stack vertically below the given breakpoint (gutter hidden there). */
export function SplitView({ left, right, storageKey, defaultFrac = 0.5, minLeft = 280, minRight = 240, bp = 'lg', className }: {
  left: ReactNode; right: ReactNode; storageKey: string;
  defaultFrac?: number; minLeft?: number; minRight?: number;
  bp?: 'lg' | 'xl'; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [frac, setFrac] = useState(() => readFrac(storageKey, defaultFrac));
  useEffect(() => { localStorage.setItem(storageKey, String(frac)); }, [storageKey, frac]);
  const width = () => ref.current?.getBoundingClientRect().width || 1000;
  const apply = (f: number) => {
    const w = width();
    const lo = Math.min(0.85, minLeft / w);
    const hi = Math.max(0.15, 1 - minRight / w);
    setFrac(Math.min(hi, Math.max(lo, f)));
  };
  const mq = bp === 'xl' ? '1280px' : '1024px';
  return (
    <div ref={ref} data-split={storageKey} className={cx('flex flex-col gap-3 items-stretch', bp === 'xl' ? 'xl:flex-row' : 'lg:flex-row', className)}>
      <div data-pane="l" className="min-w-0 w-full">{left}</div>
      <Gutter showAt={bp} label="Resize panels" onDelta={dx => apply(frac + dx / width())} onReset={() => setFrac(defaultFrac)} />
      <div data-pane="r" className="min-w-0 w-full">{right}</div>
      <style>{`@media (min-width: ${mq}) {
        [data-split="${storageKey}"] > [data-pane="l"] { flex: 0 0 calc(${(frac * 100).toFixed(2)}% - 8px); }
        [data-split="${storageKey}"] > [data-pane="r"] { flex: 0 0 calc(${((1 - frac) * 100).toFixed(2)}% - 8px); }
      }`}</style>
    </div>
  );
}
