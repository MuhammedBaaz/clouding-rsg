/**
 * Selection List Picker Styles
 *
 * Card-style selectable rows with icon, title/subtitle, and badge.
 * Visual design ported from the AAM location picker.
 *
 * @module rich-components/selection-list-picker/styles
 */

export function getSelectionListPickerStyles(): string {
  return `
.slp-picker {
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 14px;
  color: var(--text-color, #1F2937);
  padding: 16px;
  width: 100%;
}

.slp-title {
  font-size: 16px;
  color: #6B7280;
  margin: 0 0 12px;
}

.slp-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slp-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: #F9FAFB;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  font-size: 14px;
  color: var(--text-color, #1F2937);
  transition: background 0.15s;
  width: 100%;
}

.slp-item:hover:not(:disabled) {
  background: #F3F4F6;
}

.slp-item--selected {
  background: #1F2937;
  color: #fff;
}

.slp-item--selected:hover:not(:disabled) {
  background: #1F2937;
}

.slp-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slp-item--selected:disabled {
  opacity: 1;
}

.slp-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  opacity: 0.5;
}

.slp-item--selected .slp-icon {
  opacity: 0.7;
}

.slp-content {
  flex: 1;
  min-width: 0;
}

.slp-item-title {
  font-weight: 600;
  font-size: 14px;
  margin: 0;
}

.slp-subtitle {
  font-size: 13px;
  color: #6B7280;
  margin: 2px 0 0;
}

.slp-item--selected .slp-subtitle {
  color: rgba(255, 255, 255, 0.7);
}

.slp-badge {
  flex-shrink: 0;
  font-size: 13px;
  color: #9CA3AF;
  white-space: nowrap;
}

.slp-item--selected .slp-badge {
  color: rgba(255, 255, 255, 0.6);
}
`;
}
