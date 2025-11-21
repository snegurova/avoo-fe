import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the avatar',
    },
    name: {
      control: 'text',
      description: 'Name to display below the avatar',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'small',
    name: 'John Doe',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    name: 'Jane Smith',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    name: 'Bob Johnson',
  },
};

export const WithoutName: Story = {
  args: {
    size: 'medium',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className='flex gap-8 items-end'>
      <Avatar size='small' name='Small' />
      <Avatar size='medium' name='Medium' />
      <Avatar size='large' name='Large' />
    </div>
  ),
};
