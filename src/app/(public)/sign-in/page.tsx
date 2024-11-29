'use client';
import { getProviders, signIn } from 'next-auth/react';
import { ClientSafeProvider } from 'node_modules/next-auth/lib/client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [providers, setProviders] = useState<ClientSafeProvider[]>([]);
  useEffect(() => {
    const func = async () => {
      const providers = await getProviders();
      if (providers !== null) {
        setProviders(Object.values(providers));
      }
    };
    func();
  }, []);

  return (
    <div className='h-lvh w-lvw [background:linear-gradient(45deg,hsl(225_79.2%_81.2%),hsl(221_59.5%_71%),hsl(224_46.7%_61%),hsl(227_39.2%_51%),hsl(228_49.8%_40.6%))] flex justify-center items-center'>
      <div className='w-[600px] text-center'>
        <h1 className='text-5xl font-semibold bg-gradient-to-tr from-neutral-950 via-neutral-800 to-neutral-600 bg-clip-text text-transparent pb-6'>
          Some Sign In Text
        </h1>
        <div className='bg-white p-6 rounded-md'>
          {/* // a form */}

          {providers.map((provider) => (
            <button key={provider.id} onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
