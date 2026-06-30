# Expo + React Native for Voicebox Mobile

This is the mobile companion app for Voicebox. It wraps the web app in a native
WebView shell, giving you the full Voicebox experience on iOS and Android.

## Prerequisites

- Node.js 18+
- A running Voicebox server (Python backend on port 17493)
- Expo CLI: `npm install -g expo-cli` (or use `npx expo`)

## Quick Start

```bash
# From the repo root
bun install
cd expo
bun run dev
```

Scan the QR code with Expo Go (iOS/Android) or press `a` for Android emulator / `i` for iOS simulator.

## First Launch

1. Open the app
2. Enter your Voicebox server address (e.g. `http://192.168.1.50:17493`)
3. The server must be running and reachable from your device on the same network
4. Tap **Connect** — the web app loads and connects to your server

## Architecture

```
Expo Shell (React Native)
  └─ WebView
       └─ Web App (app/src/) loaded from the server
            └─ REST API calls → Python backend (port 17493)
```

The WebView renders the exact same web UI as the desktop/browser versions.
Native bridges handle audio playback, file sharing, and clipboard.

## Development

- `bun run dev` — Start Expo dev server with hot reload
- `bun run dev:ios` — Build and run on iOS simulator
- `bun run dev:android` — Build and run on Android emulator

## Building

- `bun run build:ios` — Build for iOS (requires EAS account)
- `bun run build:android` — Build for Android (requires EAS account)

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `EXPO_PUBLIC_SERVER_URL` | Override the default server URL | `http://127.0.0.1:17493` |
