'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group } from '@mantine/core';
import { modals } from '@mantine/modals';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { api } from '~/trpc/react';
import { EmailInput } from '../formInputs/EmailInput';
import { notifications } from '@mantine/notifications';

export const schema = z.object({
  emails: z.array(z.string().email()).min(1),
});

export type TFormInputs = z.infer<typeof schema>;

export interface IInviteFormProps {
  organizationHashid: string;
}

export const InviteForm = ({ organizationHashid }: IInviteFormProps) => {
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
      data.forEach((res) => {
        if (res.error) {
          notifications.show({
            title: 'Error',
            message: res.error.message,
            color: 'red',
          });
        }
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <EmailInput<TFormInputs>
          required
          label='Emails'
          placeholder="Enter Emails of the users you'd like to invite"
          name='emails'
        />
        <Group className='justify-end pt-4'>
          <Button type='submit' disabled={!form.formState.isDirty}>
            Invite
          </Button>
        </Group>
      </form>
    </FormProvider>
  );
};
