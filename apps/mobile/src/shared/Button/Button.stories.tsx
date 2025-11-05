import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import Button from './Button';
import { fn } from 'storybook/test';

const meta = {
  component: Button,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View className='flex-1 items-center pt-12'>
        <Story />
      </View>
    ),
  ],
  args: { onPress: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: 'Button',
  },
};

export const Disabled: Story = {
  args: {
    title: 'Button',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    title: 'Button',
    loading: true,
  },
};
