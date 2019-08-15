import settings from 'carbon-components/es/globals/js/settings';
import findLast from 'lodash.findlast';
import classnames from 'classnames';
import { html, property, customElement, LitElement } from 'lit-element';
import HostListener from '../../globals/decorators/host-listener';
import HostListenerMixin from '../../globals/mixins/host-listener';
import styles from './modal.scss';
import { selectorTabbable } from '../../globals/settings';
import { find } from '../../globals/internal/collection-helpers';

const { prefix } = settings;

// eslint-disable-next-line no-bitwise
const PRECEDING = Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_POSITION_CONTAINS;
// eslint-disable-next-line no-bitwise
const FOLLOWING = Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_POSITION_CONTAINED_BY;

@customElement(`${prefix}-modal`)
class BXModal extends HostListenerMixin(LitElement) {
  /**
   * The element that had focus before this modal gets open.
   */
  private _launcher: Element | null = null;

  /**
   * Handles `click` event on this element.
   * @param event The event.
   */
  @HostListener('click')
  // @ts-ignore: The decorator refers to this method but TS thinks this method is not referred to
  private _handleClick = (event: MouseEvent) => {
    if (event.composedPath().indexOf(this.shadowRoot!) < 0) {
      this._handleUserInitiatedClose(event.target);
    }
  };

  /**
   * Handles `blur` event on this element.
   * @param event The event.
   */
  @HostListener('shadowRoot:blur')
  // @ts-ignore: The decorator refers to this method but TS thinks this method is not referred to
  private _handleBlur = ({ target, relatedTarget }: FocusEvent) => {
    const oldContains = target !== this && this.contains(target as Node);
    const currentContains = relatedTarget !== this && this.contains(relatedTarget as Node);

    // Performs focus wrapping if _all_ of the following is met:
    // * This modal is open
    // * The viewport still has focus
    // * Modal body used to have focus but no longer has focus
    if (this.open && relatedTarget && oldContains && !currentContains) {
      const comparisonResult = (target as Node).compareDocumentPosition(relatedTarget as Node);
      // eslint-disable-next-line no-bitwise
      if (relatedTarget === this.shadowRoot!.getElementById('pre-trap') || comparisonResult & PRECEDING) {
        const tabbable = findLast(this.querySelectorAll((this.constructor as typeof BXModal).selectorTabbable), elem =>
          Boolean((elem as HTMLElement).offsetParent)
        );
        if (tabbable) {
          (tabbable as HTMLElement).focus();
        } else if (relatedTarget !== this) {
          this.focus();
        }
      }
      // eslint-disable-next-line no-bitwise
      else if (relatedTarget === this.shadowRoot!.getElementById('post-trap') || comparisonResult & FOLLOWING) {
        const tabbable = find(this.querySelectorAll((this.constructor as typeof BXModal).selectorTabbable), elem =>
          Boolean((elem as HTMLElement).offsetParent)
        );
        if (tabbable) {
          (tabbable as HTMLElement).focus();
        } else {
          this.focus();
        }
      }
    }
  };

  @HostListener('document:keydown')
  // @ts-ignore: The decorator refers to this method but TS thinks this method is not referred to
  private _handleKeydown = ({ key, target }: KeyboardEvent) => {
    if (key === 'Esc' || key === 'Escape') {
      this._handleUserInitiatedClose(target);
    }
  };

  /**
   * Handles `click` event on the modal container.
   * @param event The event.
   */
  private _handleClickContainer(event: MouseEvent) {
    if ((event.target as Element).matches((this.constructor as typeof BXModal).selectorCloseButton)) {
      this._handleUserInitiatedClose(event.target);
    }
  }

  /**
   * Handles user-initiated close request of this modal.
   * @param triggeredBy The element that triggered this close request.
   */
  private _handleUserInitiatedClose(triggeredBy: EventTarget | null) {
    if (this.open) {
      const init = {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          triggeredBy,
        },
      };
      if (this.dispatchEvent(new CustomEvent((this.constructor as typeof BXModal).eventBeforeClose, init))) {
        this.open = false;
        this.dispatchEvent(new CustomEvent((this.constructor as typeof BXModal).eventAfterClose, init));
      }
    }
  }

  /**
   * The additional CSS class names for the container <div> of the element. Corresponds to `container-class` attribute.
   */
  @property({ attribute: 'container-class' })
  containerClass = '';

  /**
   * `true` if the modal should be the danger variant. Corresponds to the attribute with the same name.
   */
  @property({ type: Boolean, reflect: true })
  danger = false;

  /**
   * `true` if the modal should be open. Corresponds to the attribute with the same name.
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  render() {
    const containerClasses = classnames(`${prefix}--modal-container`, {
      [this.containerClass]: this.containerClass,
    });
    return html`
      <a id="pre-trap" class="${prefix}--visually-hidden" href="javascript:void 0" role="navigation"></a>
      <div class=${containerClasses} role="dialog" tabidnex="-1" @click=${this._handleClickContainer}>
        <slot></slot>
      </div>
      <a id="post-trap" class="${prefix}--visually-hidden" href="javascript:void 0" role="navigation"></a>
    `;
  }

  connectedCallback() {
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    super.connectedCallback();
  }

  attributeChangedCallback(name, old, current) {
    super.attributeChangedCallback(name, old, current);
    if (name === 'open') {
      if (old == null && current != null) {
        this._launcher = this.ownerDocument!.activeElement;
        const primaryFocusNode = this.querySelector((this.constructor as typeof BXModal).selectorPrimaryFocus);
        if (primaryFocusNode) {
          (primaryFocusNode as HTMLElement).focus();
        } else {
          const tabbable = find(this.querySelectorAll((this.constructor as typeof BXModal).selectorTabbable), elem =>
            Boolean((elem as HTMLElement).offsetParent)
          );
          if (tabbable) {
            (tabbable as HTMLElement).focus();
          } else {
            this.focus();
          }
        }
      } else if (old != null && current == null) {
        if (this._launcher && typeof (this._launcher as HTMLElement).focus === 'function') {
          (this._launcher as HTMLElement).focus();
          this._launcher = null;
        }
      }
    }
  }

  /**
   * A selector selecting buttons that should close this modal.
   */
  static selectorCloseButton = `[data-modal-close],${prefix}-modal-close-button`;

  /**
   * A selector selecting tabbable nodes.
   */
  static selectorTabbable = selectorTabbable;

  /**
   * A selector selecting the nodes that should be focused when modal gets open.
   */
  static selectorPrimaryFocus = `[data-modal-primary-focus],${prefix}-modal-footer ${prefix}-btn[kind="primary"]`;

  /**
   * The name of the custom event fired before this modal is being closed upon a user gesture.
   * Cancellation of this event stops the user-initiated action of closing this modal.
   */
  static get eventBeforeClose() {
    return `${prefix}-modal-beingclosed`;
  }

  /**
   * The name of the custom event fired after this modal is closed upon a user gesture.
   */
  static get eventAfterClose() {
    return `${prefix}-modal-closed`;
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default BXModal;
