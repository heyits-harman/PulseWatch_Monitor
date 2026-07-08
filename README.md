A real-time website and API health monitoring platform that checks the status of multiple URLs and instantly notifies you when they go down.

## 🎯 Features

- **Real-time Monitoring** - Check website/API health every 30 seconds
- **Instant Status Updates** - WebSocket-based real-time dashboard (no polling)
- **Response Time Tracking** - Monitor response times to identify performance issues
- **Simple Dashboard** - Clean UI to add, remove, and monitor URLs
- **Automatic Health Checks** - Background workers continuously monitor your sites
- **Production Ready** - Deployed on Railway (backend) and Vercel (frontend)

## 🛠️ Tech Stack

**Backend:**
- Express.js - REST API server
- Redis - Caching & Pub/Sub messaging
- Bull Queue - Scheduled background jobs
- ioredis - Redis client
- TypeScript

**Frontend:**
- React - Dashboard UI
- Axios - HTTP client
- WebSocket - Real-time updates
- Chart.js - Visualizations

**Deployment:**
- Render - Backend hosting
- Vercel - Frontend hosting
- Upstash - Cloud Redis database

## 📦 Project Structure

```
day1-uptime-monitor/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Main server entry
│   │   ├── routes/
│   │   │   └── urls.ts           # URL CRUD endpoints
│   │   ├── queue/
│   │   │   └── urlQueue.ts       # Background health check worker
│   │   ├── utils/
│   │   │   ├── redis.ts          # Redis connection
│   │   │   └── healthCheckUtil.ts # Health check logic
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Main dashboard
│   │   ├── components/
│   │   │   ├── AddURLForm.tsx    # Add URL form
│   │   │   ├── StatusGrid.tsx    # Display status cards
│   │   │   └── UptimeChart.tsx   # Charts (optional)
│   │   └── index.tsx
│   ├── .env
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Redis (local or cloud)
- Git

### Local Development

**1. Clone the repository**
```bash
git clone <repo-url>
cd day1-uptime-monitor
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create `.env`:
```
PORT=5000
REDIS_URL=redis://localhost:6379
HEALTH_CHECK_INTERVAL=30
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

**3. Setup Frontend**
```bash
cd ../frontend
npm install
```

Create `.env`:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000/ws
```

Start frontend:
```bash
npm start
```

Visit `http://localhost:3000`

## 📋 API Endpoints

### Add URL
```bash
POST /api/urls
Body: { "url": "https://google.com" }
```

### Get All URLs
```bash
GET /api/urls
```

### Delete URL
```bash
DELETE /api/urls
Body: { "url": "https://google.com" }
```

## 🔄 How It Works

1. **User adds a URL** via dashboard
2. **Immediate check** - Backend checks the URL instantly
3. **Scheduled checks** - Bull Queue checks all URLs every 30 seconds
4. **Status stored** - Results cached in Redis
5. **Real-time notification** - Pub/Sub publishes updates
6. **WebSocket sync** - Frontend receives updates instantly
7. **Dashboard updates** - React re-renders with new status

## 🌐 Live Demo

- **Frontend**: [https://pulse-watch-monitor.vercel.app](https://pulse-watch-monitor.vercel.app/)
- **Backend**: [https://pulse-watch-monitor.onrender.com](https://pulsewatch-monitor.onrender.com)

## 📚 Key Concepts Learned

- **Redis Pub/Sub** - Real-time message broadcasting
- **Bull Queue** - Background job scheduling
- **WebSocket** - Persistent client-server connection
- **Health Checks** - HTTP request monitoring
- **Caching Strategy** - Fast data retrieval with Redis

## 🚢 Deployment

**Backend (Railway):**
```bash
render login
render init
render up
```

**Frontend (Vercel):**
```bash
vercel
```

Set environment variables in deployment platforms before pushing.

## 📝 Environment Variables

### Backend
- `PORT` - Server port (default: 5000)
- `REDIS_URL` - Redis connection URL
- `HEALTH_CHECK_INTERVAL` - Check frequency in seconds
- `NODE_ENV` - Environment (development/production)

### Frontend
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_WS_URL` - WebSocket server URL

## 🛠️ Development

**Add a new URL to monitor:**
```bash
curl -X POST http://localhost:5000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

**Check status:**
```bash
curl http://localhost:5000/api/urls
```

## 📖 Technologies Used

- Express.js - Web framework
- Redis - In-memory cache
- Bull - Task queue
- React - Frontend framework
- WebSocket - Real-time communication
- TypeScript - Type safety
- Axios - HTTP client

## 🎓 Learning Outcomes

✅ Background job processing  
✅ Redis caching and pub/sub  
✅ Real-time WebSocket communication  
✅ Full-stack deployment  
✅ Production-grade monitoring  

## 📄 License

MIT

## 👤 Author

[@heyitsharman](https://twitter.com/heyitsharman_)
