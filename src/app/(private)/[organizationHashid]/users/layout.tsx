import { Divider } from '@mantine/core';

export default async function Layout({
  users,
  invites,
  params,
}: {
  children: React.ReactNode;
  users: React.ReactNode;
  invites: React.ReactNode;
  params: Promise<{ organizationHashid: string }>;
}) {
  return (
    <div className='grid grid-rows-[60vh_1fr] h-full'>
      {users}
      <div className='grid grid-rows-[auto_1fr_16px] h-full'>
        <Divider className='my-3' />
        {invites}
      </div>
    </div>
  );
}
