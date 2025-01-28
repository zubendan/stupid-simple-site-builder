'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, SimpleGrid } from '@mantine/core';
import { modals } from '@mantine/modals';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { TextInput } from 'react-hook-form-mantine';
import { z } from 'zod';
import { OrganizationRoleCreateDto } from '~/dtos/organizationRole';

import { api, RouterOutputs } from '~/trpc/react';

export const schema = OrganizationRoleCreateDto;

export type TFormInputs = z.infer<typeof schema>;

export interface IOrganizationRoleUpdateCreateFormProps {
  organizationHashid: string;
  onSuccess?: (org: RouterOutputs['organizationRole']['create']) => void;
}

export const OrganizationRoleUpdateCreateForm = ({
  onSuccess,
  organizationHashid,
}: IOrganizationRoleUpdateCreateFormProps) => {
  const form = useForm<TFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      organizationHashid,
    },
  });

  const utils = api.useUtils();
  const { mutateAsync: createMutation } =
    api.organizationRole.create.useMutation();

  const onSubmit: SubmitHandler<TFormInputs> = async (values) => {
    const data = await createMutation(values);
    if (data) {
      modals.closeAll();
      form.reset();
      await utils.organizationRole.list.invalidate();
      if (typeof onSuccess === 'function') {
        onSuccess(data);
      }
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SimpleGrid cols={2}>
          <TextInput<TFormInputs>
            required
            label='Name'
            placeholder='Enter OrganizationRole Name'
            name='name'
          />
        </SimpleGrid>
        <Group className='justify-end pt-4'>
          <Button type='submit' disabled={!form.formState.isDirty}>
            Create
          </Button>
        </Group>
      </form>
    </FormProvider>
  );
};
