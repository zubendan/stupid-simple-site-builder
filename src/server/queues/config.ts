import { Queue } from 'bullmq';
import { env } from '~/env';
import { Queues } from './types';

// Example queue setup
export const myQueue = new Queue(Queues.DEFAULT, {
  connection: {
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT),
    password: env.REDIS_PASSWORD,
    ...(env.REDIS_SSL && {
      tls: {
        rejectUnauthorized: false,
      },
    }),
  },
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});
