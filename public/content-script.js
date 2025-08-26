// Inject our page script to access the page context
(function inject() {
  try {
    // Only proceed if extension context is alive and APIs exist
    if (!(typeof window !== 'undefined' && window.chrome && chrome.runtime && typeof chrome.runtime.getURL === 'function')) return;
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.async = false;
    (document.head || document.documentElement).appendChild(script);
    script.parentNode && script.parentNode.removeChild(script);
  } catch (e) {}
})();

function isExtensionContextAlive() {
  try {
    // Accessing chrome.runtime.id can throw if the context is invalidated
    return !!(typeof chrome !== 'undefined' && chrome && chrome.runtime && chrome.runtime.id);
  } catch (e) {
    return false;
  }
}

// Listen to page events and forward them to background
function handlePageMessage(event) {
  if (event.source !== window) return;
  const message = event.data;
  if (!message || typeof message !== 'object') return;

  // If context got invalidated (e.g., extension reloaded), stop listening
  if (!isExtensionContextAlive()) {
    try { window.removeEventListener('message', handlePageMessage); } catch (_) {}
    return;
  }

  if (message.type === '__GRPCWEB_DEVTOOLS__') {
    try {
      if (isExtensionContextAlive() && typeof chrome.runtime.sendMessage === 'function') {
        chrome.runtime.sendMessage({ action: 'gRPCNetworkCall', data: message });
      }
    } catch (e) {
      // If the extension context is invalidated (e.g., extension reloaded), stop listening
      try { window.removeEventListener('message', handlePageMessage); } catch (_) {}
    }
  }
}

window.addEventListener('message', handlePageMessage);



