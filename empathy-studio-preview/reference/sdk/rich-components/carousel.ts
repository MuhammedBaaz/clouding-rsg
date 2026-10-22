/**
 * Carousel Renderer
 *
 * Renders a horizontal scroll container of carousel cards with CSS scroll-snap.
 * A single-card payload renders as a standalone card. Desktop users get
 * arrow buttons; mobile users swipe natively.
 *
 * @module rich-components/carousel
 */

import type { CarouselPayload, SelectCallback, RichSelection } from './types';
import { renderCarouselCard } from './carousel-card';

/** Returns scroll distance based on the first card's width + gap. */
function getScrollStep(track: HTMLElement): number {
  const firstCard = track.querySelector<HTMLElement>('.rc-carousel-card');
  return firstCard ? firstCard.offsetWidth + 12 : 260; // 12px = gap
}

/**
 * Render a carousel component.
 *
 * @param payload - Carousel payload (cards array)
 * @param onSelect - Callback when a card button is tapped
 * @param selection - Pre-existing selection state (for re-rendering)
 * @returns Carousel container element (or standalone card for 1-card payloads)
 */
export function renderCarousel(
  payload: CarouselPayload,
  onSelect: SelectCallback,
  selection?: RichSelection,
  wheelScroll?: boolean,
  defaultVisibleCount?: number,
): HTMLElement {
  // Single card → render as standalone card (no carousel wrapper)
  if (payload.cards.length === 1) {
    const card = payload.cards[0];
    if (card) {
      return renderCarouselCard(card, onSelect, selection);
    }
  }

  // Empty cards → return empty container
  if (payload.cards.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'rc-carousel';
    return empty;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'rc-carousel';

  // Optional title
  if (payload.title) {
    const titleEl = document.createElement('p');
    titleEl.className = 'rc-carousel-title';
    titleEl.textContent = payload.title;
    wrapper.appendChild(titleEl);
  }

  const gap = 12; // px, matches CSS gap
  // Minimum readable card width — title + price + a couple of bullets need
  // roughly this much space before content stacks awkwardly. Used as the
  // default-mode floor when no explicit visible_count is provided.
  const MIN_CARD_PX = 320;
  const explicitCount = payload.visible_count ?? defaultVisibleCount;
  const hasExplicit = explicitCount != null;

  // Scroll track with snap
  const track = document.createElement('div');
  track.className = 'rc-carousel-track';

  payload.cards.forEach((card, cardIndex) => {
    // Only pass selection to the card that was interacted with
    const cardSelection = selection?.cardIndex === cardIndex ? selection : undefined;

    // Wrap onSelect to include cardIndex
    const cardOnSelect: SelectCallback = (value, buttonIndex) => {
      onSelect(value, buttonIndex, cardIndex);
    };

    const cardEl = renderCarouselCard(card, cardOnSelect, cardSelection);
    cardEl.classList.add('rc-carousel-card');
    track.appendChild(cardEl);
  });

  // Recompute card flex-basis on every resize. When visible_count is set
  // explicitly, honor it as a hard count. When unset, derive from container
  // width using MIN_CARD_PX as the floor — narrow widgets get fewer, wider
  // cards; wide widgets get more.
  function applyCardWidths(): void {
    const trackWidth = track.clientWidth;
    const visibleCount = hasExplicit
      ? Math.max(1, Math.floor(explicitCount))
      : trackWidth > 0
        ? Math.max(1, Math.min(payload.cards.length, Math.floor(trackWidth / MIN_CARD_PX)))
        : 1;
    const peekPercent = visibleCount === 1 ? 30 : 15;
    const cardWidth = `calc((100% - ${String(gap * visibleCount)}px) / ${String(visibleCount)} - ${String(peekPercent / visibleCount)}%)`;
    const cards = track.querySelectorAll<HTMLElement>('.rc-carousel-card');
    cards.forEach((cardEl) => {
      cardEl.style.flex = `0 0 ${cardWidth}`;
    });
  }
  applyCardWidths();
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => { applyCardWidths(); });
    ro.observe(track);
  }

  // Convert vertical mouse wheel to horizontal scroll (opt-in via config).
  if (wheelScroll) {
  let snapTimer = 0;
  track.addEventListener('wheel', (ev: WheelEvent) => {
    if (ev.deltaY === 0) return;
    ev.preventDefault();
    track.style.scrollSnapType = 'none';
    track.scrollLeft += ev.deltaY;
    window.clearTimeout(snapTimer);
    snapTimer = window.setTimeout(() => {
      track.style.scrollSnapType = '';
    }, 150);
  }, { passive: false });
  }

  wrapper.appendChild(track);

  // Arrow buttons
  const prevBtn = document.createElement('button');
  prevBtn.className = 'rc-carousel-arrow rc-carousel-arrow--prev';
  prevBtn.setAttribute('type', 'button');
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '&#8249;';
  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollStep(track), behavior: 'smooth' });
  });

  const nextBtn = document.createElement('button');
  nextBtn.className = 'rc-carousel-arrow rc-carousel-arrow--next';
  nextBtn.setAttribute('type', 'button');
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '&#8250;';
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: getScrollStep(track), behavior: 'smooth' });
  });

  wrapper.appendChild(prevBtn);
  wrapper.appendChild(nextBtn);

  return wrapper;
}
