import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Radio } from 'lucide-react';

interface MonitoredUrl {
  url: string;
  status: string;
  time: string;
}

const getLatencyClass = (ms: number): string => {
  if (ms < 200) return 'fast';
  if (ms < 500) return 'medium';
  return 'slow';
};

const getStatusClass = (status: string): string => {
  if (status === 'UP') return 'up';
  if (status === 'DOWN') return 'down';
  return 'pending';
};

interface StatusGridProps {
  refreshTrigger?: number;
}

const StatusGrid: React.FC<StatusGridProps> = ({ refreshTrigger }) => {
  const [urls, setUrls] = useState<MonitoredUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/urls`);
      const data = response.data;
      if (Array.isArray(data)) {
        setUrls(data);
      } else if (Array.isArray(data.urls)) {
        setUrls(data.urls);
      } else {
        setUrls([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch URLs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    const pollInterval = setInterval(fetchStatus, 10000);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      fetchStatus();
    }
  }, [refreshTrigger]);

  useEffect(() => {
    let reconnectAttempts = 0;
    const maxReconnectDelay = 30000;

    const connectWebSocket = () => {
      const ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:5000/ws');
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttempts = 0;
      };

      ws.onmessage = (event: MessageEvent<string>) => {
        const update = JSON.parse(event.data as string);
        setUrls(prev => prev.map(u => u.url === update.url ? { ...u, status: update.status, time: update.time } : u));
      };

      ws.onclose = () => {
        wsRef.current = null;
        const delay = Math.min(1000 * 2 ** reconnectAttempts, maxReconnectDelay);
        reconnectAttempts += 1;
        reconnectTimerRef.current = setTimeout(connectWebSocket, delay);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connectWebSocket();

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, []);

  const handleDelete = async (url: string) => {
    setDeleting(url);
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/urls`, { data: { url } });
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/urls`);
      setUrls(response.data.urls);
    } catch (err: any) {
      console.error('Failed to delete URL', err);
    } finally {
      setDeleting(null);
    }
  };

  const upCount = urls.filter((u) => u.status === 'UP').length;
  const downCount = urls.filter((u) => u.status === 'DOWN').length;
  const avgTime =
    urls.length > 0
      ? Math.round(
          urls.reduce((sum, u) => sum + (parseInt(u.time, 10) || 0), 0) / urls.length
        )
      : 0;

  return (
    <>
      <div className="stats-row">
        <div className="stat-card">
          <p className="stat-label">Total Monitored</p>
          <p className="stat-value accent">{urls.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Online</p>
          <p className="stat-value success">{upCount}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Offline</p>
          <p className="stat-value danger">{downCount}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Avg Response</p>
          <p className="stat-value cyan">{avgTime}<span className="stat-unit"> ms</span></p>
        </div>
      </div>

      <div className="monitor-header">
        <h2>Endpoints</h2>
        <span className="refresh-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Real-time via WebSocket • Polls every 10s
        </span>
      </div>

      <div className="status-grid">
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading endpoints…</p>
          </div>
        )}

        {!loading && urls.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><Radio size={48} /></div>
            <h3>No endpoints yet</h3>
            <p>Add a URL above to start monitoring its uptime and response time.</p>
          </div>
        )}

        {!loading &&
          urls.map((item) => {
            const latency = parseInt(item.time, 10) || 0;
            const statusClass = getStatusClass(item.status);

            return (
              <div key={item.url} className="status-card">
                <div className="status-card-header">
                  <span className="status-card-url">{item.url}</span>
                  <span className={`status-badge ${statusClass}`}>
                    <span className="status-dot" />
                    {item.status}
                  </span>
                </div>

                <div className="status-metrics">
                  <div className="metric">
                    <p className="metric-label">Response Time</p>
                    <p className={`metric-value ${getLatencyClass(latency)}`}>
                      {latency} ms
                    </p>
                  </div>
                  <div className="metric">
                    <p className="metric-label">Health</p>
                    <p className={`metric-value ${statusClass === 'up' ? 'fast' : statusClass === 'down' ? 'slow' : ''}`}>
                      {item.status === 'UP' ? 'Healthy' : item.status === 'DOWN' ? 'Unreachable' : 'Checking…'}
                    </p>
                  </div>
                </div>

                <div className="status-card-footer">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item.url)}
                    disabled={deleting === item.url}
                  >
                    {deleting === item.url ? 'Removing…' : 'Remove'}
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default StatusGrid;
