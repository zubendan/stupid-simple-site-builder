import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { Button, Group } from '@mantine/core';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { TextInput } from 'react-hook-form-mantine';
import { z } from 'zod';
import { RouterOutputs, api } from '~/trpc/react';

export const schema = z.object({
  domain: z.string().min(2),
});

export type TFormInputs = z.infer<typeof schema>;

export interface IDomainCreateFormProps {
  organizationHashid: string;
  templateHashid?: string;
  onSuccess?: (domain: RouterOutputs['domain']['add']) => void;
}

export const DomainCreateForm = ({
  onSuccess,
  organizationHashid,
  templateHashid,
}: IDomainCreateFormProps) => {
  const form = useForm<TFormInputs>({
    resolver: zodResolver(schema),
  });

  const utils = api.useUtils();
  const { mutateAsync: createMutation } = api.domain.add.useMutation();

  const onSubmit: SubmitHandler<TFormInputs> = async (values) => {
    const notificationId = notifications.show({
      message: 'Adding domain...',
      loading: true,
      autoClose: false,
    });
    const data = await createMutation({
      domain: values.domain,
      organizationHashid: organizationHashid,
      templateHashid: templateHashid,
    });
    if (data) {
      notifications.update({
        id: notificationId,
        message: 'Domain added',
        loading: false,
        color: 'green',
        icon: (
          <Icon
            icon='tabler:check'
            className='text-green-500 text-2xl size-6'
          />
        ),
      });
      modals.closeAll();
      form.reset();
      await utils.domain.infiniteList.invalidate();
      if (typeof onSuccess === 'function') {
        onSuccess(data);
      }
    } else {
      notifications.update({
        id: notificationId,
        message: 'Failed to add domain',
        loading: false,
        color: 'red',
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <TextInput label='Domain' placeholder='Enter domain' name='domain' />
        <Group className='justify-end pt-4'>
          <Button size='sm' type='submit' disabled={!form.formState.isDirty}>
            Create
          </Button>
        </Group>
      </form>
    </FormProvider>
  );
};
