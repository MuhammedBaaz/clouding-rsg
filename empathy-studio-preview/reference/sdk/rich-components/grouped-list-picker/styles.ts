/**
 * Grouped List Picker Styles
 *
 * Chip/pill buttons organized under group headings.
 * Visual design ported from the AAM time slot picker.
 *
 * @module rich-components/grouped-list-picker/styles
 */

export function getGroupedListPickerStyles(): string {
  return `
.glp-picker {
  font-family: var(--font-family, system-ui, sans-serif);
  font-size: 14px;
  color: var(--text-color, #1F2937);
  border: 1.5px solid var(--border-color, #E5E7EB);
  border-radius: 14px;
  padding: 16px;
  width: 100%;
}

.glp-title {
  font-size: 16px;
  color: #6B7280;
  margin: 0 0 12px;
}

.glp-group-heading {
  font-size: 14px;
  font-weight: 600;
  margin: 16px 0 8px;
}

.glp-group-heading:first-of-type {
  margin-top: 0;
}

.glp-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.glp-chip {
  padding: 8px 16px;
  border: 1.5px solid var(--border-color, #E5E7EB);
  border-radius: 20px;
  background: #fff;
  color: var(--text-color, #1F2937);
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.glp-chip:hover:not(:disabled) {
  background: #F3F4F6;
  border-color: #D1D5DB;
}

.glp-chip--selected {
  background: var(--primary-color, #0a6e5c);
  color: #fff;
  border-color: var(--primary-color, #0a6e5c);
}

.glp-chip--selected:hover:not(:disabled) {
  background: var(--primary-color, #0a6e5c);
}

.glp-chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.glp-chip--selected:disabled {
  opacity: 1;
}

.glp-send-btn {
  display: block;
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  border: none;
  border-radius: 24px;
  background: var(--primary-color, #0a6e5c);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;
}

.glp-send-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.glp-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;
}
