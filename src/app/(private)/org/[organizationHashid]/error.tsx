'use client';
import { Button, Center } from '@mantine/core';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Center className='rounded-md bg-red-500 text-white p-4'>
      <div className='text-center'>
        <h2>Something went wrong!</h2>
        <p className='font-bold'>{error.message}</p>
        <Button className='bg-black' onClick={reset}>
          Try again
        </Button>
      </div>
    </Center>
  );
}
