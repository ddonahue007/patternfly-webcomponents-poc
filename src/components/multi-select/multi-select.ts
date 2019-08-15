import settings from 'carbon-components/es/globals/js/settings';
import { html, property, customElement } from 'lit-element';
import Close16 from '@carbon/icons/lib/close/16';
import { filter, forEach } from '../../globals/internal/collection-helpers';
import BXDropdown from '../dropdown/dropdown';
import BXMultiSelectItem from './multi-select-item';
import styles from './multi-select.scss';

const { prefix } = settings;

/**
 * Multi select.
 */
@customElement(`${prefix}-multi-select`)
class BXMultiSelect extends BXDropdown {
  protected _selectionShouldChange(itemToSelect?: BXMultiSelectItem) {
    // If we are selecting an item, assumes we always toggle
    return Boolean(this.value || itemToSelect);
  }

  protected _selectionDidChange(itemToSelect?: BXMultiSelectItem) {
    if (itemToSelect) {
      itemToSelect.selected = !itemToSelect.selected;
      this._assistiveStatusText = itemToSelect.selected ? this.selectedItemAssistiveText : this.unselectedItemAssistiveText;
    } else {
      forEach(this.querySelectorAll((this.constructor as typeof BXMultiSelect).selectorItemSelected), item => {
        (item as BXMultiSelectItem).selected = false;
      });
      this._handleUserInitiatedToggle(false);
      this._assistiveStatusText = this.unselectedAllAssistiveText;
    }
    // Change in `.selected` hasn't been reflected to the corresponding attribute yet
    this.value = filter(
      this.querySelectorAll((this.constructor as typeof BXMultiSelect).selectorItem),
      item => (item as BXMultiSelectItem).selected
    )
      .map(item => (item as BXMultiSelectItem).value)
      .join(',');
  }

  protected _handleClickInner(event: MouseEvent) {
    if ((event.target as Element).closest((this.constructor as typeof BXMultiSelect).selectorSelectionButton)) {
      this._handleUserInitiatedSelectItem();
    } else {
      const shouldIgnoreClickInner = elem =>
        elem.closest && elem.closest((this.constructor as typeof BXMultiSelect).selectorIgnoreClickInner);
      if (!event.composedPath().some(shouldIgnoreClickInner)) {
        super._handleClickInner(event);
      }
    }
  }

  protected _handleKeydownInner(event: KeyboardEvent) {
    const { key } = event;
    if (
      (event.target as Element).closest((this.constructor as typeof BXMultiSelect).selectorSelectionButton) &&
      (this.constructor as typeof BXMultiSelect).TRIGGER_KEYS.has(key)
    ) {
      this._handleUserInitiatedSelectItem();
      (this.shadowRoot!.querySelector((this.constructor as typeof BXMultiSelect).selectorTrigger) as HTMLElement).focus();
    } else {
      super._handleKeydownInner(event);
    }
  }

  protected _renderPrecedingTriggerContent() {
    const { clearSelectionLabel } = this;
    const selectedItemsCount = this.querySelectorAll((this.constructor as typeof BXMultiSelect).selectorItemSelected).length;
    return selectedItemsCount === 0
      ? undefined
      : html`
          <div
            role="button"
            class="${prefix}--list-box__selection ${prefix}--list-box__selection--multi ${prefix}--tag--filter"
            tabindex="0"
            title="${clearSelectionLabel}"
          >
            ${selectedItemsCount} ${Close16({ 'aria-label': clearSelectionLabel })}
          </div>
        `;
  }

  /**
   * The `aria-label` attribute for the icon to clear selection. Corresponds to `clear-selection-label` attribute.
   */
  @property({ attribute: 'clear-selection-label' })
  clearSelectionLabel = '';

  /**
   * An assistive text for screen reader to announce, telling that an item is unselected.
   */
  @property({ attribute: 'unselected-item-assistive-text' })
  unselectedItemAssistiveText = 'Unselected an item.';

  /**
   * An assistive text for screen reader to announce, telling that all items are unselected.
   */
  @property({ attribute: 'unselected-all-assistive-text' })
  unselectedAllAssistiveText = 'Unselected all items.';

  attributeChangedCallback(name, old, current) {
    if (name === 'value') {
      const values = !current ? [] : current.split(',');
      const { itemTagName } = this.constructor as typeof BXMultiSelect;
      forEach(this.getElementsByTagName(itemTagName), elem => {
        elem.toggleAttribute('selected', values.indexOf((elem as BXMultiSelectItem).value) >= 0);
      });
    } else {
      super.attributeChangedCallback(name, old, current);
    }
  }

  /**
   * The tag name of the element working as a multi select item, which is, `<bx-multi-select-item>`.
   * We use a separate property from `.selectorItem` due to the nature in difference of tag name vs. selector.
   */
  static get itemTagName() {
    return `${prefix}-multi-select-item`;
  }

  /**
   * A selector that will return highlighted items.
   */
  static get selectorItemHighlighted() {
    return `${prefix}-multi-select-item[highlighted]`;
  }

  /**
   * A selector to ignore the `click` events from.
   * Primary for the checkbox label where the `click` event will happen from the associated check box.
   */
  static get selectorIgnoreClickInner() {
    return `.${prefix}--checkbox-label`;
  }

  /**
   * A selector that will return multi select items.
   * We use a separate property from `.itemTagName` due to the nature in difference of tag name vs. selector.
   */
  static get selectorItem() {
    return `${prefix}-multi-select-item`;
  }

  /**
   * A selector that will return selected items.
   */
  static get selectorItemSelected() {
    return `${prefix}-multi-select-item[selected]`;
  }

  /**
   * A selector that will return the UI to clear selected items.
   */
  static get selectorSelectionButton() {
    return `.${prefix}--list-box__selection`;
  }

  /**
   * A selector that will return the trigger button.
   */
  static get selectorTrigger() {
    return `.${prefix}--list-box__field`;
  }

  /**
   * The name of the custom event fired before a multi select item is selected upon a user gesture.
   * Cancellation of this event stops changing the user-initiated selection.
   */
  static get eventBeforeSelect() {
    return `${prefix}-multi-select-beingselected`;
  }

  /**
   * The name of the custom event fired after a a multi select item is selected upon a user gesture.
   */
  static get eventAfterSelect() {
    return `${prefix}-multi-select-selected`;
  }

  static styles = styles;
}

export default BXMultiSelect;
