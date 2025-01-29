'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Group, SimpleGrid } from '@mantine/core';
import { modals } from '@mantine/modals';
import { startCase } from 'lodash';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import {
  Checkbox,
  CheckboxGroup,
  ColorPicker,
  Textarea,
  TextInput,
} from 'react-hook-form-mantine';
import { z } from 'zod';
import { OrganizationRoleCreateDto } from '~/dtos/organizationRole';

import { api, RouterOutputs } from '~/trpc/react';
import { allOrgPermissions } from '~/types/permissions';

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
      color: '#6b85c9',
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
        <SimpleGrid cols={2} className='items-end pb-4'>
          <ColorPicker<TFormInputs> name='color' />
          <TextInput<TFormInputs>
            required
            label='Name'
            placeholder='e.g. Designer'
            name='name'
          />
        </SimpleGrid>
        <Textarea<TFormInputs>
          name='description'
          label='Description'
          placeholder='Enter a description'
        />
        <Divider className='mb-4 my-6' />
        <CheckboxGroup<TFormInputs>
          name='permissions'
          label='Permissions'
          required
        >
          <SimpleGrid cols={2} className='pt-3'>
            {allOrgPermissions.map((permission, i) => (
              <Checkbox.Item
                key={`${permission}-${i}`}
                value={permission}
                label={startCase(permission)}
              />
            ))}
          </SimpleGrid>
        </CheckboxGroup>
        <Group className='justify-end pt-4'>
          <Button type='submit' disabled={!form.formState.isDirty}>
            Create
          </Button>
        </Group>
      </form>
    </FormProvider>
  );
};
