import { getProviders, signIn } from 'next-auth/react';

export default async function Page() {
  const providers = await getProviders();

  return (
    <div className='h-lvh w-lvw [background:linear-gradient(45deg,hsl(225_79.2%_81.2%),hsl(221_59.5%_71%),hsl(224_46.7%_61%),hsl(227_39.2%_51%),hsl(228_49.8%_40.6%))] flex justify-center items-center'>
      <div>
        <h1>Some Sign In Text</h1>
        <div>
          // a form
          {providers &&
            Object.values(providers).map((provider) => (
              <button onClick={() => signIn(provider.id)}>
                Sign in with {provider.name}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
