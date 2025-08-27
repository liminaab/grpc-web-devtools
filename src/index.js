/* global chrome */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { App } from './App';
import './index.css';
import networkReducer, { networkLog, clearLog } from './state/network';
import toolbarReducer from './state/toolbar';
import clipboardReducer from './state/clipboard';

var port, tabId, reconnectTimer, heartbeatTimer;

function connectToBackground() {
  if (!chrome || !chrome.runtime) return;
  try {
    if (!tabId) {
      tabId = chrome.devtools.inspectedWindow.tabId;
    }
    port = chrome.runtime.connect(null, { name: 'panel' });
    port.postMessage({ tabId, action: 'init' });
    port.onMessage.addListener(_onMessageReceived);
    port.onDisconnect.addListener(() => {
      // Schedule reconnect; SW may have been suspended
      scheduleReconnect();
    });
    // Start heartbeat to keep the service worker alive and mapping fresh
    startHeartbeat();
  } catch (e) {
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectToBackground();
  }, 1000);
}

function startHeartbeat() {
  stopHeartbeat();
  try {
    // Ping every 15s; SW idle timeout is ~30s
    heartbeatTimer = setInterval(() => {
      try {
        if (port) {
          port.postMessage({ action: 'heartbeat', tabId });
        } else {
          // No port, attempt reconnect
          scheduleReconnect();
        }
      } catch (e) {
        scheduleReconnect();
      }
    }, 15000);
  } catch (e) {}
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

// Initial connection from DevTools panel
if (chrome) {
  try {
    connectToBackground();
  } catch (error) {
    console.warn('not running app in chrome extension panel');
  }
}

const store = configureStore({
  reducer: {
    network: networkReducer,
    toolbar: toolbarReducer,
    clipboard: clipboardReducer,
  },
});

function _onMessageReceived({ action, data }) {
  if (action === 'gRPCNetworkCall') {
    store.dispatch(networkLog(data));
  }
  if (action === 'tabNavigated') {
    store.dispatch(clearLog());
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
