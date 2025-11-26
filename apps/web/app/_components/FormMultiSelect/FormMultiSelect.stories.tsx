import type { Meta, StoryObj } from '@storybook/react';
import { FormMultiSelect } from './FormMultiSelect';

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
  { label: 'Mango', value: 'mango' },
];

const meta: Meta<typeof FormMultiSelect> = {
  title: 'Components/FormMultiSelect',
  tags: ['autodocs'],
  component: FormMultiSelect,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Fruits',
    options: OPTIONS,
    selected: [],
    placeholder: 'Choose fruits',
  },
  argTypes: {
    onChange: { action: 'changed' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px', height: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FormMultiSelect>;

export const Default: Story = {};

export const Preselected: Story = {
  args: {
    selected: ['apple', 'mango'],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithoutSelectAll: Story = {
  args: {
    selectAll: false,
    selected: ['apple', 'mango'],
  },
};

export const SpecifiedSelectAllLabel: Story = {
  args: {
    selectAllLabel: 'Select All Fruits',
    selected: ['apple', 'mango'],
  },
};
