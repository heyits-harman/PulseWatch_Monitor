import express from 'express';
import { redis } from '../utils/redis';
import { checkUrl } from '../utils/healthCheck'

const router = express.Router();

router.post('/urls', async (req, res) => {
  try{
    const { url } = req.body;

    if(!url){
      return res.status(400).json({ error: "URL is required" })
    }
    await redis.sadd('monitored-urls', url);

    await checkUrl(url);

    res.json({ success: true, message: `Added ${url}` });

  } catch(err: any){
    res.status(500).json({ urlNotAdded: err.message })
  }
});

router.get('/urls', async (req, res) => {
  try{
    const urls = await redis.smembers('monitored-urls');

    const urlsWithStatus = await Promise.all(
      urls.map(async (url: string) => {
        const status = await redis.get(`url:${url}:status`);
        const time = await redis.get(`url:${url}:time`);
        return { url, status, time };
      })
    )

    res.json({ urls: urlsWithStatus });

  } catch(err: any){
    res.status(500).json({ error: err.message })
  }
})

router.delete('/urls', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    await redis.srem('monitored-urls', url);
    await redis.del(`url:${url}:status`);
    await redis.del(`url:${url}:time`);

    res.json({ success: true, message: `Removed ${url}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;