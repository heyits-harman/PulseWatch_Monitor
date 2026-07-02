import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { redis } from './utils/redis';
import urlRouter from './routes/urls'
import { startHealthCheckSchedule } from './queue/healthCheck';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', urlRouter);

app.get('/health', (req, res) => {
  res.json({ status: "Server is running"})
})

app.get('/redis-test', async (req, res) => {
  try{
    await redis.set('test-key', 'test-value');
    const value = await redis.get('test-key');
    res.json({ success: true, value });
  } catch(err){
    res.json({ success: false })
  }
})

app.listen(PORT, async () => {
  await startHealthCheckSchedule();
  console.log(`Server is running on ${PORT}`)
})