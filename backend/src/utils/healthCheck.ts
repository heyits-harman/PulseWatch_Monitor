import axios from 'axios';
import { redis } from './redis';

export async function checkUrl(url: string) {
  const start = Date.now();
  
  try {
    const response = await axios.get(url, { timeout: 5000 });
    const responseTime = Date.now() - start;
    const status = response.status >= 200 && response.status < 300 ? 'UP' : 'DOWN';

    // Store in Redis
    await redis.set(`url:${url}:status`, status);
    await redis.set(`url:${url}:time`, responseTime.toString());

    // Publish update
    await redis.publish('status-update', JSON.stringify({ url, status, time: responseTime }));

    return { url, status, time: responseTime };
  } catch (err: any) {
    const responseTime = Date.now() - start;
    
    await redis.set(`url:${url}:status`, 'DOWN');
    await redis.set(`url:${url}:time`, responseTime.toString());

    await redis.publish('status-update', JSON.stringify({ url, status: 'DOWN', time: responseTime }));

    return { url, status: 'DOWN', time: responseTime, error: err.message };
  }
}