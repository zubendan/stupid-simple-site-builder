import { Loader } from '@mantine/core';

export default function Loading() {
  return (
    <main className='min-h-lvh flex'>
      <div className='flex-1 flex justify-center items-center'>
        <Loader type='dots' size='xl' />
      </div>
    </main>
  );
}
