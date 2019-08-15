'use strict';

const path = require('path');
const createSVGResultFromCarbonIcon = require('./tools/svg-result-carbon-icon');

/**
 * A WebPack loader to generate `lit-html`'s `SVGResult` from an icon descriptor from `@carbon/icons`.
 * @returns {string} The massaged module content.
 */
function svgResultCarbonIconLoader() {
  const descriptor = require(this.resourcePath); // eslint-disable-line global-require,import/no-dynamic-require
  return `
    import { svg } from 'lit-html';
    import spread from '${path.resolve(__dirname, 'src/globals/directives/spread')}';
    const svgResultCarbonIcon = ${createSVGResultFromCarbonIcon(descriptor)};
    export default svgResultCarbonIcon;
  `;
}

module.exports = svgResultCarbonIconLoader;
