/**
 * Native bridge utilities for the WebView.
 *
 * The WebView injects JavaScript into the web app context. This module
 * provides helper functions for that injection and for handling messages
 * sent back from the web app via window.ReactNativeWebView.postMessage().
 */

/**
 * Build the injected JavaScript that configures the web app for mobile.
 * The server URL is passed so the web app knows where to send API requests.
 */
export function buildInjectedScript(serverUrl: string): string {
  return `
    (function() {
      // Expose mobile mode flag
      window.__VOICEBOX_MOBILE__ = true;
      window.__VOICEBOX_PLATFORM__ = 'mobile';

      // Set the server URL in Zustand's persisted store so the API client
      // reads it on first load, without waiting for React hydration.
      try {
        var raw = localStorage.getItem('voicebox-server');
        var store = raw ? JSON.parse(raw) : {};
        store.state = store.state || {};
        store.state.serverUrl = ${JSON.stringify(serverUrl)};
        store.state.mode = 'remote';
        localStorage.setItem('voicebox-server', JSON.stringify(store));
      } catch(e) {
        console.warn('[voicebox-mobile] Failed to inject server URL:', e);
      }

      // Listen for messages from React Native
      window.addEventListener('message', function(event) {
        try {
          var data = JSON.parse(event.data);
          if (data.type === 'SET_SERVER_URL') {
            var raw2 = localStorage.getItem('voicebox-server');
            var store2 = raw2 ? JSON.parse(raw2) : {};
            store2.state = store2.state || {};
            store2.state.serverUrl = data.url;
            store2.state.mode = 'remote';
            localStorage.setItem('voicebox-server', JSON.stringify(store2));
            window.location.reload();
          }
        } catch(e) {}
      });

      true;
    })();
  `;
}

/**
 * Send a message from React Native to the WebView.
 * The web app receives it via window.addEventListener('message', ...).
 */
export function sendToWebView(
  webViewRef: React.RefObject<any>,
  message: { type: string; [key: string]: unknown },
) {
  webViewRef.current?.postMessage(JSON.stringify(message));
}
