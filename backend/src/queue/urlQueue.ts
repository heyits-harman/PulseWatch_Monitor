import { Queue, Worker, Job, ConnectionOptions } from 'bullmq';
import { checkUrl } from '../utils/healthCheck'
import { redis } from '../utils/redis'
import dotenv from 'dotenv';

dotenv.config();

const connection: ConnectionOptions = { url: process.env.REDIS_URL || 'redis://localhost:6379' };

export const healthCheckQueue = new Queue("health-checks", { connection })

const worker = new Worker(
  "health-checks",
  async (job: Job<{ url: string }>) => {
    const urls = await redis.smembers('monitored-urls');

    await Promise.all(
      urls.map( (url: string) => {checkUrl(url)})
    ) 
  },
  { connection }
)

export async function startHealthCheckSchedule(){
  await healthCheckQueue.add(
    "check-all-urls",
    {},
    {
      repeat: {
        every: 30 * 1000, //30 seconds
      },
    }
  );
}