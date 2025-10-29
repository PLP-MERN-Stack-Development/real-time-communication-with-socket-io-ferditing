import React from 'react';
import { socket } from '../socket/socket';

export default function MessageList({ messages = [] }) {
  return (
    <div className="message-list">
      {messages.map((m) => (
        <div
          key={m.id || `${m.timestamp}-${Math.random()}`}
          className={`message ${m.system ? 'system' : ''} ${m.senderId === socket?.id ? 'outgoing' : 'incoming'}`}
        >
          {m.system ? (
            <div className="system-msg">{m.message}</div>
          ) : (
            <>
              <div className="message-meta">
                <strong className="sender">{m.sender || 'Anonymous'}</strong>
                <span className="timestamp">{m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : ''}</span>
                {m.isPrivate && <span className="private-tag">private</span>}
              </div>
              <div className="message-body">{m.message}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
