import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_URL_KEY = 'voicebox-server-url';

/**
 * The URL of the web app build that the WebView loads.
 * In development, this points to the Vite dev server serving the web/ build.
 * In production, this could be a bundled static build or the backend itself.
 */
export const WEB_APP_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://127.0.0.1:17493';

/**
 * Get the saved server URL from persistent storage.
 */
export async function getServerUrl(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(SERVER_URL_KEY);
  } catch {
    return null;
  }
}

/**
 * Save the server URL to persistent storage.
 */
export async function setServerUrl(url: string): Promise<void> {
  await AsyncStorage.setItem(SERVER_URL_KEY, url);
}

/**
 * Clear the saved server URL (for settings / reconfiguration).
 */
export async function clearServerUrl(): Promise<void> {
  await AsyncStorage.removeItem(SERVER_URL_KEY);
}
