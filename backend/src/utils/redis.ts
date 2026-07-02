import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!, 10),
  maxRetriesPerRequest: null,
})

redis.on('error', (err) => {
  console.log("Redis not Connected: ", err.message);
})

redis.on('connect', () => {
  console.log("Redis is Connected");
})

const subscriber = redis.duplicate();

export { redis, subscriber };