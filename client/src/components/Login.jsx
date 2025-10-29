import React, { useState } from 'react';
import useSocket from '../hooks/useSocket';

export default function Login({ onLogin }) {
  const [name, setName] = useState('');
  const { connect } = useSocket();

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    connect(name.trim());
    onLogin(name.trim());
  };

  return (
    <div className="card login-card">
      <h2>Join Chat</h2>
      <form onSubmit={submit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
}
