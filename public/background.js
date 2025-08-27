const tabIdToPanelPort = new Map();

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'panel') {
    return;
  }

  function handlePortMessage(message) {
    if (!message) return;
    if ((message.action === 'init' || message.action === 'heartbeat') && typeof message.tabId === 'number') {
      tabIdToPanelPort.set(message.tabId, port);
    }
  }

  port.onMessage.addListener(handlePortMessage);

  port.onDisconnect.addListener(() => {
    for (const [tabId, p] of tabIdToPanelPort.entries()) {
      if (p === port) {
        tabIdToPanelPort.delete(tabId);
      }
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (!message) return;
  if (message.action === 'gRPCNetworkCall') {
    const tabId = sender?.tab?.id;
    const panelPort = tabIdToPanelPort.get(tabId);
    if (panelPort) {
      panelPort.postMessage({ action: 'gRPCNetworkCall', data: message.data });
    }
  }
});

// Notify panel when the inspected tab navigates to clear logs.
// Requires the panel to have registered via 'init'.
chrome.tabs && chrome.tabs.onUpdated && chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo && changeInfo.status === 'loading') {
    const panelPort = tabIdToPanelPort.get(tabId);
    if (panelPort) {
      panelPort.postMessage({ action: 'tabNavigated' });
    }
  }
});



