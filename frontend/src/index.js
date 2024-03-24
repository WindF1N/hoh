import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Navigate from './navigate';
import { Buffer } from "buffer";
import { SocketProvider } from './sockets';

window.Buffer = Buffer;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SocketProvider>
    <Navigate />
  </SocketProvider>
);
