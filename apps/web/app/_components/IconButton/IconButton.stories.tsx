import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

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
    size: 'small',
    ariaLabel: 'Edit',
  },
};

export const Medium: Story = {
  args: {
    icon: '✏️',
    size: 'medium',
    ariaLabel: 'Edit',
  },
};

export const Large: Story = {
  args: {
    icon: '✏️',
    size: 'large',
    ariaLabel: 'Edit',
  },
};

export const RoundedFull: Story = {
  args: {
    icon: '✏️',
    rounded: 'full',
    ariaLabel: 'Edit',
  },
};

export const Primary: Story = {
  args: {
    icon: '✏️',
    variant: 'primary',
    ariaLabel: 'Edit',
  },
};

export const Secondary: Story = {
  args: {
    icon: '✏️',
    variant: 'secondary',
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
      <IconButton icon='✏️' size='small' ariaLabel='Small' />
      <IconButton icon='✏️' size='medium' ariaLabel='Medium' />
      <IconButton icon='✏️' size='large' ariaLabel='Large' />
    </div>
  ),
};

export const AllRounded: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <IconButton icon='✏️' rounded='none' ariaLabel='None' />
      <IconButton icon='✏️' rounded='sm' ariaLabel='Small' />
      <IconButton icon='✏️' rounded='md' ariaLabel='Medium' />
      <IconButton icon='✏️' rounded='lg' ariaLabel='Large' />
      <IconButton icon='✏️' rounded='full' ariaLabel='Full' />
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

