import type { Meta, StoryObj } from '@storybook/react';
import Avatar, { AvatarSize } from './Avatar';

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
      description: 'Name for avatar initial',
    },
    src: {
      control: 'text',
      description: 'Image URL',
    },
    bgColor: {
      control: 'color',
      description: 'Background color when no image',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: AvatarSize.Small,
    name: 'Anna',
    bgColor: '#9E9E9E',
  },
};

export const Medium: Story = {
  args: {
    size: AvatarSize.Medium,
    name: 'Anna',
    bgColor: '#7E57C2',
  },
};

export const Large: Story = {
  args: {
    size: AvatarSize.Large,
    name: 'Anna',
    bgColor: '#FF8A65',
  },
};

export const WithImage: Story = {
  args: {
    size: AvatarSize.Large,
    name: 'Alice Brown',
    src: 'https://i.pravatar.cc/150?img=1',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className='flex gap-8 items-center'>
      <Avatar size={AvatarSize.Small} name='Anna' bgColor='hsl(270, 50%, 65%)' />
      <Avatar size={AvatarSize.Medium} name='Anna' bgColor='hsl(210, 50%, 65%)' />
      <Avatar size={AvatarSize.Large} name='Anna' bgColor='hsl(30, 50%, 65%)' />
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className='flex gap-4 flex-wrap'>
      <Avatar size={AvatarSize.Large} name='Anna' bgColor='hsl(270, 50%, 65%)' />
      <Avatar size={AvatarSize.Large} name='Anna' bgColor='hsl(210, 50%, 65%)' />
      <Avatar size={AvatarSize.Large} name='Anna' bgColor='hsl(30, 50%, 65%)' />
      <Avatar size={AvatarSize.Large} name='Anna' bgColor='hsl(140, 50%, 65%)' />
      <Avatar size={AvatarSize.Large} name='Anna' bgColor='hsl(340, 50%, 65%)' />
    </div>
  ),
};

export const WithAndWithoutImage: Story = {
  render: () => (
    <div className='flex gap-4 items-center'>
      <Avatar 
        size={AvatarSize.Large} 
        name='With Image' 
        src='https://i.pravatar.cc/150?img=2'
      />
      <Avatar 
        size={AvatarSize.Large} 
        name='Without Image' 
        bgColor='hsl(210, 50%, 65%)'
      />
    </div>
  ),
};