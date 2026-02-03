import React, { useState } from 'react';
import { Button, Column, Container, Row } from '@ghostodon/ui';
import SurfaceOverlay from '../components/SurfaceOverlay';

export default function LayoutPrimitivesPage() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <Container className="h-full">
      <div className="ghost-card relative overflow-hidden p-4">
        <SurfaceOverlay />
        <div className="text-[12px] font-black uppercase tracking-[0.2em] text-white/90">
          Layout primitives
        </div>
        <div className="mt-2 text-[13px] text-white/65">
          Container + Row + Column with resizable and collapsible sidebars.
        </div>
      </div>

      <Row className="mt-3 min-h-0">
        {leftOpen ? (
          <Column
            resizable
            width={220}
            minWidth={180}
            maxWidth={320}
            className="ghost-card relative overflow-hidden p-3"
          >
            <SurfaceOverlay />
            <button
              type="button"
              className="ghost-btn ghost-btn--ghost absolute right-2 top-2 h-8 px-3 text-[10px]"
              onClick={() => setLeftOpen(false)}
            >
              Close
            </button>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">Left column</div>
            <div className="mt-3 space-y-2 text-[12px] text-white/60">
              <div>Resizable</div>
              <div>Collapsible</div>
              <div>List of items</div>
            </div>
          </Column>
        ) : (
          <div className="ghost-card relative flex items-start p-2">
            <button
              type="button"
              className="ghost-btn ghost-btn--ghost h-8 px-3 text-[10px]"
              onClick={() => setLeftOpen(true)}
            >
              Open
            </button>
          </div>
        )}

        <Column className="flex-1 min-w-0">
          <div className="ghost-card relative overflow-hidden p-4">
            <SurfaceOverlay />
            <div className="text-[12px] font-black uppercase tracking-[0.2em] text-white/90">
              Center column
            </div>
            <div className="mt-3 text-[13px] text-white/65">
              This column grows to fill available space.
            </div>
          </div>
        </Column>

        {rightOpen ? (
          <Column
            resizable
            width={220}
            minWidth={180}
            maxWidth={320}
            className="ghost-card relative overflow-hidden p-3"
          >
            <SurfaceOverlay />
            <button
              type="button"
              className="ghost-btn ghost-btn--ghost absolute right-2 top-2 h-8 px-3 text-[10px]"
              onClick={() => setRightOpen(false)}
            >
              Close
            </button>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">Right column</div>
            <div className="mt-3 space-y-2 text-[12px] text-white/60">
              <div>Status panel</div>
              <div>Notifications</div>
              <div>Filters</div>
            </div>
          </Column>
        ) : (
          <div className="flex items-start gap-2">
            <div className="ghost-card relative flex items-start p-2">
              <button
                type="button"
                className="ghost-btn ghost-btn--ghost h-8 px-3 text-[10px]"
                onClick={() => setRightOpen(true)}
              >
                Open
              </button>
            </div>
          </div>
        )}
      </Row>
    </Container>
  );
}
