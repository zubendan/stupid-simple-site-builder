import { Divider, Stack } from '@mantine/core';

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
    <div>
      {users}
      <Divider />
      {invites}
    </div>
  );
}
