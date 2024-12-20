'use client';
import { api } from '~/trpc/react';
import { use } from 'react';
import { useQueryStates } from 'nuqs';
import { searchParams } from '~/utils/searchParams';
import { UserRoleType, allUserRoles } from '~/types/role';

export default function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const [{ page, perPage, search }, setParams] = useQueryStates(searchParams);
  const { organizationHashid } = use(params);

  const { data, isLoading } = api.user.list.useQuery({
    page,
    perPage,
    search,
    organizationHashid,
    // deleted: false,
  });

  const users = data?.users;

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : users && users?.length > 0 ? (
        <>
          {users?.map((user) => (
            <div key={user.id}>{user.firstName}</div>
          ))}
        </>
      ) : (
        <div>Looks like there are no users yet</div>
      )}
    </div>
  );
}
