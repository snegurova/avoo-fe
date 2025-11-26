import type { Meta, StoryObj } from '@storybook/react';

import { FormSelect, SelectIntent, SelectSize } from './FormSelect';

const meta: Meta<typeof FormSelect> = {
  title: 'Components/FormSelect',
  component: FormSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    label: 'Shift',
    placeholder: 'Choose a shift',
    options: [
      { label: 'Morning', value: 'morning' },
      { label: 'Afternoon', value: 'afternoon' },
      { label: 'Evening', value: 'evening' },
    ],
  },
  argTypes: {
    onChange: { action: 'changed' },
    intent: {
      control: { type: 'select' },
      options: Object.values(SelectIntent),
    },
    size: {
      control: { type: 'select' },
      options: Object.values(SelectSize),
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FormSelect>;

export const PrimaryMd: Story = {
  args: {
    intent: SelectIntent.Primary,
    size: SelectSize.Md,
  },
};

export const PrimarySm: Story = {
  args: {
    intent: SelectIntent.Primary,
    size: SelectSize.Sm,
  },
};

export const Neutral: Story = {
  args: {
    intent: SelectIntent.Neutral,
  },
};

export const ErrorState: Story = {
  args: {
    error: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
