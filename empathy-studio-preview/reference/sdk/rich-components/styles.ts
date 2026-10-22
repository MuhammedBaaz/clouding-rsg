/**
 * Rich Components CSS Styles
 *
 * CSS strings for all rich component renderers.
 * Injected into Shadow DOM alongside existing widget styles.
 *
 * @module rich-components/styles
 */

/** Shared base styles for all rich components. */
export const RICH_BASE_STYLES = `
.rc-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 100%;
}

.rc-disabled {
  pointer-events: none;
  opacity: 0.6;
}

.rc-selected {
  outline: 2px solid var(--primary-color, #6C63FF);
  outline-offset: -2px;
}

.rc-text-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rc-fallback {
  color: var(--cw-text-secondary, #888);
  font-style: italic;
  font-size: 13px;
}

.rc-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: #9CA3AF;
  font-size: 13px;
  font-style: italic;
}

.rc-loading::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #E5E7EB;
  border-top-color: #9CA3AF;
  border-radius: 50%;
  animation: rc-spin 0.7s linear infinite;
}

.rc-loading::after {
  content: 'Loading component…';
}

@keyframes rc-spin {
  to { transform: rotate(360deg); }
}

.rc-load-failed {
  color: var(--cw-text-secondary, #888);
  font-style: italic;
  font-size: 13px;
  padding: 8px 0;
}
`;

/** Buttons component styles. */
export const RICH_BUTTONS_STYLES = `
.rc-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.rc-buttons-text {
  font-size: 14px;
  line-height: 1.4;
  color: var(--cw-text, #1a1a1a);
}

.rc-buttons-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.rc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: 1px solid var(--primary-color, #6C63FF);
  border-radius: 18px;
  background: transparent;
  color: var(--primary-color, #6C63FF);
  font-size: 13px;
  font-family: inherit;
  line-height: 1.3;
  cursor: pointer;
  transition: background-color 0.15s ease, opacity 0.15s ease;
  max-width: 100%;
  text-align: center;
}

.rc-btn:hover:not(:disabled) {
  background: var(--primary-color, #6C63FF);
  color: #fff;
}

.rc-btn:active:not(:disabled) {
  opacity: 0.8;
}

.rc-btn:disabled {
  cursor: default;
  opacity: 0.5;
}

.rc-btn.rc-selected {
  background: var(--primary-color, #6C63FF);
  color: #fff;
  opacity: 1;
}
`;

/** Carousel component styles. */
export const RICH_CAROUSEL_STYLES = `
.rc-carousel {
  position: relative;
  width: 100%;
  max-width: 100%;
}

.rc-carousel-title {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #9CA3AF;
  margin: 0 0 6px;
}

.rc-carousel-track {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 4px 2px 8px;
}

.rc-carousel-track::-webkit-scrollbar {
  display: none;
}

.rc-carousel-card {
  min-width: 0;
  scroll-snap-align: start;
  transition: box-shadow 0.15s;
}

.rc-carousel-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.rc-carousel-card .cc-btn {
  padding: 8px 12px;
  font-size: 12px;
}

.rc-carousel-card .cc-body {
  padding: 12px;
}

.rc-carousel-card .cc-buttons {
  padding: 0 12px 12px;
}

.rc-carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--cw-border, #e5e5e5);
  background: var(--cw-bg, #fff);
  color: var(--cw-text, #1a1a1a);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1;
}

.rc-carousel:hover .rc-carousel-arrow {
  opacity: 1;
}

.rc-carousel-arrow:hover {
  background: var(--cw-hover-bg, #f7f7f9);
}

.rc-carousel-arrow--prev {
  left: -4px;
}

.rc-carousel-arrow--next {
  right: -4px;
}
`;
