'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, SimpleGrid } from '@mantine/core';
import { modals } from '@mantine/modals';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { TextInput } from 'react-hook-form-mantine';
import { z } from 'zod';

import { api } from '~/trpc/react';

export const schema = z.object({
  emails: z.array(z.string().email()).min(1),
});

export type TFormInputs = z.infer<typeof schema>;

export interface IOrganizationUpdateCreateFormProps {
  organizationHashid: string;
}

export const OrganizationUpdateCreateForm = ({
  organizationHashid,
}: IOrganizationUpdateCreateFormProps) => {
  const form = useForm<TFormInputs>({
    resolver: zodResolver(schema),
  });

  const utils = api.useUtils();
  const { mutateAsync: inviteMutation } =
    api.organization.inviteUsers.useMutation();

  const onSubmit: SubmitHandler<TFormInputs> = async (values) => {
    const data = await inviteMutation({
      organizationHashid,
      emails: values.emails,
    });
    if (data) {
      modals.closeAll();
      form.reset();
      await utils.organization.list.invalidate();
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SimpleGrid cols={2}>
          <TextInput<TFormInputs>
            required
            label='Name'
            placeholder='Enter Organization Name'
            name='emails'
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
