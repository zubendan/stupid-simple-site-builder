'use client';
import { useQueryStates } from 'nuqs';
import { use } from 'react';
import { api } from '~/trpc/react';
import { searchParams } from '~/utils/searchParams';
import { InviteButton } from '../../_components/organizations/InviteButton';

export default function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const [{ page, perPage, search }, setParams] = useQueryStates(searchParams);
  const { organizationHashid } = use(params);

  const { data, isLoading } = api.user.listForOrganization.useQuery({
    page,
    perPage,
    search,
    organizationHashid,
  });

  const organizationUsers = data?.organizationUsers;

  return (
    <div>
      <InviteButton organizationHashid={organizationHashid} />
      {isLoading ? (
        <div>Loading...</div>
      ) : organizationUsers && organizationUsers?.length > 0 ? (
        <>
          {organizationUsers?.map((orgUser) => (
            <div key={orgUser.user.id}>{orgUser.user.firstName}</div>
          ))}
        </>
      ) : (
        <div>Looks like there are no users yet</div>
      )}
    </div>
  );
}
