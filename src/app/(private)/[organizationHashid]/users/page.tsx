'use client';
import { api } from '~/trpc/react';
import { useQueryStates } from 'nuqs';
import { searchParams } from '~/utils/searchParams';

export default function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const [{ page, perPage, search }, setParams] = useQueryStates(searchParams);

  const getParams = async () => {
    const thing = await params;
    console.log({ thing });
    return thing;
  };

  getParams();

  params.then((res) => {
    console.log({ res });
  });

  const { data, isLoading } = api.user.list.useQuery({
    page,
    perPage,
    search,
    roles: [],
    // organizationHashid: (await params).organizationHashid,
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
