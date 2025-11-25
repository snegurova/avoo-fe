import type { Meta, StoryObj } from '@storybook/react';

import { LinkFit, LinkIntent, NavLink } from './NavLink';

const meta: Meta<typeof NavLink> = {
  title: 'Components/NavLink',
  component: NavLink,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Click me',
  },
  argTypes: {
    to: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
    intent: {
      control: { type: 'select' },
      options: Object.values(LinkIntent),
    },
    fit: {
      control: { type: 'select' },
      options: Object.values(LinkFit),
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

type Story = StoryObj<typeof NavLink>;

export const PrimaryInline: Story = {
  args: {
    to: '#',
    children: <span>Link text</span>,
    intent: LinkIntent.Primary,
    fit: LinkFit.Inline,
  },
};

export const PrimaryFill: Story = {
  args: {
    to: '#',
    children: <span>Link text</span>,
    intent: LinkIntent.Primary,
    fit: LinkFit.Fill,
  },
};

export const PrimaryOutlined: Story = {
  args: {
    to: '#',
    children: <span>Link text</span>,
    intent: LinkIntent.Primary,
    fit: LinkFit.Outlined,
  },
};

export const SecondaryInline: Story = {
  args: {
    to: '#',
    children: <span>Link text</span>,
    intent: LinkIntent.Secondary,
    fit: LinkFit.Inline,
  },
};

export const SecondaryFill: Story = {
  args: {
    to: '#',
    children: <span>Link text</span>,
    intent: LinkIntent.Secondary,
    fit: LinkFit.Fill,
  },
};

export const SecondaryOutlined: Story = {
  args: {
    to: '#',
    children: <span>Link text</span>,
    intent: LinkIntent.Secondary,
    fit: LinkFit.Outlined,
  },
};
export const Disabled: Story = {
  args: {
    to: '#',
    children: <span>Link text</span>,
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    to: '#',
    children: <span>Link text</span>,
    loading: true,
  },
};
