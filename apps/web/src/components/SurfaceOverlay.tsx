import React from 'react';

export default function SurfaceOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(var(--g-accent), 0.22), transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1.6px)',
          backgroundSize: '18px 18px',
        }}
      />
      <div
        className="absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl"
        style={{ background: 'rgba(var(--g-accent-2), 0.18)' }}
      />
      <div
        className="absolute bottom-0 left-0 h-[2px] w-full"
        style={{
          background:
            'linear-gradient(90deg, rgba(var(--g-accent), 0.6), transparent)',
        }}
      />
    </div>
  );
}
