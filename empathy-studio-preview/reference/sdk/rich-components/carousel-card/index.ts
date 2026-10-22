/**
 * Carousel Card Component
 *
 * Product/content card with optional media (image/video), badge, title,
 * price, markdown description, and up to 3 priority-based action buttons.
 *
 * @module rich-components/carousel-card
 */

import { getCarouselCardStyles } from './styles';
import { injectStyles } from '../../aam/shared/inject-styles';
import { parseMarkdown } from '../../markdown/parser';

// =============================================================================
// Types
// =============================================================================

/* eslint-disable @typescript-eslint/naming-convention */
export interface CarouselCardPayload {
  readonly image_url?: string;
  readonly badge_title?: string;
  readonly badge_position?: string;
  readonly main_title: string;
  readonly subtitle?: string;
  readonly description?: string;
  readonly lock_after_selection?: boolean;
  readonly primary_button_label?: string;
  readonly primary_button_payload?: string;
  readonly secondary_button_label?: string;
  readonly secondary_button_payload?: string;
  readonly tertiary_button_label?: string;
  readonly tertiary_button_payload?: string;
}
/* eslint-enable @typescript-eslint/naming-convention */

interface RichSelection {
  readonly index: number;
  readonly value: string;
  readonly cardIndex?: number;
}

type SelectCallback = (value: string, index: number, cardIndex?: number) => void;

// =============================================================================
// Helpers
// =============================================================================

const VALID_BADGE_POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

/** Check if a URL points to a video file. */
function isVideoUrl(url: string): boolean {
  const lower = url.toLowerCase().split('?')[0] ?? '';
  return lower.endsWith('.mp4') || lower.endsWith('.webm');
}

/** Normalize badge position to a valid value. */
function normalizeBadgePosition(position?: string): string {
  if (position && (VALID_BADGE_POSITIONS as readonly string[]).includes(position)) {
    return position;
  }
  return 'top-left';
}

// =============================================================================
// Renderer
// =============================================================================

/**
 * Renders the carousel card component.
 *
 * @param payload - The component payload from the server
 * @param onSelect - Callback to send visitor message
 * @param selection - Pre-existing selection state (for re-renders)
 * @returns Root HTMLElement
 */
export function renderCarouselCard(
  payload: CarouselCardPayload,
  onSelect: SelectCallback,
  selection?: RichSelection,
): HTMLElement {
  const card = document.createElement('div');
  card.className = 'cc-card';

  // Don't render without required title
  if (!payload.main_title || payload.main_title.length === 0) {
    return card;
  }

  injectStyles(card, 'data-cc-styles', getCarouselCardStyles);

  const mediaUrl = typeof payload.image_url === 'string' && payload.image_url.length > 0
    ? payload.image_url : null;

  // --- Media area (image or video) ---
  if (mediaUrl) {
    const media = document.createElement('div');
    media.className = 'cc-media';

    if (isVideoUrl(mediaUrl)) {
      const video = document.createElement('video');
      video.src = mediaUrl;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.addEventListener('error', () => { media.style.display = 'none'; });
      media.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = mediaUrl;
      img.alt = '';
      img.addEventListener('error', () => { media.style.display = 'none'; });
      media.appendChild(img);
    }

    // Badge on media
    if (payload.badge_title) {
      const pos = normalizeBadgePosition(payload.badge_position);
      const badge = document.createElement('span');
      badge.className = `cc-badge cc-badge--${pos}`;
      badge.textContent = payload.badge_title;
      media.appendChild(badge);
    }

    card.appendChild(media);
  }

  // --- Body ---
  const body = document.createElement('div');
  body.className = 'cc-body';

  // Title row (with inline badge if no media)
  const titleRow = document.createElement('div');
  titleRow.className = 'cc-title-row';

  const title = document.createElement('h3');
  title.className = 'cc-title';
  title.dir = 'auto';
  title.textContent = payload.main_title;
  titleRow.appendChild(title);

  if (!mediaUrl && payload.badge_title) {
    const badge = document.createElement('span');
    badge.className = 'cc-badge cc-badge--inline';
    badge.textContent = payload.badge_title;
    titleRow.appendChild(badge);
  }

  body.appendChild(titleRow);

  // Subtitle (price)
  if (payload.subtitle) {
    const subtitle = document.createElement('p');
    subtitle.className = 'cc-subtitle';
    subtitle.dir = 'auto';
    subtitle.textContent = payload.subtitle;
    body.appendChild(subtitle);
  }

  // Description (markdown)
  if (payload.description) {
    const desc = document.createElement('div');
    desc.className = 'cc-description';
    desc.dir = 'auto';
    desc.innerHTML = parseMarkdown(payload.description);
    body.appendChild(desc);
  }

  card.appendChild(body);

  // --- Buttons ---
  const buttons: { title: string; value: string; type: 'primary' | 'secondary' | 'tertiary' }[] = [];

  if (payload.primary_button_label) {
    buttons.push({
      title: payload.primary_button_label,
      value: payload.primary_button_payload ?? payload.primary_button_label,
      type: 'primary',
    });
  }
  if (payload.secondary_button_label) {
    buttons.push({
      title: payload.secondary_button_label,
      value: payload.secondary_button_payload ?? payload.secondary_button_label,
      type: 'secondary',
    });
  }
  if (payload.tertiary_button_label) {
    buttons.push({
      title: payload.tertiary_button_label,
      value: payload.tertiary_button_payload ?? payload.tertiary_button_label,
      type: 'tertiary',
    });
  }

  if (buttons.length > 0) {
    const shouldLock = payload.lock_after_selection !== false;
    let locked = shouldLock && selection !== undefined;
    const allBtns: HTMLButtonElement[] = [];

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'cc-buttons';

    // Button index mapping: primary=0, secondary=1, tertiary=2
    const btnIndexMap: Record<string, number> = { primary: 0, secondary: 1, tertiary: 2 };

    const createBtn = (btn: typeof buttons[0]): HTMLButtonElement => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = `cc-btn cc-btn--${btn.type}`;
      el.textContent = btn.title;

      const idx = btnIndexMap[btn.type] ?? 0;

      if (locked) {
        el.disabled = true;
        if (selection?.index === idx) {
          el.classList.add('cc-btn--selected');
        }
      }

      el.addEventListener('click', () => {
        if (locked) return;
        onSelect(btn.value, idx);

        if (shouldLock) {
          locked = true;
          el.classList.add('cc-btn--selected');
          for (const button of allBtns) {
            button.disabled = true;
          }
        }
      });

      allBtns.push(el);
      return el;
    };

    const primary = buttons.find((btn) => btn.type === 'primary');
    const secondary = buttons.find((btn) => btn.type === 'secondary');
    const tertiary = buttons.find((btn) => btn.type === 'tertiary');

    // Top row: tertiary (left) + secondary (right) — only when 3 buttons
    if (tertiary && secondary) {
      const row = document.createElement('div');
      row.className = 'cc-btn-row';
      row.appendChild(createBtn(tertiary));
      row.appendChild(createBtn(secondary));
      buttonsContainer.appendChild(row);
    } else if (secondary) {
      // 2 buttons: secondary above primary
      buttonsContainer.appendChild(createBtn(secondary));
    }

    // Bottom: primary always full width
    if (primary) {
      buttonsContainer.appendChild(createBtn(primary));
    }

    card.appendChild(buttonsContainer);
  }

  return card;
}
