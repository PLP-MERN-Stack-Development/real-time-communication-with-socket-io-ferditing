import React, { createContext, useState, useEffect } from 'react';
import socket from '../socket/socket';

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onReceive = (msg) => setMessages((p) => [...p, msg]);
    const onPrivate = (msg) => setMessages((p) => [...p, msg]);
    const onUserList = (list) => setUsers(list);
    const onUserJoined = (u) =>
      setMessages((p) => [...p, { id: Date.now(), system: true, message: `${u.username} joined` }]);
    const onUserLeft = (u) =>
      setMessages((p) => [...p, { id: Date.now(), system: true, message: `${u.username} left` }]);
    const onTyping = ({ id, username, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          if (!prev.includes(username)) return [...prev, username];
          return prev;
        } else {
          return prev.filter((x) => x !== username);
        }
      });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceive);
    socket.on('private_message', onPrivate);
    socket.on('user_list', onUserList);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('typing', onTyping);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceive);
      socket.off('private_message', onPrivate);
      socket.off('user_list', onUserList);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('typing', onTyping);
    };
  }, []);

  const connect = (username) => {
    socket.connect();
    if (username) socket.emit('user_join', username);
  };

  const disconnect = () => {
    socket.disconnect();
  };

  const sendMessage = (payload) => socket.emit('send_message', payload);
  const sendPrivate = (to, message) => socket.emit('private_message', { to, message });
  const setTyping = (isTyping) => socket.emit('typing', isTyping);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        messages,
        users,
        typingUsers,
        connect,
        disconnect,
        sendMessage,
        sendPrivate,
        setTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
