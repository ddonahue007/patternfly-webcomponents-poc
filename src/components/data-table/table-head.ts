import settings from 'carbon-components/es/globals/js/settings';
import { html, customElement, LitElement } from 'lit-element';
import styles from './data-table.scss';

const { prefix } = settings;

/**
 * Data table header.
 */
@customElement(`${prefix}-table-head`)
class BXTableHead extends LitElement {
  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'rowgroup');
    }
    super.connectedCallback();
  }

  render() {
    return html`
      <slot></slot>
    `;
  }

  static styles = styles;
}

export default BXTableHead;
