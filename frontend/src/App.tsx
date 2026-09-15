import AddURLForm from './components/AddURLForm';
import StatusGrid from './components/StatusGrid';
import ThemeToggle from './components/ThemeToggle';
import { useState } from 'react';

function App() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-left">
            <a href="/" className="navbar-logo">
              <div className="navbar-logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <span className="navbar-title">PulseWatch</span>
            </a>
          </div>

          <div className="navbar-center">
            <a href="#dashboard" className="nav-link active">Dashboard</a>
            <a href="#endpoints" className="nav-link">Endpoints</a>
            <a href="#docs" className="nav-link">Docs</a>
          </div>

          <div className="navbar-right">
            <div className="live-badge">
              <span className="live-dot" />
              Live
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          Real-time monitoring
        </div>
        <h1 className="hero-title">Never miss an outage again</h1>
        <p className="hero-subtitle">
          Monitor your endpoints with instant alerts and response time tracking.
          Know exactly when something goes down — before your users do.
        </p>
        <div className="hero-actions">
          <a href="#add" className="btn btn-primary">Get started free</a>
          <a href="#endpoints" className="btn btn-ghost">View dashboard</a>
        </div>
      </section>

      <main className="main">
        <section className="add-section" id="add">
          <AddURLForm onSuccess={() => setRefresh((r) => r + 1)} />
        </section>

        <section id="endpoints">
          <StatusGrid refreshTrigger={refresh} />
        </section>
      </main>

    </div>
  );
}

export default App;
