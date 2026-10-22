/**
 * Selection List Picker Component
 *
 * Renders a list of selectable options with optional icon, title,
 * subtitle, and badge. Supports configurable locking after selection.
 *
 * @module rich-components/selection-list-picker
 */

import { getSelectionListPickerStyles } from './styles';
import { injectStyles } from '../../aam/shared/inject-styles';
import type { IconResolver } from '../../icons/icon-resolver';

// =============================================================================
// Types
// =============================================================================

/* eslint-disable @typescript-eslint/naming-convention -- matches server payload */
interface SelectionListItem {
  readonly title: string;
  readonly subtitle?: string;
  readonly icon?: string;
  readonly badge?: string;
  readonly payload?: string;
}

interface SelectionListPickerPayload {
  readonly main_title?: string;
  readonly lock_after_selection?: boolean;
  readonly items: readonly SelectionListItem[];
}
/* eslint-enable @typescript-eslint/naming-convention */

interface RichSelection {
  readonly index: number;
  readonly value: string;
  readonly cardIndex?: number;
}

type SelectCallback = (value: string, index: number, cardIndex?: number) => void;

/** Maximum number of items to render. */
const MAX_ITEMS = 20;

// =============================================================================
// Renderer
// =============================================================================

/**
 * Renders the selection list picker component.
 *
 * @param payload - The component payload from the server
 * @param onSelect - Callback to send visitor message
 * @param selection - Pre-existing selection state (for re-renders)
 * @param iconResolver - Optional IconResolver for Lucide icon resolution
 * @returns Root HTMLElement
 */
export function renderSelectionListPicker(
  payload: SelectionListPickerPayload,
  onSelect: SelectCallback,
  selection?: RichSelection,
  iconResolver?: IconResolver,
): HTMLElement {
  const root = document.createElement('div');
  root.className = 'slp-picker';

  injectStyles(root, 'data-slp-styles', getSelectionListPickerStyles);

  // Optional main title
  if (payload.main_title) {
    const title = document.createElement('p');
    title.className = 'slp-title';
    title.dir = 'auto';
    title.textContent = payload.main_title;
    root.appendChild(title);
  }

  const shouldLock = payload.lock_after_selection !== false;
  let locked = shouldLock && selection !== undefined;
  const allButtons: HTMLButtonElement[] = [];

  const container = document.createElement('div');
  container.className = 'slp-items';

  // Limit to MAX_ITEMS, skip items without title
  const items = payload.items.slice(0, MAX_ITEMS);
  let renderIndex = 0;

  for (const item of items) {
    if (!item.title || item.title.length === 0) continue;

    const idx = renderIndex;
    renderIndex++;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'slp-item';

    // Icon (left)
    if (item.icon && iconResolver) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'slp-icon';
      void iconResolver.resolveIcon(item.icon, 20).then((svg) => {
        if (svg) { iconWrap.appendChild(svg); }
      });
      btn.appendChild(iconWrap);
    }

    // Content (center): title + subtitle
    const content = document.createElement('div');
    content.className = 'slp-content';

    const titleEl = document.createElement('p');
    titleEl.className = 'slp-item-title';
    titleEl.dir = 'auto';
    titleEl.textContent = item.title;
    content.appendChild(titleEl);

    if (item.subtitle) {
      const subtitleEl = document.createElement('p');
      subtitleEl.className = 'slp-subtitle';
      subtitleEl.dir = 'auto';
      subtitleEl.textContent = item.subtitle;
      content.appendChild(subtitleEl);
    }

    btn.appendChild(content);

    // Badge (right)
    if (item.badge) {
      const badge = document.createElement('span');
      badge.className = 'slp-badge';
      badge.textContent = item.badge;
      btn.appendChild(badge);
    }

    // Pre-existing selection state
    if (locked) {
      btn.disabled = true;
      if (selection?.index === idx) {
        btn.classList.add('slp-item--selected');
      }
    }

    // Click handler
    const selectValue = item.payload ?? item.title;
    btn.addEventListener('click', () => {
      if (locked) return;

      onSelect(selectValue, idx);

      if (shouldLock) {
        locked = true;
        btn.classList.add('slp-item--selected');
        for (const button of allButtons) {
          button.disabled = true;
        }
      }
    });

    allButtons.push(btn);
    container.appendChild(btn);
  }

  root.appendChild(container);
  return root;
}
