/**
 * Grouped List Picker Component
 *
 * Displays options as tappable chips organized under group headings.
 * Supports single-select (immediate send) and multi-select (toggle + send button).
 *
 * @module rich-components/grouped-list-picker
 */

import { getGroupedListPickerStyles } from './styles';
import { injectStyles } from '../../aam/shared/inject-styles';

// =============================================================================
// Types
// =============================================================================

/* eslint-disable @typescript-eslint/naming-convention */
interface OptionGroup {
  readonly title: string;
  readonly options: readonly string[];
}

interface GroupedListPickerPayload {
  readonly main_title?: string;
  readonly is_multiple_selection?: boolean;
  readonly lock_after_selection?: boolean;
  readonly send_button_label?: string;
  readonly groups: readonly OptionGroup[];
}
/* eslint-enable @typescript-eslint/naming-convention */

interface RichSelection {
  readonly index: number;
  readonly value: string;
  readonly cardIndex?: number;
}

type SelectCallback = (value: string, index: number, cardIndex?: number) => void;

// =============================================================================
// Renderer
// =============================================================================

/**
 * Renders the grouped list picker component.
 *
 * @param payload - The component payload from the server
 * @param onSelect - Callback to send visitor message
 * @param selection - Pre-existing selection state (for re-renders)
 * @returns Root HTMLElement
 */
export function renderGroupedListPicker(
  payload: GroupedListPickerPayload,
  onSelect: SelectCallback,
  selection?: RichSelection,
): HTMLElement {
  const root = document.createElement('div');
  root.className = 'glp-picker';

  injectStyles(root, 'data-glp-styles', getGroupedListPickerStyles);

  // Optional main title
  if (payload.main_title) {
    const title = document.createElement('p');
    title.className = 'glp-title';
    title.dir = 'auto';
    title.textContent = payload.main_title;
    root.appendChild(title);
  }

  const isMulti = payload.is_multiple_selection === true;
  const shouldLock = payload.lock_after_selection !== false;
  let locked = shouldLock && selection !== undefined;
  const allChips: HTMLButtonElement[] = [];

  // Multi-select state: track selected options as "groupTitle: option" strings
  const selectedSet = new Set<string>();

  // Restore selection state from re-render
  if (selection && isMulti) {
    const parts = selection.value.split(', ');
    for (const part of parts) {
      selectedSet.add(part.trim());
    }
  }

  for (const group of payload.groups) {
    if (!group.title || group.title.length === 0) continue;
    if (group.options.length === 0) continue;

    const heading = document.createElement('p');
    heading.className = 'glp-group-heading';
    heading.dir = 'auto';
    heading.textContent = group.title;
    root.appendChild(heading);

    const chipsContainer = document.createElement('div');
    chipsContainer.className = 'glp-chips';

    for (const option of group.options) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'glp-chip';
      chip.textContent = option;

      const chipKey = `${group.title}: ${option}`;

      // Restore selected state
      if (isMulti && selectedSet.has(chipKey)) {
        chip.classList.add('glp-chip--selected');
      }
      if (!isMulti && selection?.value === chipKey) {
        chip.classList.add('glp-chip--selected');
      }

      if (locked) {
        chip.disabled = true;
      }

      chip.addEventListener('click', () => {
        if (locked) return;

        if (isMulti) {
          // Toggle selection
          if (selectedSet.has(chipKey)) {
            selectedSet.delete(chipKey);
            chip.classList.remove('glp-chip--selected');
          } else {
            selectedSet.add(chipKey);
            chip.classList.add('glp-chip--selected');
          }
          // Update send button state
          updateSendButton();
        } else {
          // Single select — send immediately
          onSelect(chipKey, 0);

          if (shouldLock) {
            locked = true;
            chip.classList.add('glp-chip--selected');
            for (const btn of allChips) {
              btn.disabled = true;
            }
          }
        }
      });

      allChips.push(chip);
      chipsContainer.appendChild(chip);
    }

    root.appendChild(chipsContainer);
  }

  // Send button (multi-select only)
  let sendBtn: HTMLButtonElement | null = null;

  function updateSendButton(): void {
    if (sendBtn) {
      sendBtn.disabled = selectedSet.size === 0;
    }
  }

  if (isMulti) {
    sendBtn = document.createElement('button');
    sendBtn.type = 'button';
    sendBtn.className = 'glp-send-btn';
    sendBtn.textContent = payload.send_button_label ?? 'Done';
    sendBtn.disabled = selectedSet.size === 0;

    if (locked) {
      sendBtn.disabled = true;
    }

    sendBtn.addEventListener('click', () => {
      if (locked || selectedSet.size === 0) return;

      const value = Array.from(selectedSet).join(', ');
      onSelect(value, 0);

      if (shouldLock) {
        locked = true;
        for (const btn of allChips) {
          btn.disabled = true;
        }
        sendBtn!.disabled = true; // eslint-disable-line @typescript-eslint/no-non-null-assertion
      }
    });

    root.appendChild(sendBtn);
  }

  return root;
}
