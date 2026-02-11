## Mobile app plan (iOS first, then Android)

Mobile clients will be built **later** and will talk to the same HTTP, WebSocket,
and voice endpoints as the web client and desktop app.

### Tech choice

- Use **React Native** with:
  - `react-native-webrtc` for voice.
  - A WebSocket client for the gateway connection.
  - Shared TypeScript interfaces (DTOs) for API payloads, shared with the
    backend and web client via a small common package.

### Initial scope

The first mobile release should support:

- Login / logout.
- Listing text channels and DMs.
- Sending and receiving messages in text channels and DMs.
- Joining and leaving voice channels with basic mute/deafen controls.

### Project layout

When implemented, this folder will contain:

- `mobile/app/` – React Native application source.
- `mobile/ios/`, `mobile/android/` – native platform projects managed by React Native.
- Shared configuration for pointing at your production Spacebar backend instance.

This document defines the agreed direction so the backend and APIs remain
compatible with the future mobile clients.

