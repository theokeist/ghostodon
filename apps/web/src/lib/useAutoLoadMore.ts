import * as React from 'react';

/**
 * Calls `onHit` when the sentinel element becomes visible.
 *
 * Used to auto-load next page on scroll, while still keeping a manual "Load more" button.
 */
export function useAutoLoadMore(onHit: () => void, enabled: boolean) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onHit();
      },
      {
        root: null,
        rootMargin: '600px 0px',
        threshold: 0,
      }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [enabled, onHit]);

  return ref;
}
