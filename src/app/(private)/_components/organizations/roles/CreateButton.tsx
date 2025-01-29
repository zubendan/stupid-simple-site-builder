'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';

import {
  IOrganizationRoleUpdateCreateFormProps,
  OrganizationRoleUpdateCreateForm,
} from '~/app/(private)/_components/organizations/roles/CreateForm';

interface ICreateOrganizationRoleButtonProps {
  label?: string;
  RightIcon?: React.ReactNode;
}

export const CreateOrganizationRoleButton = ({
  label = 'Create Role',
  RightIcon = <Icon icon='tabler:plus' className='text-xl' />,
  ...formProps
}: ICreateOrganizationRoleButtonProps &
  IOrganizationRoleUpdateCreateFormProps) => {
  const openModal = () =>
    modals.open({
      title: 'Create Role',
      size: 'lg',
      children: <OrganizationRoleUpdateCreateForm {...formProps} />,
    });

  return (
    <Button onClick={openModal} size='md' rightSection={RightIcon}>
      {label}
    </Button>
  );
};
