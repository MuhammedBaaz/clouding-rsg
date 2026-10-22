/**
 * Booking Confirmation Card Component
 *
 * Renders a structured booking summary with optional header image,
 * badge, title/subtitle, up to 3 detail rows with icons, instructions,
 * and up to 2 action buttons (non-locking).
 *
 * @module aam/booking-confirmation
 */

import { getBookingConfirmationStyles } from './styles';
import { injectStyles } from '../../aam/shared/inject-styles';
import type { IconResolver } from '../../icons/icon-resolver';

// =============================================================================
// Types
// =============================================================================

/* eslint-disable @typescript-eslint/naming-convention -- matches server payload */
interface BookingConfirmationPayload {
  readonly image_url?: string;
  readonly badge_text?: string;
  readonly main_title: string;
  readonly subtitle?: string;
  readonly primary_card_title: string;
  readonly primary_card_subtitle?: string;
  readonly primary_card_icon?: string;
  readonly secondary_card_title?: string;
  readonly secondary_card_subtitle?: string;
  readonly secondary_card_icon?: string;
  readonly tertiary_card_title?: string;
  readonly tertiary_card_subtitle?: string;
  readonly tertiary_card_icon?: string;
  readonly instructions?: string;
  readonly primary_button_label: string;
  readonly primary_button_payload?: string;
  readonly primary_button_icon?: string;
  readonly secondary_button_label?: string;
  readonly secondary_button_payload?: string;
  readonly secondary_button_icon?: string;
}
/* eslint-enable @typescript-eslint/naming-convention */

type SelectCallback = (value: string, index: number, cardIndex?: number) => void;

// =============================================================================
// Helpers
// =============================================================================

function el(tag: string, className?: string, text?: string): HTMLElement {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function createDetailRow(
  title: string,
  subtitle: string | undefined,
  iconUrl: string | undefined,
): HTMLElement {
  const row = el('div', 'bc-detail-row');

  // Label pill on top
  row.appendChild(el('p', 'bc-detail-label', title));

  // Icon + subtitle value below
  if (subtitle) {
    const valueRow = el('div', 'bc-detail-value');

    if (iconUrl) {
      const icon = document.createElement('img');
      icon.className = 'bc-detail-icon';
      icon.src = iconUrl;
      icon.alt = '';
      icon.addEventListener('error', () => { icon.style.display = 'none'; });
      valueRow.appendChild(icon);
    }

    valueRow.appendChild(el('p', 'bc-detail-subtitle', subtitle));
    row.appendChild(valueRow);
  }

  return row;
}

// =============================================================================
// Renderer
// =============================================================================

/**
 * Renders the booking confirmation card.
 *
 * @param payload - The component payload from the server
 * @param onSelect - Callback to send visitor message
 * @returns Root HTMLElement
 */
export function renderBookingConfirmation(
  payload: BookingConfirmationPayload,
  onSelect: SelectCallback,
  _selection?: unknown,
  iconResolver?: IconResolver,
): HTMLElement {
  const card = el('div', 'bc-card');

  injectStyles(card, 'data-bc-styles', getBookingConfirmationStyles);

  const hasImage = typeof payload.image_url === 'string' && payload.image_url.length > 0;

  // --- Header image with floating badge ---
  if (hasImage) {
    const header = el('div', 'bc-header');
    const img = document.createElement('img');
    img.src = payload.image_url!; // eslint-disable-line @typescript-eslint/no-non-null-assertion -- checked above
    img.alt = '';
    img.addEventListener('error', () => { header.style.display = 'none'; });
    header.appendChild(img);

    if (payload.badge_text) {
      header.appendChild(el('span', 'bc-badge', payload.badge_text));
    }

    card.appendChild(header);
  }

  // --- Body ---
  const body = el('div', 'bc-body');

  // Title row (with inline badge if no image)
  const titleRow = el('div', 'bc-title-row');
  titleRow.appendChild(el('h3', 'bc-title', payload.main_title));

  if (!hasImage && payload.badge_text) {
    titleRow.appendChild(el('span', 'bc-badge', payload.badge_text));
  }

  body.appendChild(titleRow);

  // Subtitle
  if (payload.subtitle) {
    body.appendChild(el('p', 'bc-subtitle', payload.subtitle));
  }

  // --- Detail rows ---
  const hasPrimary = typeof payload.primary_card_title === 'string' && payload.primary_card_title.length > 0;
  const hasSecondaryCard = typeof payload.secondary_card_title === 'string' && payload.secondary_card_title.length > 0;
  const hasTertiary = typeof payload.tertiary_card_title === 'string' && payload.tertiary_card_title.length > 0;

  if (hasPrimary || hasSecondaryCard || hasTertiary) {
    const details = el('div', 'bc-details');

    // Primary + Secondary side by side (if both exist)
    if (hasPrimary && hasSecondaryCard) {
      const pair = el('div', 'bc-detail-pair');
      pair.appendChild(createDetailRow(payload.primary_card_title, payload.primary_card_subtitle, payload.primary_card_icon));
      pair.appendChild(createDetailRow(payload.secondary_card_title ?? '', payload.secondary_card_subtitle, payload.secondary_card_icon));
      details.appendChild(pair);
    } else if (hasPrimary) {
      details.appendChild(createDetailRow(payload.primary_card_title, payload.primary_card_subtitle, payload.primary_card_icon));
    }

    // Tertiary full width below
    if (hasTertiary) {
      details.appendChild(createDetailRow(payload.tertiary_card_title ?? '', payload.tertiary_card_subtitle, payload.tertiary_card_icon));
    }

    body.appendChild(details);
  }

  // --- Instructions ---
  if (payload.instructions) {
    body.appendChild(el('p', 'bc-instructions', payload.instructions));
  }

  // --- Action buttons ---
  const actions = el('div', 'bc-actions');
  const hasSecondary = typeof payload.secondary_button_label === 'string' && payload.secondary_button_label.length > 0;

  if (hasSecondary) {
    const secBtn = document.createElement('button');
    secBtn.type = 'button';
    secBtn.className = 'bc-btn bc-btn--secondary';
    secBtn.textContent = payload.secondary_button_label ?? '';
    if (payload.secondary_button_icon && iconResolver) {
      void iconResolver.resolveIcon(payload.secondary_button_icon, 14).then((svg) => {
        if (svg) { svg.classList.add('bc-btn-icon'); secBtn.appendChild(svg); }
      });
    }
    secBtn.addEventListener('click', () => {
      const value = payload.secondary_button_payload ?? payload.secondary_button_label!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
      onSelect(value, 1);
    });
    actions.appendChild(secBtn);
  }

  const priBtn = document.createElement('button');
  priBtn.type = 'button';
  priBtn.className = `bc-btn bc-btn--primary${!hasSecondary ? ' bc-btn--full' : ''}`;
  priBtn.textContent = payload.primary_button_label;
  if (payload.primary_button_icon && iconResolver) {
    void iconResolver.resolveIcon(payload.primary_button_icon, 14).then((svg) => {
      if (svg) { svg.classList.add('bc-btn-icon'); priBtn.prepend(svg); }
    });
  }
  priBtn.addEventListener('click', () => {
    const value = payload.primary_button_payload ?? payload.primary_button_label;
    onSelect(value, 0);
  });
  actions.appendChild(priBtn);

  body.appendChild(actions);
  card.appendChild(body);

  return card;
}
