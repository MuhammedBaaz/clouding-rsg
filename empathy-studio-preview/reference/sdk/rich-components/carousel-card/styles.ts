/**
 * Carousel Card Styles
 *
 * Product/content card with media, badge, title, price, markdown description,
 * and priority-based button layout.
 *
 * @module rich-components/carousel-card/styles
 */

export function getCarouselCardStyles(): string {
  return `
.cc-card {
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 14px;
  color: var(--text-color, #1F2937);
  border: 1.5px solid var(--border-color, #E5E7EB);
  border-radius: 14px;
  overflow: hidden;
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
}

/* Media area */
.cc-media {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #F3F4F6;
}

.cc-media img,
.cc-media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Badge */
.cc-badge {
  position: absolute;
  padding: 4px 12px;
  border-radius: 16px;
  background: rgba(55, 65, 81, 0.8);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  z-index: 1;
  white-space: nowrap;
}

.cc-badge--top-left {
  top: 10px;
  left: 10px;
}

.cc-badge--top-right {
  top: 10px;
  right: 10px;
}

.cc-badge--bottom-left {
  bottom: 10px;
  left: 10px;
}

.cc-badge--bottom-right {
  bottom: 10px;
  right: 10px;
}

/* Badge inline (when no media) */
.cc-badge--inline {
  position: static;
  display: inline-block;
  margin-left: 8px;
  vertical-align: middle;
}

/* Body */
.cc-body {
  padding: 16px;
}

.cc-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cc-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
}

.cc-subtitle {
  font-size: 16px;
  color: #364153;
  font-weight: 700;
  line-height: 20px;
  margin: 4px 0 0;
}

.cc-description {
  font-size: 14px;
  line-height: 1.6;
  margin: 12px 0 0;
  color: var(--text-color, #374151);
}

.cc-description strong {
  font-weight: 700;
  display: block;
  margin-top: 8px;
}

.cc-description ul {
  margin: 4px 0 0;
  padding-left: 18px;
}

.cc-description li {
  margin: 2px 0;
}

/* Buttons — pinned to bottom of card */
.cc-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px 16px;
  margin-top: auto;
}

.cc-btn-row {
  display: flex;
  gap: 8px;
}

.cc-btn {
  padding: 12px 16px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;
  text-align: center;
  flex: 1;
}

.cc-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.cc-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cc-btn--primary {
  background: var(--primary-color, #0a6e5c);
  color: #fff;
  border: none;
}

.cc-btn--secondary,
.cc-btn--tertiary {
  background: transparent;
  color: var(--text-color, #374151);
  border: 1.5px solid var(--border-color, #D1D5DB);
}

.cc-btn--selected {
  background: #1F2937;
  color: #fff;
  border-color: #1F2937;
}

.cc-btn--selected:disabled {
  opacity: 1;
}
`;
}
