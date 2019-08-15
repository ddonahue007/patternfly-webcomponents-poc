import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { storiesOf } from '@storybook/polymer';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import './structured-list';
import './structured-list-head';
import './structured-list-header-row';
import './structured-list-body';
import './structured-list-row';

const createProps = () => ({
  hasSelection: boolean('Supports selection feature (has-selection)', false),
});

storiesOf('Structured list', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const { hasSelection } = createProps();
    const selectionName = !hasSelection ? undefined : 'structured-list-selection';
    const selectionValues = !hasSelection
      ? []
      : ['structured-list-selection-0', 'structured-list-selection-1', 'structured-list-selection-2'];
    return html`
      <bx-structured-list ?has-selection=${hasSelection}>
        <bx-structured-list-head>
          <bx-structured-list-header-row ?has-selection=${hasSelection}>
            <bx-structured-list-header>ColumnA</bx-structured-list-header>
            <bx-structured-list-header>ColumnB</bx-structured-list-header>
            <bx-structured-list-header>ColumnC</bx-structured-list-header>
          </bx-structured-list-header-row>
        </bx-structured-list-head>
        <bx-structured-list-body>
          <bx-structured-list-row selection-name=${ifDefined(selectionName)} selection-value=${ifDefined(selectionValues[0])}>
            <bx-structured-list-cell>Row 1</bx-structured-list-cell>
            <bx-structured-list-cell>Row 1</bx-structured-list-cell>
            <bx-structured-list-cell
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed, aliquet bibendum
              augue. Aenean posuere sem vel euismod dignissim.</bx-structured-list-cell
            >
          </bx-structured-list-row>
          <bx-structured-list-row selection-name=${ifDefined(selectionName)} selection-value=${ifDefined(selectionValues[1])}>
            <bx-structured-list-cell>Row 2</bx-structured-list-cell>
            <bx-structured-list-cell>Row 2</bx-structured-list-cell>
            <bx-structured-list-cell
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed, aliquet bibendum
              augue. Aenean posuere sem vel euismod dignissim.</bx-structured-list-cell
            >
          </bx-structured-list-row>
          <bx-structured-list-row selection-name=${ifDefined(selectionName)} selection-value=${ifDefined(selectionValues[2])}>
            <bx-structured-list-cell>Row 3</bx-structured-list-cell>
            <bx-structured-list-cell>Row 3</bx-structured-list-cell>
            <bx-structured-list-cell
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed, aliquet bibendum
              augue. Aenean posuere sem vel euismod dignissim.</bx-structured-list-cell
            >
          </bx-structured-list-row>
        </bx-structured-list-body>
      </bx-structured-list>
    `;
  });
