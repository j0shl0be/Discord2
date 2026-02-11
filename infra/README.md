## Running the Spacebar-based server locally

This project vendors the Spacebar server in the `server/` directory.

For a **single private guild** with **invite-only registration**, you can use
the provided JSON config file and the `CONFIG_PATH` environment variable.

### 1. Create the primary guild

1. Start the server once with the default configuration so that migrations run and
   you can create a first account and guild using the normal Spacebar flow.
2. In the database, note the ID of the guild you want to use as your **primary** server.

### 2. Configure single-guild + invite-only behavior

1. Open `server/config.invite-single-guild.json`.
2. Replace `"PRIMARY_GUILD_ID_HERE"` under `guild.autoJoin.guilds` with your guild's ID.
3. Ensure the public endpoints (`api.endpointPublic`, `cdn.endpointPublic`,
   `cdn.endpointPrivate`, `gateway.endpointPublic`, `admin.endpointPublic`) match
   how you are exposing the services (for local dev these localhost defaults are fine).

When you start the server, set:

```bash
export CONFIG_PATH="$(pwd)/server/config.invite-single-guild.json"
cd server
npm install
npm run start
```

With this configuration:

- Registration is **invite-only** (`register.requireInvite: true`).
- New users are **auto-joined to a single primary guild** and cannot leave it
  (`guild.autoJoin.enabled: true`, `guild.autoJoin.guilds` set, `guild.autoJoin.canLeave: false`).
- Users are limited to **one guild** (`limits.user.maxGuilds: 1`).

