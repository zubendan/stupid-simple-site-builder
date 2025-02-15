import { use } from 'react';

export default function Page({
  params,
}: { params: Promise<{ organizationHashid: string; domainHashid: string }> }) {
  const { organizationHashid, domainHashid } = use(params);
  return <div>Domain {domainHashid}</div>;
}
