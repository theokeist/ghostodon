import React, { useState } from 'react';
import {
  AvatarButton,
  Button,
  Column,
  Container,
  Row,
  TextAreaField,
  UserCard,
} from '@ghostodon/ui';
import SurfaceOverlay from '../components/SurfaceOverlay';

export default function LayoutPage() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <Container className="h-full">
      <div className="mb-3 flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={() => setLeftOpen((v) => !v)}>
          {leftOpen ? 'Close left' : 'Open left'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setRightOpen((v) => !v)}>
          {rightOpen ? 'Close right' : 'Open right'}
        </Button>
      </div>

      <Row className="min-h-0">
        <Column
          resizable
          width={260}
          minWidth={200}
          maxWidth={360}
          collapsed={!leftOpen}
          className="ghost-card relative overflow-hidden p-3"
        >
          <SurfaceOverlay />
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">Components</div>
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="ghost">Overview</Button>
            <Button variant="ghost">Cards</Button>
            <Button variant="ghost">Inputs</Button>
            <Button variant="ghost">Layouts</Button>
          </div>
        </Column>

        <Column className="flex-1 min-w-0">
          <div className="flex flex-col gap-3">
            <div className="ghost-card relative overflow-hidden p-4">
              <SurfaceOverlay />
              <div className="text-[12px] font-black uppercase tracking-[0.2em] text-white/90">
                Avatar cards
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <AvatarButton
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
                  label="Avery Doe"
                  meta="Design lead"
                  onClick={() => {}}
                />
                <AvatarButton
                  src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=400&q=80"
                  label="Jules Park"
                  meta="Product"
                  onClick={() => {}}
                />
              </div>
            </div>

            <div className="ghost-card relative overflow-hidden p-4">
              <SurfaceOverlay />
              <div className="text-[12px] font-black uppercase tracking-[0.2em] text-white/90">
                My post
              </div>
              <div className="mt-3 grid gap-3">
                <TextAreaField label="Draft" textareaProps={{ placeholder: 'Share an update…' }} />
                <div className="flex items-center gap-2">
                  <Button>Post</Button>
                  <Button variant="ghost">Schedule</Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="text-[12px] font-black uppercase tracking-[0.2em] text-white/70">
                Latest posts
              </div>
              <UserCard
                name="Orion Smith"
                handle="orion"
                summary="Design systems lead. Shipping accessible UI kits."
                actions={
                  <>
                    <Button size="sm">Follow</Button>
                    <Button size="sm" variant="ghost">Message</Button>
                  </>
                }
                onClick={() => {}}
              />
              <UserCard
                name="Nova Lane"
                handle="nova"
                summary="Creative technologist. Building playful UI prototypes."
                actions={
                  <>
                    <Button size="sm">Follow</Button>
                    <Button size="sm" variant="ghost">Message</Button>
                  </>
                }
                onClick={() => {}}
              />
            </div>
          </div>
        </Column>

        <Column
          resizable
          width={260}
          minWidth={200}
          maxWidth={360}
          collapsed={!rightOpen}
          className="ghost-card relative overflow-hidden p-3"
        >
          <SurfaceOverlay />
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">Status</div>
          <div className="mt-3 flex flex-col gap-3">
            <div className="text-[12px] text-white/70">Live traffic</div>
            <div className="text-[11px] text-white/45">Mentions spiking in the last hour.</div>
            <Button size="sm">Open feed</Button>
          </div>
        </Column>
      </Row>
    </Container>
  );
}
