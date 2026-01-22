import * as React from 'react';
import { cn } from '../util/cn';

export function SplitShell(props: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  className?: string;
  defaultLeftPx?: number;
  defaultRightPx?: number;
  minLeftPx?: number;
  maxLeftPx?: number;
  minRightPx?: number;
  maxRightPx?: number;
  persistKey?: string;
}) {
  const persistKey = props.persistKey ?? 'ghostodon.split';
  const minLeft = props.minLeftPx ?? 220;
  const maxLeft = props.maxLeftPx ?? 380;
  const minRight = props.minRightPx ?? 320;
  const maxRight = props.maxRightPx ?? 620;

  const readPersist = (): { left: number; right: number } | null => {
    try {
      const raw = localStorage.getItem(persistKey);
      if (!raw) return null;
      const v = JSON.parse(raw);
      if (typeof v?.left !== 'number' || typeof v?.right !== 'number') return null;
      return { left: v.left, right: v.right };
    } catch {
      return null;
    }
  };

  const initial = React.useMemo(() => {
    const persisted = typeof window !== 'undefined' ? readPersist() : null;
    return {
      left: Math.max(minLeft, Math.min(maxLeft, persisted?.left ?? props.defaultLeftPx ?? 260)),
      right: Math.max(minRight, Math.min(maxRight, persisted?.right ?? props.defaultRightPx ?? 360)),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [leftPx, setLeftPx] = React.useState<number>(initial.left);
  const [rightPx, setRightPx] = React.useState<number>(initial.right);
  const dragRef = React.useRef<null | { which: 'left' | 'right'; startX: number; start: number }>(null);

  React.useEffect(() => {
    try {
      localStorage.setItem(persistKey, JSON.stringify({ left: leftPx, right: rightPx }));
    } catch {
      // ignore
    }
  }, [leftPx, rightPx, persistKey]);

  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      if (dragRef.current.which === 'left') {
        setLeftPx(Math.max(minLeft, Math.min(maxLeft, dragRef.current.start + dx)));
      } else {
        // dragging right splitter: positive dx should expand right pane by reducing center.
        setRightPx(Math.max(minRight, Math.min(maxRight, dragRef.current.start - dx)));
      }
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [minLeft, maxLeft, minRight, maxRight]);

  const startDrag = (which: 'left' | 'right') => (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      which,
      startX: e.clientX,
      start: which === 'left' ? leftPx : rightPx,
    };
  };

  const gridCols = `${leftPx}px 18px minmax(420px, 1fr) 18px ${rightPx}px`;

  return (
    <div
      className={cn('ghost-shell ghost-shell-v2 grid h-screen w-screen grid-rows-1 gap-0 text-white', props.className)}
      style={{ gridTemplateColumns: gridCols }}
    >
      <div className="ghost-pane-slot ghost-pane-slot-left">{props.left}</div>

      <div
        onPointerDown={startDrag('left')}
        className="ghost-splitter"
        role="separator"
        aria-label="Resize left pane"
      >
        <div className="ghost-splitter-bar" />
        <div className="ghost-splitter-hit" />
      </div>

      <div className="ghost-pane-slot ghost-pane-slot-center">{props.center}</div>

      <div
        onPointerDown={startDrag('right')}
        className="ghost-splitter"
        role="separator"
        aria-label="Resize right pane"
      >
        <div className="ghost-splitter-bar" />
        <div className="ghost-splitter-hit" />
      </div>

      <div className="ghost-pane-slot ghost-pane-slot-right">{props.right}</div>
    </div>
  );
}
