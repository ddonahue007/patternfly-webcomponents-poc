import settings from 'carbon-components/es/globals/js/settings';

const pfPrefix = 'pf';

const { prefix } = settings;

/**
 * A selector selecting tabbable nodes.
 * Borrowed from `carbon-angular`. tabbable === focusable.
 */
const selectorTabbable = `
  a[href], area[href], input:not([disabled]):not([tabindex='-1']),
  button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']),
  textarea:not([disabled]):not([tabindex='-1']),
  iframe, object, embed, *[tabindex]:not([tabindex='-1']), *[contenteditable=true],
  ${prefix}-btn,
  ${prefix}-dropdown,
  ${prefix}-modal,
  ${prefix}-modal-close-button,
  ${prefix}-overflow-menu,
  ${prefix}-structured-list,
  ${prefix}-tooltip
`;

// Because we're going to have a bunch of exports
// eslint-disable-next-line import/prefer-default-export
export { pfPrefix, selectorTabbable };
