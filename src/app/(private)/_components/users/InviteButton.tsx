'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IInviteFormProps, InviteForm } from './InviteForm';

export const InviteButton = (props: IInviteFormProps) => {
  const openModal = () =>
    modals.open({
      title: 'Invite Users',
      size: 'lg',
      children: <InviteForm {...props} />,
    });

  return (
    <Button
      onClick={openModal}
      size='sm'
      rightSection={<Icon icon='tabler:mail' className='text-lg' />}
    >
      Invite
    </Button>
  );
};
