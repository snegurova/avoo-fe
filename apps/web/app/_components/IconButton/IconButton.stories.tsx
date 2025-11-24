import type { Meta, StoryObj } from '@storybook/react';
import { IconButton, IconButtonRounded, IconButtonSize, IconButtonVariant } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
      description: 'Icon to display (emoji or ReactNode)',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the button',
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      description: 'Border radius',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
      description: 'Color variant',
    },
    onClick: { action: 'clicked' },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: '✏️',
    ariaLabel: 'Edit',
  },
};

export const Small: Story = {
  args: {
    icon: '✏️',
    size: IconButtonSize.Small,
    ariaLabel: 'Edit',
  },
};

export const Medium: Story = {
  args: {
    icon: '✏️',
    size: IconButtonSize.Medium,
    ariaLabel: 'Edit',
  },
};

export const Large: Story = {
  args: {
    icon: '✏️',
    size: IconButtonSize.Large,
    ariaLabel: 'Edit',
  },
};

export const RoundedFull: Story = {
  args: {
    icon: '✏️',
    rounded: IconButtonRounded.Full,
    ariaLabel: 'Edit',
  },
};

export const Primary: Story = {
  args: {
    icon: '✏️',
    variant: IconButtonVariant.Primary,
    ariaLabel: 'Edit',
  },
};

export const Secondary: Story = {
  args: {
    icon: '✏️',
    variant: IconButtonVariant.Secondary,
    ariaLabel: 'Edit',
  },
};

export const Disabled: Story = {
  args: {
    icon: '✏️',
    disabled: true,
    ariaLabel: 'Edit',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <IconButton icon='✏️' size={IconButtonSize.Small} ariaLabel='Small' />
      <IconButton icon='✏️' size={IconButtonSize.Medium} ariaLabel='Medium' />
      <IconButton icon='✏️' size={IconButtonSize.Large} ariaLabel='Large' />
    </div>
  ),
};

export const AllRounded: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <IconButton icon='✏️' rounded={IconButtonRounded.None} ariaLabel='None' />
      <IconButton icon='✏️' rounded={IconButtonRounded.Sm} ariaLabel='Small' />
      <IconButton icon='✏️' rounded={IconButtonRounded.Md} ariaLabel='Medium' />
      <IconButton icon='✏️' rounded={IconButtonRounded.Lg} ariaLabel='Large' />
      <IconButton icon='✏️' rounded={IconButtonRounded.Full} ariaLabel='Full' />
    </div>
  ),
};

export const DifferentIcons: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <IconButton icon='✏️' ariaLabel='Edit' />
      <IconButton icon='🗑️' ariaLabel='Delete' />
      <IconButton icon='➕' ariaLabel='Add' />
      <IconButton icon='❌' ariaLabel='Close' />
      <IconButton icon='✅' ariaLabel='Check' />
    </div>
  ),
};

