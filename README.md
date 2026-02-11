Discord sold out to palantir and im not all about that. Built on [Spacebar](https://spacebar.chat) with single-guild, invite-only registration, and an in-app admin panel.

## Features

- **Text and voice channels** – Discord-like server with channels
- **Roles and permissions** – Per-user roles with Discord-style permission bits
- **Direct messages** – DMs between members
- **Profile photos** – Avatars and user profiles
- **Invite-only registration** – No open signups; admins create invites
- **Admin panel** – Manage users, roles, channels, and settings in-app

## Project structure

| Directory | Description |
|-----------|-------------|
| `server/` | Spacebar backend (forked) + custom admin API |
| `client/` | Spacebar web client (forked) + admin UI |
| `desktop/` | Electron wrapper for Windows |
| `mobile/` | Future React Native app (iOS/Android) |
| `infra/` | Docker, deployment config |
| `docs/` | Branding, setup, architecture notes |
| `tools/` | Helper scripts |

## Quick start

### 1. Server

```bash
cd server
npm install

# Optional: use single-guild + invite-only config
export CONFIG_PATH="$(pwd)/config.invite-single-guild.json"
# Edit config.invite-single-guild.json and set PRIMARY_GUILD_ID_HERE after creating a guild

npm run start
```

See [infra/README.md](infra/README.md) for full setup and config.

### 2. Client

```bash
cd client
npm install
npm run dev
```

Point the client at your server (instance URL) when prompted.

### 3. Desktop (optional)

```bash
cd desktop
npm install
# Start the web client first, then:
npm start
```

## License

Spacebar components are AGPL-3.0. See `server/` and `client/` for details.
