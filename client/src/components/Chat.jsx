import React from 'react';
import useSocket from '../hooks/useSocket';
import MessageList from './MessageList';
import UsersList from './UsersList';
import MessageInput from './MessageInput';

export default function Chat({ username, onLogout }) {
  const { connected, messages, users, typingUsers, sendMessage, sendPrivate, setTyping, disconnect } =
    useSocket();

  const handleLogout = () => {
    disconnect();
    onLogout();
  };

  return (
    <div className="chat-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div>
            <strong>{username}</strong>
            <div className="status">{connected ? 'online' : 'offline'}</div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <UsersList users={users} onPrivateMessage={sendPrivate} />
      </aside>

      <section className="chat-area">
        <MessageList messages={messages} />
        <div className="typing-indicator">
          {typingUsers.length > 0 && <em>{typingUsers.join(', ')} is typing...</em>}
        </div>

        <MessageInput
          onSend={(text) => sendMessage({ message: text })}
          onTyping={(isTyping) => setTyping(isTyping)}
        />
      </section>
    </div>
  );
}
