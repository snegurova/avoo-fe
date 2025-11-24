import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarSize } from './Avatar';

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
      options: [AvatarSize.Small, AvatarSize.Medium, AvatarSize.Large],
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
    size: AvatarSize.Small,
    name: 'John Doe',
  },
};

export const Medium: Story = {
  args: {
    size: AvatarSize.Medium,
    name: 'Jane Smith',
  },
};

export const Large: Story = {
  args: {
    size: AvatarSize.Large,
    name: 'Bob Johnson',
  },
};

export const WithoutName: Story = {
  args: {
    size: AvatarSize.Medium,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className='flex gap-8 items-end'>
      <Avatar size={AvatarSize.Small} name='Small' />
      <Avatar size={AvatarSize.Medium} name='Medium' />
      <Avatar size={AvatarSize.Large} name='Large' />
    </div>
  ),
};
