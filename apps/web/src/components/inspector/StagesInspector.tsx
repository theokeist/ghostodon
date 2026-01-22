import React from 'react';
import { STAGES } from '../../stages/stages';
import { Button } from '@ghostodon/ui';
import { useInspectorStore } from '@ghostodon/state';

export default function StagesInspector() {
  const setInspector = useInspectorStore((s) => s.setInspector);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-[12px] text-white/60">
        This project tracks 28 stages. The build focuses on PC-first MVP now, then fills in the rest.
      </div>

      <div className="rounded-[14px] border border-white/10 bg-black/20 p-2">
        <div className="grid grid-cols-[52px_1fr_70px] gap-2 px-2 py-2 text-[11px] font-semibold text-white/50">
          <div>ID</div>
          <div>Stage</div>
          <div>Status</div>
        </div>
        {STAGES.map((s) => (
          <div key={s.id} className="grid grid-cols-[52px_1fr_70px] gap-2 border-t border-white/10 px-2 py-2">
            <div className="text-[12px] text-white/50">{s.id.toString().padStart(2, '0')}</div>
            <div>
              <div className="text-[12px] text-white/80">{s.title}</div>
              {s.notes ? <div className="text-[11px] text-white/40">{s.notes}</div> : null}
            </div>
            <div className="text-[12px]">
              <span
                className={
                  s.status === 'done'
                    ? 'text-[rgba(var(--g-accent),0.9)]'
                    : s.status === 'wip'
                      ? 'text-amber-200'
                      : 'text-white/40'
                }
              >
                {s.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={() => setInspector({ type: 'connect' })}>Connect</Button>
        <Button variant="ghost" onClick={() => setInspector({ type: 'compose' })}>
          Compose
        </Button>
        <Button variant="ghost" onClick={() => setInspector({ type: 'settings' })}>
          Settings
        </Button>
      </div>
    </div>
  );
}
