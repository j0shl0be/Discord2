# Mobile app (iOS / Android)

Future React Native app that uses the same Spacebar REST/WebSocket/Voice APIs as the web client.

## Architecture plan

- **Stack**: React Native with TypeScript
- **Auth**: Same JWT flow as web (login, register with invite code)
- **API**: REST client pointing at your Spacebar server (`/api/v9`)
- **Realtime**: WebSocket to gateway for messages, typing, presence
- **Voice**: `react-native-webrtc` for voice channels (same signaling as web)

## Shared types

Consider a `shared/` or `packages/types` package with TypeScript interfaces for:
- API request/response shapes
- WebSocket event payloads
- Voice signaling messages

This keeps backend, web client, and mobile in sync.

## iOS App Store

1. **Apple Developer account**: ~$99/year (or university fee waiver if available)
2. **Bundle ID**: e.g. `com.yourname.homeserverchat`
3. **App Store Connect**: Create app, metadata, screenshots, privacy policy
4. **TestFlight**: Internal/external testing before release
5. **App Review**: Submit with clear description of the app

See the main plan in `../.cursor/plans/` for full iOS submission details.

## Getting started (when ready)

```bash
npx react-native init HomeServerChat --template react-native-template-typescript
cd HomeServerChat
npm install react-native-webrtc
# Configure API/base URLs, add screens for login, channels, chat, DMs
```

Then implement:
1. Login/register flow (with invite code)
2. Guild/channel list
3. Message list and composer
4. DM list and DM chat
5. Voice channel join/leave (WebRTC)
6. Push notifications (optional; requires backend support)
