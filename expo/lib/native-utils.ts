import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { Platform } from 'react-native';

/**
 * Share a file using the native share sheet.
 */
export async function shareFile(uri: string, mimeType: string, dialogTitle: string): Promise<boolean> {
  if (await Sharing.isAvailableAsync()) {
    return Sharing.shareAsync(uri, {
      mimeType,
      dialogTitle,
      UTI: mimeType,
    }).then(() => true).catch(() => false);
  }
  return false;
}

/**
 * Copy text to the system clipboard.
 */
export async function copyToClipboard(text: string): Promise<void> {
  await Clipboard.setStringAsync(text);
}

/**
 * Get text from the system clipboard.
 */
export async function getFromClipboard(): Promise<string> {
  return Clipboard.getStringAsync();
}

/**
 * Check if the device supports sharing.
 */
export async function isShareAvailable(): Promise<boolean> {
  return Sharing.isAvailableAsync();
}
