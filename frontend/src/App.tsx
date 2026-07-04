import AddURLForm from './components/AddURLForm';
import StatusGrid from './components/StatusGrid';
import { useState } from 'react';

function App() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">⚡</div>
            <div className="logo-text">
              <h1>PulseWatch Monitor</h1>
              <p>Real-time endpoint health tracking</p>
            </div>
          </div>
          <div className="live-badge">
            <span className="live-dot" />
            Live
          </div>
        </div>
      </header>

      <main className="main">
        <section className="add-section">
          <p className="section-label">Add Endpoint</p>
          <h2 className="section-title">Monitor a new URL</h2>
          <AddURLForm onSuccess={() => setRefresh((r) => r + 1)} />
        </section>

        <section className="monitor-section">
          <StatusGrid key={refresh} />
        </section>
      </main>
    </div>
  );
}

export default App;
