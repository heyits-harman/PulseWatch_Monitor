import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(
  process.env.REDIS_URL || 'redis://localhost:6379',
  {
    maxRetriesPerRequest: null,
  }
);

redis.on('error', (err) => {
  console.log("Redis not Connected: ", err.message);
})

redis.on('connect', () => {
  console.log("Redis is Connected");
})

const subscriber = redis.duplicate();

export { redis, subscriber };