import { RedirectType, redirect } from 'next/navigation';
import { SearchParams } from 'nuqs/server';
import { auth } from '~/server/auth';
import { routes } from '~/utils/routes';
import { loadSearchParams } from '~/utils/searchParams';
import { AuthProviderList } from '../_components/AuthProviderList';

export default async function Page({
  searchParams,
}: { searchParams: Promise<SearchParams> }) {
  const params = await loadSearchParams(searchParams);
  const callbackUrl = params.callbackUrl;
  const session = await auth();
  if (session) {
    redirect(routes.ORGANIZATIONS, RedirectType.replace);
  }

  return (
    <div className='h-lvh w-lvw  flex justify-center items-center'>
      <div className='w-[600px] text-center'>
        <h1 className='text-6xl font-bold'>
          Welcome to <span>VERSA</span>
        </h1>
        <h1 className='text-5xl font-semibold bg-gradient-to-tr from-neutral-950 via-neutral-800 to-neutral-600 bg-clip-text text-transparent pb-6'>
          Some Sign In Text
        </h1>
        <div className='p-6'>
          {/* // a form */}

          <div className='flex justify-center'>
            <AuthProviderList callbackUrl={callbackUrl ?? undefined} />
          </div>
        </div>
      </div>
    </div>
  );
}
