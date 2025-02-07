'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Group, SimpleGrid } from '@mantine/core';
import { modals } from '@mantine/modals';
import { startCase } from 'lodash';
import { useEffect } from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import {
  Checkbox,
  CheckboxGroup,
  ColorPicker,
  TextInput,
  Textarea,
} from 'react-hook-form-mantine';
import { z } from 'zod';
import { OrganizationRoleCreateDto } from '~/dtos/organizationRole';

import { RouterOutputs, api } from '~/trpc/react';
import { allOrgPermissions } from '~/types/permissions';

export const schema = OrganizationRoleCreateDto;

export type TFormInputs = z.infer<typeof schema>;

export interface IOrganizationRoleUpdateCreateFormProps {
  organizationHashid: string;
  roleHashid?: string;
  onSuccess?: (org: RouterOutputs['organizationRole']['create']) => void;
}

export const OrganizationRoleUpdateCreateForm = ({
  onSuccess,
  roleHashid,
  organizationHashid,
}: IOrganizationRoleUpdateCreateFormProps) => {
  const { data } = api.organization.role.find.useQuery(
    { roleHashid: roleHashid ?? '' },
    {
      enabled: !!roleHashid,
    },
  );

  const form = useForm<TFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      organizationHashid,
      color: '#6b85c9',
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        organizationHashid,
        color: data.color,
        name: data.name,
        description: data.description ?? undefined,
        permissions: data.permissions.map((p) => p.name),
      });
    }
  }, [data]);

  const utils = api.useUtils();
  const { mutateAsync: createMutation } =
    api.organization.role.create.useMutation();
  const { mutateAsync: updateMutation } =
    api.organization.role.update.useMutation();

  const onSubmit: SubmitHandler<TFormInputs> = async (values) => {
    if (roleHashid) {
      const data = await updateMutation({
        roleHashid,
        ...values,
      });
      if (data) {
        modals.closeAll();
        form.reset();
        await utils.organizationRole.list.invalidate();
        if (typeof onSuccess === 'function') {
          onSuccess(data);
        }
      }
    } else {
      const data = await createMutation(values);
      if (data) {
        modals.closeAll();
        form.reset();
        await utils.organizationRole.list.invalidate();
        if (typeof onSuccess === 'function') {
          onSuccess(data);
        }
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
            {roleHashid ? 'Update' : 'Create'}
          </Button>
        </Group>
      </form>
    </FormProvider>
  );
};
