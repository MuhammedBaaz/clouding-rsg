/**
 * Booking Confirmation Card Styles
 *
 * @module aam/booking-confirmation/styles
 */

export function getBookingConfirmationStyles(): string {
  return `
.bc-card {
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 14px;
  color: var(--text-color, #0F0F0F);
  border: 1.5px solid var(--border-color, #E5E7EB);
  border-radius: 14px;
  overflow: hidden;
  width: 100%;
  background: #fff;
}

/* Header image */
.bc-header {
  position: relative;
  width: 100%;
  height: 100px;
  overflow: hidden;
}

.bc-header img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Badge */
.bc-badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 20px;
  background: rgba(15, 15, 15, 0.6);
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
}

.bc-header .bc-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
}

/* Body */
.bc-body {
  padding: 10px 16px;
}

.bc-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.bc-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.bc-subtitle {
  font-size: 12px;
  color: #0F0F0F;
  margin: 0 0 12px;
}

/* Detail card container */
.bc-details {
  overflow: hidden;
  margin-bottom: 12px;
}

/* Primary + Secondary side by side */
.bc-detail-pair {
  display: flex;
  margin-bottom: 8px;
  gap: 8px;
}

.bc-detail-pair .bc-detail-row {
  flex: 1;
  border-bottom: none;
}

/* Individual detail row */
.bc-detail-row {
  padding: 12px 14px;
  border-bottom: 1px solid #E5E7EB;
  background-color: #F9FAFB;
  border-radius: 10px;
}

.bc-detail-row:last-child {
  border-bottom: none;
}

.bc-detail-label {
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9CA3AF;
}

.bc-detail-value {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.bc-detail-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 2px;
  opacity: 0.5;
}

.bc-detail-subtitle {
  font-size: 13px;
  color: var(--text-color, #1F2937);
  margin: 0;
  white-space: pre-line;
  line-height: 1.4;
}

.bc-detail-subtitle strong {
  font-weight: 600;
  display: block;
}

/* Instructions */
.bc-instructions {
  font-size: 13px;
  color: #6B7280;
  margin: 0 0 14px;
  padding: 0 4px;
}

/* Action buttons */
.bc-actions {
  display: flex;
  gap: 8px;
}

.bc-btn {
  flex: 1;
  padding: 11px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.bc-btn:hover {
  opacity: 0.85;
}

.bc-btn--primary {
  background: var(--primary-color, #0a6e5c);
  color: #fff;
  border: none;
}

.bc-btn--secondary {
  background: transparent;
  color: var(--text-color, #1F2937);
  border: 1.5px solid var(--border-color, #D1D5DB);
}

.bc-btn-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.bc-btn--full {
  width: 100%;
}
`;
}
