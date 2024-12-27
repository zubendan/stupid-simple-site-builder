'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';

import { OrganizationUpdateCreateForm } from '~/app/(private)/_components/organizations/CreateForm';

export const CreateOrganizationButton = () => {
  const openModal = () =>
    modals.open({
      title: 'Create Organization',
      size: 'lg',
      children: <OrganizationUpdateCreateForm />,
    });

  return (
    <Button
      onClick={openModal}
      size='md'
      rightSection={<Icon icon='tabler:plus' className='text-xl' />}
    >
      Create
    </Button>
  );
};
