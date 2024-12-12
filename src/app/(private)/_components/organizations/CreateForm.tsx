'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Group, Image, SimpleGrid } from '@mantine/core';
import { modals } from '@mantine/modals';
import NextImage from 'next/image';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { TextInput, FileInput } from 'react-hook-form-mantine';
import { z } from 'zod';

import { api } from '~/trpc/react';

export const schema = z.object({
  name: z.string(),
  image: z.any(),
});

export type TFormInputs = z.infer<typeof schema>;

export const OrganizationUpdateCreateForm = () => {
  const form = useForm<TFormInputs>({
    resolver: zodResolver(schema),
  });

  const utils = api.useUtils();
  const { mutateAsync: createMutation } = api.organization.create.useMutation();

  const onSubmit: SubmitHandler<TFormInputs> = async (values) => {
    const data = await createMutation({
      name: values.name,
      image: values.image
        ? URL.createObjectURL(values.image)
        : 'https://placehold.co/150x150/png?text=Placeholder',
    });
    if (data) {
      modals.closeAll();
      form.reset();
      await utils.organization.list.invalidate();
    }
  };

  const imageFile = form.watch('image') as File | undefined;
  const imagePath = imageFile ? URL.createObjectURL(imageFile) : undefined;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid grid-cols-[100px_1fr] grid-rows-1 items-end'>
          <Image
            className='flex justify-center items-center bg-neutral-300'
            component={NextImage}
            src={imagePath || null}
            alt='Placeholder'
            height={150}
            width={150}
            fallbackSrc='https://placehold.co/150x150/png?text=Placeholder'
          />
          <div className='w-80 pl-5'>
            <FileInput<TFormInputs>
              label="Organization's Logo"
              placeholder='Upload Organization Logo'
              name='image'
              accept={[
                MIME_TYPES.png,
                MIME_TYPES.svg,
                MIME_TYPES.jpeg,
                MIME_TYPES.webp,
                MIME_TYPES.heic,
                MIME_TYPES.heif,
                MIME_TYPES.avif,
              ].join(',')}
            />
          </div>
        </div>
        <Divider className='my-4' />
        <SimpleGrid cols={2}>
          <TextInput<TFormInputs>
            required
            label='Name'
            placeholder='Enter Organization Name'
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
