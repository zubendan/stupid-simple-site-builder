import { redirect } from 'next/navigation';
import { routes } from '~/utils/routes';

export default async function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const { organizationHashid } = await params;
  redirect(routes.TEMPLATES(organizationHashid));
  return null;
}
