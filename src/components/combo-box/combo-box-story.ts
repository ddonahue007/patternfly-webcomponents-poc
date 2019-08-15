import { html } from 'lit-element';
import { storiesOf } from '@storybook/polymer';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import './combo-box';
import './combo-box-item';

const createProps = () => ({
  open: boolean('Open (open)', false),
  disabled: boolean('Disabled (disabled)', false),
  helperText: text('Helper text (helper-text)', ''),
  labelText: text('Label text (label-text)', ''),
  light: boolean('Light variant (light)', false),
  value: text('The value of the selected item (value)', ''),
  triggerContent: text('The placeholder content (trigger-content)', 'Filter...'),
  disableSelection: boolean(
    'Disable user-initiated selection change (Call event.preventDefault() in bx-combo-box-beingselected event)',
    false
  ),
});

storiesOf('Combo box', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const { open, disabled, helperText, labelText, light, value, triggerContent, disableSelection } = createProps();
    const beforeSelectedAction = action('bx-combo-box-beingselected');
    const handleBeforeSelected = (event: CustomEvent) => {
      beforeSelectedAction(event);
      if (disableSelection) {
        event.preventDefault();
      }
    };
    return html`
      <bx-combo-box
        ?open=${open}
        ?disabled=${disabled}
        ?light=${light}
        helper-text=${helperText}
        label-text=${labelText}
        value=${value}
        trigger-content=${triggerContent}
        @bx-combo-box-beingselected=${handleBeforeSelected}
        @bx-combo-box-selected=${action('bx-combo-box-selected')}
      >
        <bx-combo-box-item value="all">Option 1</bx-combo-box-item>
        <bx-combo-box-item value="cloudFoundry">Option 2</bx-combo-box-item>
        <bx-combo-box-item value="staging">Option 3</bx-combo-box-item>
        <bx-combo-box-item value="dea">Option 4</bx-combo-box-item>
        <bx-combo-box-item value="router">Option 5</bx-combo-box-item>
      </bx-combo-box>
    `;
  });
