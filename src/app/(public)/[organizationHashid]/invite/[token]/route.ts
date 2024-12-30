import { isBefore } from 'date-fns';
import { redirect } from 'next/navigation';
import { auth } from '~/server/auth';
import { api } from '~/trpc/server';
import { routes } from '~/utils/routes';

export async function GET(
  request: Request,
  {
    params,
  }: { params: Promise<{ organizationHashid: string; token: string }> },
) {
  const now = new Date();
  const { organizationHashid, token } = await params;
  const session = await auth();

  const invite = await api.invite.find({
    token,
  });

  if (isBefore(invite.expiresAt, now)) {
    redirect(routes.INVITE_EXPIRED(organizationHashid));
  }

  if (!session || !session.user.email) {
    redirect(`${routes.SIGN_IN}?urlCallback=${request.url}`);
  }

  const user = await api.user.findByEmail({
    email: session.user.email,
  });

  await api.organization.addInvitedUser({
    organizationHashid,
    userId: user.id,
  });

  await api.invite.delete({
    token,
  });

  redirect(routes.ORGANIZATIONS);
}
