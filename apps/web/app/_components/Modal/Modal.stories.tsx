import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { fn } from '@storybook/test';
import { useState } from 'react';

import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  args: {
    onClose: fn(),
  },
  decorators: [
    (Story, { args }) => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div style={{ width: '300px' }}>
          <Button
            intent={ButtonIntent.Primary}
            fit={ButtonFit.Fill}
            onClick={() => setIsOpen(true)}
          >
            Open Modal
          </Button>
          <Story args={{ ...args, isOpen, onClose: () => setIsOpen(false) }} />
        </div>
      );
    },
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    children: (
      <div>
        <h2 className='text-xl mb-4'>Default Modal Title</h2>
        <p>This is the standard content for the modal.</p>
      </div>
    ),
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
    children: (
      <div>
        <h2 className='text-xl mb-4'>Open Modal Title</h2>
        <p>This story is automatically opened using the play function for easy visual testing.</p>
        <button className='mt-4 p-2 bg-green-500 text-white rounded'>Confirm Action</button>
      </div>
    ),
  },
};
