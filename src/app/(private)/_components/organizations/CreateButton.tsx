'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';

import {
  IOrganizationUpdateCreateFormProps,
  OrganizationUpdateCreateForm,
} from '~/app/(private)/_components/organizations/CreateForm';

interface ICreateOrganizationButtonProps {
  label?: string;
  RightIcon?: React.ReactNode;
}

export const CreateOrganizationButton = ({
  label = 'Create',
  RightIcon = <Icon icon='tabler:plus' className='text-xl' />,
  ...formProps
}: ICreateOrganizationButtonProps & IOrganizationUpdateCreateFormProps) => {
  const openModal = () =>
    modals.open({
      title: 'Create Organization',
      size: 'lg',
      children: <OrganizationUpdateCreateForm {...formProps} />,
    });

  return (
    <Button onClick={openModal} size='md' rightSection={RightIcon}>
      {label}
    </Button>
  );
};
