import React from 'react';

export default function UsersList({ users = [], onPrivateMessage }) {
  return (
    <div className="users-list">
      <h3>Users</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id} className="user-item">
            <div className="u-left">
              <div className="avatar" title={u.username}>
                {u.username?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="u-name">{u.username}</div>
                <div className="u-sub">online</div>
              </div>
            </div>

            <button
              onClick={() => {
                const text = prompt(`Send private message to ${u.username}:`);
                if (text && onPrivateMessage) onPrivateMessage(u.id, text);
              }}
              className="btn-small"
            >
              PM
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
