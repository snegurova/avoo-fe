import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text, Pressable } from 'react-native';
import Layout from './Layout';
import { MaterialIcons } from '@/shared/icons';
import { colors } from '@avoo/design-tokens';
import { fn } from 'storybook/test';

const meta = {
  component: Layout,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ flex: 1, height: '100%' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Layout>;

export default meta;

type Story = StoryObj<typeof meta>;

const SampleContent = () => (
  <View style={{ padding: 16 }}>
    <Text style={{ fontSize: 16, marginBottom: 8 }}>Sample Content</Text>
    <Text style={{ fontSize: 14, color: colors.gray[600] }}>
      This is sample content to demonstrate the layout structure.
    </Text>
  </View>
);

const CustomLeftContent = () => (
  <Pressable onPress={fn()}>
    <MaterialIcons name='menu' size={24} color={colors.black} />
  </Pressable>
);

const CustomRightContent = () => (
  <View style={{ flexDirection: 'row', gap: 8 }}>
    <Pressable onPress={fn()}>
      <MaterialIcons name='search' size={24} color={colors.black} />
    </Pressable>
    <Pressable onPress={fn()}>
      <MaterialIcons name='settings' size={24} color={colors.black} />
    </Pressable>
  </View>
);

const CustomTitle = () => (
  <Text style={{ fontSize: 18, fontWeight: '600' }}>Custom Title</Text>
);

export const Default: Story = {
  args: {
    children: <SampleContent />,
  },
};

export const CustomLeftOnly: Story = {
  args: {
    children: <SampleContent />,
    leftContent: <CustomLeftContent />,
  },
};

export const CustomRightOnly: Story = {
  args: {
    children: <SampleContent />,
    rightContent: <CustomRightContent />,
  },
};

export const CustomTitleOnly: Story = {
  args: {
    children: <SampleContent />,
    title: <CustomTitle />,
  },
};

export const CustomLeftAndTitle: Story = {
  args: {
    children: <SampleContent />,
    leftContent: <CustomLeftContent />,
    title: <CustomTitle />,
  },
};

export const CustomRightAndTitle: Story = {
  args: {
    children: <SampleContent />,
    rightContent: <CustomRightContent />,
    title: <CustomTitle />,
  },
};

export const CustomAll: Story = {
  args: {
    children: <SampleContent />,
    leftContent: <CustomLeftContent />,
    title: <CustomTitle />,
    rightContent: <CustomRightContent />,
  },
};

export const WithBackButton: Story = {
  args: {
    children: <SampleContent />,
    showBack: true,
    onBackPress: fn(),
  },
};

export const WithStringTitle: Story = {
  args: {
    children: <SampleContent />,
    title: 'String Title',
  },
};

export const CenteredContent: Story = {
  args: {
    children: (
      <View>
        <Text style={{ fontSize: 20, textAlign: 'center' }}>Centered Content</Text>
      </View>
    ),
    centerContent: true,
  },
};

