import { Queue, Worker, Job } from 'bullmq';
import axios from "axios";
import { redis } from '../utils/redis'
import dotenv from 'dotenv';

dotenv.config();

const connection = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!, 10)
}

export const healthCheckQueue = new Queue("health-checks", { connection })

const worker = new Worker(
  "health-checks",
  async (job: Job<{ url: string }>) => {
    const urls = await redis.smembers('monitored-urls');
    const start = Date.now();

    await Promise.all(
      urls.map( async (url: string) => {
        try{
          const response = await axios.get(url, {  timeout: 5000})
          const responseTime = Date.now() - start;

          const status: "UP" | "DOWN" = response.status >= 200 && response.status < 300 ? "UP" : "DOWN";

          await redis.set(`url:${url}:status`, status);
          await redis.set(`url:${url}:time`, responseTime.toString());

          await redis.publish(
            "status-update",
            JSON.stringify({ url, status, time: responseTime})
          )

          return { url, status, time: responseTime }
        } catch(err: any){
            const responseTime = Date.now() - start;
            const status: "UP" | "DOWN" = "DOWN";

            await redis.set(`url:${url}:status`, status);
            await redis.set(`url:${url}:time`, responseTime.toString());

            await redis.publish(
              "status-update",
              JSON.stringify({ url, status, time: responseTime})
            )

            return { url, status, time: responseTime, error: err.message }
        }
      })
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