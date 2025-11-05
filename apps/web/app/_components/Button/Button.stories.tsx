import type { Meta, StoryObj } from '@storybook/react';

import { Button, ButtonFit, ButtonIntent } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Click me',
  },
  argTypes: {
    onClick: { action: 'clicked' },
    intent: {
      control: { type: 'select' },
      options: Object.values(ButtonIntent),
    },
    fit: {
      control: { type: 'select' },
      options: Object.values(ButtonFit),
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

type Story = StoryObj<typeof Button>;

export const PrimaryInline: Story = {
  args: {
    intent: ButtonIntent.Primary,
    fit: ButtonFit.Inline,
  },
};

export const PrimaryFill: Story = {
  args: {
    intent: ButtonIntent.Primary,
    fit: ButtonFit.Fill,
  },
};

export const SecondaryInline: Story = {
  args: {
    intent: ButtonIntent.Secondary,
    fit: ButtonFit.Inline,
  },
};

export const Disabled: Story = {
  args: {
    intent: ButtonIntent.Primary,
    fit: ButtonFit.Inline,
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    intent: ButtonIntent.Primary,
    fit: ButtonFit.Inline,
    loading: true,
  },
};
