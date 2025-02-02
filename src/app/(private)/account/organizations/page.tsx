'use client';
import { Loader, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { CreateOrganizationButton } from '~/app/(private)/_components/organizations/CreateButton';
import { useDashboardStore } from '~/components/private/store/provider';
import { RouterOutputs, api } from '~/trpc/react';
import { routes } from '~/utils/routes';

export default function Page() {
  const router = useRouter();
  const { user } = useDashboardStore(
    useShallow((s) => ({
      user: s.user,
    })),
  );
  const { data, isLoading } = api.organization.list.useQuery({
    page: 1,
    perPage: 10,
    search: '',
    userId: user?.id ? Number(user.id) : undefined,
  });

  const organizations = data?.organizations;

  useEffect(() => {
    if (!isLoading && organizations && organizations.length > 0) {
      if (organizations[0]) {
        router.replace(routes.TEMPLATES(organizations[0].hashid));
      }
    }
  }, [isLoading]);

  const handleCreateOrganizationSuccess = (
    org: RouterOutputs['organization']['create'],
  ) => {
    router.push(routes.TEMPLATES(org.hashid));
  };

  return (
    <main className='min-h-lvh flex'>
      {isLoading || (organizations && organizations?.length > 0) ? (
        <div className='flex-1 flex justify-center items-center'>
          <Loader type='dots' size='xl' />
        </div>
      ) : (
        <div className='flex-1 flex justify-center items-center'>
          <div className='border-2 border-neutral-600 border-solid rounded-lg p-8 flex'>
            <Stack>
              Looks like you don't have any organizations yet
              <CreateOrganizationButton
                label='Create One'
                RightIcon={null}
                onSuccess={handleCreateOrganizationSuccess}
              />
            </Stack>
          </div>
        </div>
      )}
    </main>
  );
}
