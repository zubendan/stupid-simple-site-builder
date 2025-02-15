'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';

import {
  IDomainCreateFormProps,
  DomainCreateForm,
} from '~/app/(private)/_components/organizations/domains/CreateForm';

interface ICreateDomainButtonProps {
  label?: string;
  RightIcon?: React.ReactNode;
}

export const CreateDomainButton = ({
  label = 'Add Domain',
  RightIcon = <Icon icon='tabler:plus' className='text-lg' />,
  ...formProps
}: ICreateDomainButtonProps & IDomainCreateFormProps) => {
  const openModal = () =>
    modals.open({
      title: 'Create Domain',
      size: 'lg',
      children: <DomainCreateForm {...formProps} />,
    });

  return (
    <Button onClick={openModal} size='sm' rightSection={RightIcon}>
      {label}
    </Button>
  );
};
