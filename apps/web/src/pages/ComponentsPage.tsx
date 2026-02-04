import React from 'react';
import {
  ActionPanel,
  AvatarButton,
  BodyText,
  Button,
  Caption,
  DateField,
  Heading,
  InfoCard,
  InputField,
  Kicker,
  MediaCard,
  Skeleton,
  StatCard,
  TextAreaField,
  UploadButton,
  UserCard,
} from '@ghostodon/ui';
import SurfaceOverlay from '../components/SurfaceOverlay';

type ShowcaseSectionProps = {
  title: string;
  description: string;
  preview: React.ReactNode;
  code: string;
};

function ShowcaseSection(props: ShowcaseSectionProps) {
  return (
    <section className="ghost-card relative overflow-hidden p-4">
      <SurfaceOverlay />
      <div className="flex flex-col gap-3">
        <div>
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[rgba(var(--g-accent),0.92)]">
            {props.title}
          </div>
          <div className="mt-2 text-[13px] text-white/65">{props.description}</div>
        </div>
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
          <div className="ghost-card relative overflow-hidden p-3">
            <SurfaceOverlay />
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/50">Live preview</div>
            <div className="mt-3">{props.preview}</div>
          </div>
          <div className="ghost-card relative overflow-hidden p-3">
            <SurfaceOverlay />
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/50">Code example</div>
            <pre className="mt-3 whitespace-pre-wrap rounded-[var(--g-radius)] border border-white/10 bg-black/30 p-3 text-[12px] text-white/70">
              <code>{props.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ComponentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-[13px] font-black uppercase tracking-[0.22em] text-white/85">
          Component showcase
        </div>
        <div className="mt-1 text-[13px] text-white/55">
          Modern, brutal surfaces with clear status, hover color, and fast scanning.
        </div>
      </div>

      <ShowcaseSection
        title="Info card"
        description="A reusable card that supports title, status chip, and hover color shifts."
        preview={
          <div className="grid gap-3 md:grid-cols-2">
            <InfoCard
              title="Signal"
              status="Live"
              tone="success"
              hoverTone="warning"
              content="Track the hottest tags and conversations as they spike."
            />
            <InfoCard
              title="Ops"
              status="Queued"
              tone="warning"
              hoverTone="default"
              content="Monitor new mentions, triage replies, and batch actions."
            />
          </div>
        }
        code={`<InfoCard\n  title=\"Signal\"\n  status=\"Live\"\n  tone=\"success\"\n  hoverTone=\"warning\"\n  content=\"Track the hottest tags and conversations as they spike.\"\n/>`}
      />

      <ShowcaseSection
        title="Action panel"
        description="Panels that organize a title, description, and action cluster for quick flows."
        preview={
          <ActionPanel
            title="Compose burst"
            description="Queue drafts, add media, and schedule a blast."
            actions={
              <>
                <Button size="sm">New</Button>
                <Button size="sm" variant="ghost">Queue</Button>
              </>
            }
            onClick={() => {}}
          >
            Start with a quick draft, then stack edits before publishing.
          </ActionPanel>
        }
        code={`<ActionPanel\n  title=\"Compose burst\"\n  description=\"Queue drafts, add media, and schedule a blast.\"\n  actions={(\n    <>\n      <Button size=\"sm\">New</Button>\n      <Button size=\"sm\" variant=\"ghost\">Queue</Button>\n    </>\n  )}\n>\n  Start with a quick draft, then stack edits before publishing.\n</ActionPanel>`}
      />

      <ShowcaseSection
        title="Media card"
        description="Image-first cards for highlights, screenshots, or artwork."
        preview={
          <div className="grid gap-3 md:grid-cols-2">
            <MediaCard
              title="Artifact drop"
              description="New render batch ready for review."
              imageUrl="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
              meta="Updated 2m ago"
              onClick={() => {}}
            />
            <MediaCard
              title="Studio log"
              description="Behind the scenes from today’s session."
              imageUrl="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80"
              meta="Pinned"
              onClick={() => {}}
            />
          </div>
        }
        code={`<MediaCard\n  title=\"Artifact drop\"\n  description=\"New render batch ready for review.\"\n  imageUrl=\"https://...\"\n  meta=\"Updated 2m ago\"\n/>`}
      />

      <ShowcaseSection
        title="Stat cards"
        description="Compact metric tiles for dashboards and quick reads."
        preview={
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Mentions" value="128" helper="Last 24h" tone="success" onClick={() => {}} />
            <StatCard label="Replies" value="42" helper="Pending" tone="warning" onClick={() => {}} />
            <StatCard label="Flags" value="3" helper="Review" tone="danger" onClick={() => {}} />
          </div>
        }
        code={`<StatCard label=\"Mentions\" value=\"128\" helper=\"Last 24h\" tone=\"success\" />`}
      />

      <ShowcaseSection
        title="Action cluster"
        description="Primary and ghost buttons for quick actions, pairing with card surfaces."
        preview={
          <div className="flex flex-wrap items-center gap-2">
            <Button>Primary</Button>
            <Button variant="ghost">Secondary</Button>
            <Button variant="danger">Danger</Button>
          </div>
        }
        code={`<Button>Primary</Button>\n<Button variant=\"ghost\">Secondary</Button>\n<Button variant=\"danger\">Danger</Button>`}
      />

      <ShowcaseSection
        title="Field inputs"
        description="Standardized input field, textarea, and date picker patterns."
        preview={
          <div className="grid gap-3 md:grid-cols-2">
            <InputField
              label="Instance"
              hint="Use https://<host>"
              inputProps={{ placeholder: 'mastodon.social' }}
            />
            <DateField
              label="Schedule"
              hint="Pick a publish date"
              inputProps={{ defaultValue: '2024-01-01' }}
            />
            <TextAreaField
              label="Message"
              hint="Max 500 chars"
              textareaProps={{ placeholder: 'Write your post…' }}
              className="md:col-span-2"
            />
          </div>
        }
        code={`<InputField label=\"Instance\" inputProps={{ placeholder: \"mastodon.social\" }} />\n<DateField label=\"Schedule\" />\n<TextAreaField label=\"Message\" />`}
      />

      <ShowcaseSection
        title="Upload button"
        description="File upload button with standard label + hint."
        preview={
          <UploadButton label="Upload media" hint="PNG, JPG up to 20MB" onFiles={() => {}} />
        }
        code={`<UploadButton label=\"Upload media\" hint=\"PNG, JPG up to 20MB\" onFiles={(files) => {}} />`}
      />

      <ShowcaseSection
        title="Skeletons"
        description="Loading placeholders for cards and rows."
        preview={
          <div className="grid gap-3 md:grid-cols-2">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-10 md:col-span-2" />
          </div>
        }
        code={`<Skeleton className=\"h-24\" />`}
      />

      <ShowcaseSection
        title="Avatar button"
        description="Clickable avatar row with label + meta for quick navigation."
        preview={
          <AvatarButton
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
            label="Avery Doe"
            meta="Online now"
            onClick={() => {}}
          />
        }
        code={`<AvatarButton src=\"https://...\" label=\"Avery Doe\" meta=\"Online now\" />`}
      />

      <ShowcaseSection
        title="User card"
        description="Profile summary card with action links."
        preview={
          <UserCard
            name="Orion Smith"
            handle="orion"
            avatarUrl="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
            summary="Design systems lead. Shipping accessible UI kits."
            actions={
              <>
                <Button size="sm">Follow</Button>
                <Button size="sm" variant="ghost">Message</Button>
              </>
            }
            onClick={() => {}}
          />
        }
        code={`<UserCard name=\"Orion Smith\" handle=\"orion\" summary=\"Design systems lead.\" actions={(<Button>Follow</Button>)} />`}
      />

      <ShowcaseSection
        title="Typography"
        description="Special typography helpers for headings, kickers, body text, and captions."
        preview={
          <div className="flex flex-col gap-3">
            <Kicker>System UI</Kicker>
            <Heading size="xl">Ghostodon Command Center</Heading>
            <BodyText>
              Modern brutalist typography for dashboards, timelines, and control panels.
            </BodyText>
            <Caption>Caption text for metadata and annotations.</Caption>
          </div>
        }
        code={`<Kicker>System UI</Kicker>\n<Heading size=\"xl\">Ghostodon Command Center</Heading>\n<BodyText>Modern brutalist typography.</BodyText>\n<Caption>Caption text</Caption>`}
      />
    </div>
  );
}
