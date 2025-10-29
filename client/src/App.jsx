import React from 'react';
import { SocketProvider } from './context/SocketContext';
import HomePage from './pages/HomePage';
import './styles.css';

export default function App() {
  return (
    <SocketProvider>
      <HomePage />
    </SocketProvider>
  );
}
