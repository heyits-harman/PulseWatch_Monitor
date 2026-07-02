import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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


app.listen(PORT, async () => {
  await startHealthCheckSchedule();
  console.log(`Server is running on ${PORT}`)
})