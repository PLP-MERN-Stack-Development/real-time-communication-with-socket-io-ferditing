import React, { useState } from 'react';
import Login from '../components/Login';
import Chat from '../components/Chat';

export default function HomePage() {
  const [username, setUsername] = useState(null);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>Socket.io Chat</h1>
          <span className="sub">Real-time • Private • Modern</span>
        </div>
      </header>

      <main className="app-main">
        {!username ? (
          <div className="center-card">
            <Login onLogin={(name) => setUsername(name)} />
          </div>
        ) : (
          <Chat username={username} onLogout={() => setUsername(null)} />
        )}
      </main>
    </div>
  );
}
