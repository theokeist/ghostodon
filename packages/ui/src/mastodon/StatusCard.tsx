import * as React from 'react';
import type { GStatus } from '@ghostodon/core';
import { cn } from '../util/cn';

export function StatusCard(props: {
  status: GStatus;
  selected?: boolean;
  onOpen?: () => void;
  /** Open the author's profile (usually in Inspector). Receives account id by default. */
  onProfile?: (acctOrId: string) => void;
  onReply?: () => void;
  onBoost?: () => void;
  onFav?: () => void;
  /** Story ring (synthetic stories) */
  hasStory?: boolean;
  /** Open story viewer */
  onStory?: () => void;
  /** Optional prefetch hook for comment preview context (called on hover/focus of the comments affordance). */
  onPrefetchComments?: () => void;
  /** Optional comment preview UI (lazy-loaded in the app layer). */
  commentPreview?: {
    /** Total replies count (if known). */
    count?: number;
    /** Whether preview is expanded. */
    open?: boolean;
    /** Loading state for preview. */
    loading?: boolean;
    /** Error message if preview failed. */
    error?: string;
    /** Preview reply items (usually first 1–2 descendants). */
    items?: Array<{
      id: string;
      createdAt?: string;
      account: { id?: string; acct: string; displayName?: string; avatar: string };
      contentHtml: string;
    }>;
  };
  /** Toggle comment preview open/close. */
  onToggleComments?: () => void;
  className?: string;
}) {
  const s = props.status.reblog ?? props.status;
  const rebloggedBy = props.status.reblog ? props.status.account : null;

  return (
    <article
      onClick={props.onOpen}
      className={cn(
        'ghost-status group relative overflow-hidden',
        props.selected ? 'ghost-status--selected' : null,
        props.className
      )}
    >
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
              'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1.5px)',
            backgroundSize: '18px 18px',
          }}
        />
        <div
          className="absolute -right-8 -top-8 h-20 w-20 rounded-full blur-2xl"
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

      <div className="relative z-10">
        {rebloggedBy ? (
          <div className="mb-2 text-[11px] text-white/40">
            Boosted by <span className="text-white/60">@{rebloggedBy.acct}</span>
          </div>
        ) : null}

        <div className="flex gap-2">
          <button
            type="button"
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              if (props.hasStory && props.onStory) {
                props.onStory();
              } else {
                props.onProfile?.(s.account.id || s.account.acct);
              }
            }}
            title={`Open @${s.account.acct}`}
          >
            <img
              src={s.account.avatar}
              alt=""
              className={cn('ghost-avatar', props.hasStory ? 'ghost-avatar--story' : null)}
            />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <button
                type="button"
                className="ghost-name text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  if (props.hasStory && props.onStory) {
                    props.onStory();
                  } else {
                    props.onProfile?.(s.account.id || s.account.acct);
                  }
                }}
                title={`Open @${s.account.acct}`}
              >
                {s.account.displayName || s.account.acct}
              </button>
              <button
                type="button"
                className="ghost-handle"
                onClick={(e) => {
                  e.stopPropagation();
                  if (props.hasStory && props.onStory) {
                    props.onStory();
                  } else {
                    props.onProfile?.(s.account.id || s.account.acct);
                  }
                }}
                title={`Open @${s.account.acct}`}
              >
                @{s.account.acct}
              </button>
              <div className="ghost-time">
                {s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}
              </div>
            </div>

            {s.spoilerText ? (
              <div className="mt-1 rounded-[var(--g-radius)] border border-white/10 bg-black/20 px-2 py-1">
                <div className="text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">CW</div>
                <div className="text-[12px] text-white/70">{s.spoilerText}</div>
              </div>
            ) : null}

            <div
              className="ghost-content prose prose-invert prose-p:my-1 prose-a:text-[rgba(var(--g-accent),0.95)] max-w-none"
              // Mastodon content is server-sanitized HTML.
              dangerouslySetInnerHTML={{ __html: s.contentHtml }}
            />

            {s.media && s.media.length > 0 ? (
              <div
                className="ghost-media-grid"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {s.media.slice(0, 4).map((m) => (
                  <a
                    key={m.id}
                    href={m.url || m.previewUrl || '#'}
                    target={m.url || m.previewUrl ? '_blank' : undefined}
                    rel={m.url || m.previewUrl ? 'noreferrer' : undefined}
                    className="ghost-media-item"
                    title={m.description || 'Open media'}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={m.previewUrl || m.url || ''}
                      alt={m.description || ''}
                      loading="lazy"
                      className="ghost-media-img"
                    />
                  </a>
                ))}
              </div>
            ) : null}

          {/* Comment preview (Facebook-ish affordance).
              IMPORTANT: Only render this block if the app layer wires lazy loading.
              Otherwise users see a dead "View comments" affordance. */}
          {props.onToggleComments && typeof s.repliesCount === 'number' && s.repliesCount > 0 ? (
            <div
              className="mt-3 border-t border-white/10 pt-2"
              onClick={(e) => {
                // Prevent clicking comment area from opening the thread unless user clicks explicitly.
                e.stopPropagation();
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="text-[12px] font-bold uppercase tracking-[0.22em] text-white/60 hover:text-white"
                  onClick={() => props.onToggleComments?.()}
                  onMouseEnter={() => props.onPrefetchComments?.()}
                  onFocus={() => props.onPrefetchComments?.()}
                >
                  View comments <span className="text-white/35">({props.commentPreview?.count ?? s.repliesCount})</span>
                </button>
                <div className="text-[11px] text-white/35">
                  {props.commentPreview?.loading ? 'Loading…' : props.commentPreview?.open ? 'Open' : 'Closed'}
                </div>
              </div>

              {props.commentPreview?.open ? (
                <div className="mt-2 flex flex-col gap-2">
                  {props.commentPreview?.error ? (
                    <div className="ghost-card p-2 text-[12px]" style={{ borderColor: 'rgba(255,70,70,0.55)', background: 'rgba(255,70,70,0.10)' }}>
                      {props.commentPreview.error}
                    </div>
                  ) : null}

                  {props.commentPreview?.loading ? (
                    <div className="text-[12px] text-white/45">Fetching replies…</div>
                  ) : null}

                  {(props.commentPreview?.items ?? []).slice(0, 2).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className="w-full text-left rounded-[var(--g-radius)] border border-white/10 bg-black/20 px-2 py-2 hover:bg-black/30"
                      onClick={() => props.onOpen?.()}
                      title="Open thread"
                    >
                      <div className="flex items-start gap-2">
                        <img src={c.account.avatar} alt="" className="h-6 w-6 rounded-[var(--g-radius)] border border-white/10" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="truncate text-[12px] font-semibold text-white/75">
                              {c.account.displayName || c.account.acct}
                            </span>
                            <span className="truncate text-[11px] text-white/40">@{c.account.acct}</span>
                            <span className="ml-auto text-[10px] text-white/30">
                              {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                          <div
                            className="prose prose-invert prose-p:my-0.5 prose-a:text-[rgba(var(--g-accent),0.95)] max-w-none text-[12px] text-white/65"
                            dangerouslySetInnerHTML={{ __html: c.contentHtml }}
                          />
                        </div>
                      </div>
                    </button>
                  ))}

                  {props.commentPreview?.open && !props.commentPreview?.loading && (props.commentPreview?.items?.length ?? 0) === 0 ? (
                    <div className="text-[12px] text-white/40">No replies loaded yet.</div>
                  ) : null}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-[12px] font-bold uppercase tracking-[0.22em] text-[rgba(var(--g-accent),0.92)] hover:opacity-90"
                      onClick={() => props.onOpen?.()}
                    >
                      Open thread
                    </button>
                    <span className="text-[11px] text-white/30">•</span>
                    <button
                      type="button"
                      className="text-[12px] text-white/50 hover:text-white/75"
                      onClick={() => props.onToggleComments?.()}
                    >
                      Hide
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="ghost-status-footer">
            {/* Actions stay visually clean until hover/focus */}
            <div className="ghost-actions">
              <button
                className="ghost-action"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onReply?.();
                }}
              >
                Reply
              </button>
              <button
                className="ghost-action"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onBoost?.();
                }}
              >
                Boost
              </button>
              <button
                className="ghost-action"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onFav?.();
                }}
              >
                Fav
              </button>
            </div>
            <div className="ghost-metrics">
              {typeof s.repliesCount === 'number' ? <span>💬 {s.repliesCount}</span> : null}
              {typeof s.reblogsCount === 'number' ? <span>🔁 {s.reblogsCount}</span> : null}
              {typeof s.favouritesCount === 'number' ? <span>⭐ {s.favouritesCount}</span> : null}
            </div>
          </div>
        </div>
      </div>
      </div>
    </article>
  );
}
