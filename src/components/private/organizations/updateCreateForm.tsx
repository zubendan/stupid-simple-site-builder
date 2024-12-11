'use client';

import {
  Button,
  Divider,
  Group,
  LoadingOverlay,
  RadioCard,
  RadioIndicator,
  SimpleGrid,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { useEffect } from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import {
  NumberInput,
  RadioGroup,
  Switch,
  TextInput,
} from 'react-hook-form-mantine';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { AffiliateSelect } from '~/app/(private)/_components/FormInputs/AffiliateSelect';
import { FeatureFlagMultiSelect } from '~/app/(private)/_components/FormInputs/FeatureFlagMultiSelect';
import { LayoutGroupSelect } from '~/app/(private)/_components/FormInputs/LayoutGroupSelect';
import { ThemeSelect } from '~/app/(private)/_components/FormInputs/ThemeSelect';
import { api } from '~/trpc/react';
import { OrganizationCreateDto as schema } from '~/dtos/organization';

export type TFormInputs = z.infer<typeof schema>;

export interface DomainUpdateCreateFormProps {
  hashid?: string;
}

export const DomainUpdateCreateForm = ({
  hashid,
}: DomainUpdateCreateFormProps) => {
  const { data, isLoading } = api.organization.find.useQuery(
    {
      hashid: hashid ?? '',
    },
    { enabled: !!hashid },
  );
  const form = useForm<TFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      domain: {
        themeId: null,
        ownerId: undefined,
        defaultAttribution: null,
        attributionOverride: null,
        exclusive: null,
        minRla: null,
        maxRla: null,
        contactEmail: null,
      },
      featureFlagsIds: [],
    },
  });

  useEffect(() => {
    if (!isLoading && data) {
      form.reset({
        image: data.image ?? undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const utils = api.useUtils();
  const { mutateAsync: createMutation } = api.domain.create.useMutation();
  const { mutateAsync: updateMutation } = api.domain.update.useMutation();

  const onSuccess = () => {
    form.reset();
    modals.closeAll();
  };

  const onSubmit: SubmitHandler<TFormInputs> = async ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    domainOwnerType,
    ...values
  }) => {
    if (id) {
      const data = await updateMutation({ id, values });
      if (data) {
        onSuccess();
        await invalidateDomainLayout();
        await utils.domain.find.invalidate({ id });
        await utils.domain.getInfo.invalidate({ domainId: id });
        await utils.domain.list.invalidate();
        await utils.featureFlag.list.invalidate();
      }
    } else {
      const data = await createMutation(values);
      if (data) {
        onSuccess();
        await utils.domain.list.invalidate();
        await utils.featureFlag.list.invalidate();
      }
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='relative'>
        <LoadingOverlay
          visible={isLoading && !!id}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <SimpleGrid cols={2}>
          <TextInput<TFormInputs>
            required
            label='Domain'
            placeholder='Enter Domain Url'
            name='domain.domain'
          />
          <TextInput<TFormInputs>
            required
            label='Display Name'
            placeholder='Enter Display Name'
            name='domain.displayName'
          />
          <LayoutGroupSelect<TFormInputs>
            required
            label='Layout Group'
            placeholder='Select Layout Group'
            name='domain.layoutGroupId'
          />
          <ThemeSelect<TFormInputs>
            label='Theme'
            placeholder='Select Theme'
            name='domain.themeId'
          />
          <NumberInput<TFormInputs>
            hideControls
            type='tel'
            pattern='[0-9]*'
            label='Min RLA'
            placeholder='Enter Min RLA'
            name='domain.minRla'
          />
          <NumberInput<TFormInputs>
            hideControls
            type='tel'
            pattern='[0-9]*'
            label='Max RLA'
            placeholder='Enter Max RLA'
            name='domain.maxRla'
          />
          <TextInput<TFormInputs>
            label='Contact Email'
            placeholder='Enter Contact Email'
            name='domain.contactEmail'
          />
        </SimpleGrid>
        <Divider className='my-4' />
        <SimpleGrid cols={2} className='items-center pb-4'>
          <Switch<TFormInputs>
            classNames={{
              body: 'cursor-pointer max-w-fit',
            }}
            size='md'
            color='cyan'
            label='Exclusive'
            name='domain.exclusive'
          />
          {watchExclusive && (
            <NumberInput<TFormInputs>
              hideControls
              type='tel'
              pattern='[0-9]*'
              label='Attribution Override'
              placeholder='Enter Attribution Override'
              name='domain.attributionOverride'
            />
          )}
        </SimpleGrid>
        <RadioGroup<TFormInputs>
          size='md'
          label='Who owns this domain'
          name='domainOwnerType'
          onChange={(value) => {
            if (value === 'affiliate') {
              form.setValue('domain.exclusive', true);
            } else {
              form.setValue('domain.ownerId', null);
            }
          }}
        >
          <SimpleGrid cols={2}>
            <RadioCard value='lead-economy' className='rounded-md p-6'>
              <Group className='flex-nowrap'>
                <RadioIndicator />
                Lead Economy
              </Group>
            </RadioCard>
            <RadioCard value='affiliate' className='rounded-md p-6'>
              <Group className='flex-nowrap'>
                <RadioIndicator />
                Affiliate
              </Group>
            </RadioCard>
          </SimpleGrid>
        </RadioGroup>
        {watchDomainOwnerType === 'affiliate' && (
          <SimpleGrid cols={2} className='pt-4'>
            <AffiliateSelect<TFormInputs>
              required
              label='Owner'
              placeholder='Select Owner'
              name='domain.ownerId'
            />
          </SimpleGrid>
        )}
        <Divider className='my-4' />
        <FeatureFlagMultiSelect<TFormInputs>
          label='Feature Flags'
          placeholder='Select Feature Flags'
          name='featureFlagsIds'
        />
        <SimpleGrid cols={2} className='pt-4'></SimpleGrid>
        <Group className='justify-end pt-4'>
          <Button type='submit' disabled={!form.formState.isDirty}>
            {id ? 'Update' : 'Create'}
          </Button>
        </Group>
      </form>
    </FormProvider>
  );
};
