(function () {
  try {
    // Signal readiness to the page
    Object.defineProperty(window, '__CONNECT_WEB_DEVTOOLS__', {
      value: true,
      writable: false,
      configurable: false,
      enumerable: false,
    });

    // No-op: the page is expected to call window.postMessage with
    // { type: '__GRPCWEB_DEVTOOLS__', method, methodType, request, response }
    // We do not override fetch/xhr here to keep it simple and explicit.
  } catch (e) {}
})();



