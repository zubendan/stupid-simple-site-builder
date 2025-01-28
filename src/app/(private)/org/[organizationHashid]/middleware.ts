import { NextRequest } from 'next/server';
import { auth } from '~/server/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();

  console.log({ session, request });
  // find user
  // with permissions
  // check for permissions for this page
}

export const config = {
  matcher: '/org/:organizationHashid/*',
};
