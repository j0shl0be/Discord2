/*
\tSpacebar: A FOSS re-implementation and extension of the Discord.com backend.
\tCopyright (C) 2023 Spacebar and Spacebar Contributors
\t
\tThis program is free software: you can redistribute it and/or modify
\tit under the terms of the GNU Affero General Public License as published
\tby the Free Software Foundation, either version 3 of the License, or
\t(at your option) any later version.
\t
\tThis program is distributed in the hope that it will be useful,
\tbut WITHOUT ANY WARRANTY; without even the implied warranty of
\tMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
\tGNU Affero General Public License for more details.
\t
\tYou should have received a copy of the GNU Affero General Public License
\talong with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { route } from "@spacebar/api";
import { Config, Guild, User, Channel, Role, getRights } from "@spacebar/util";
import { Request, Response, Router } from "express";
import { HTTPError } from "lambert-server";

const router = Router({ mergeParams: true });

async function ensureAdmin(req: Request) {
    if (!req.user_id) {
        throw new HTTPError("Missing authentication", 401);
    }
    const rights = await getRights(req.user_id);
    rights.hasThrow("MANAGE_USERS");
}

router.get(
    "/users",
    route({
        responses: {
            200: { body: "Object" },
        },
        spacebarOnly: true,
    }),
    async (req: Request, res: Response) => {
        await ensureAdmin(req);
        const users = await User.find({
            select: ["id", "username", "discriminator", "email", "disabled", "deleted", "flags", "rights", "created_at"],
            withDeleted: false,
        } as never);
        res.json({ users });
    },
);

router.patch(
    "/users/:id",
    route({
        requestBody: "Object",
        responses: {
            200: { body: "Object" },
        },
        spacebarOnly: true,
    }),
    async (req: Request, res: Response) => {
        await ensureAdmin(req);
        const targetId = req.params.id;
        const body = req.body as { disabled?: boolean; rights?: string };

        const user = await User.findOne({ where: { id: targetId }, select: ["id", "disabled", "rights"] });
        if (!user) {
            throw new HTTPError("User not found", 404);
        }

        if (typeof body.disabled === "boolean") {
            user.disabled = body.disabled;
        }
        if (typeof body.rights === "string") {
            user.rights = body.rights;
        }

        await user.save();
        res.json({ id: user.id, disabled: user.disabled, rights: user.rights });
    },
);

router.get(
    "/guilds/:guild_id/channels",
    route({
        responses: {
            200: { body: "Object" },
        },
        spacebarOnly: true,
    }),
    async (req: Request, res: Response) => {
        await ensureAdmin(req);
        const guildId = req.params.guild_id;
        const guild = await Guild.findOne({ where: { id: guildId }, relations: { channels: true } });
        if (!guild) {
            throw new HTTPError("Guild not found", 404);
        }
        res.json({ channels: guild.channels });
    },
);

router.patch(
    "/channels/:id",
    route({
        requestBody: "Object",
        responses: {
            200: { body: "Object" },
        },
        spacebarOnly: true,
    }),
    async (req: Request, res: Response) => {
        await ensureAdmin(req);
        const channelId = req.params.id;
        const body = req.body as { name?: string; topic?: string; nsfw?: boolean; position?: number };

        const channel = await Channel.findOne({ where: { id: channelId } });
        if (!channel) {
            throw new HTTPError("Channel not found", 404);
        }

        if (typeof body.name === "string") channel.name = body.name;
        if (typeof body.topic === "string") channel.topic = body.topic;
        if (typeof body.nsfw === "boolean") channel.nsfw = body.nsfw;
        if (typeof body.position === "number") channel.position = body.position;

        await channel.save();
        res.json(channel.toJSON());
    },
);

router.get(
    "/guilds/:guild_id/roles",
    route({
        responses: {
            200: { body: "Object" },
        },
        spacebarOnly: true,
    }),
    async (req: Request, res: Response) => {
        await ensureAdmin(req);
        const guildId = req.params.guild_id;
        const guild = await Guild.findOne({ where: { id: guildId }, relations: { roles: true } });
        if (!guild) {
            throw new HTTPError("Guild not found", 404);
        }
        res.json({ roles: guild.roles });
    },
);

router.patch(
    "/roles/:id",
    route({
        requestBody: "Object",
        responses: {
            200: { body: "Object" },
        },
        spacebarOnly: true,
    }),
    async (req: Request, res: Response) => {
        await ensureAdmin(req);
        const roleId = req.params.id;
        const body = req.body as { name?: string; color?: number; permissions?: string; position?: number };

        const role = await Role.findOne({ where: { id: roleId } });
        if (!role) {
            throw new HTTPError("Role not found", 404);
        }

        if (typeof body.name === "string") role.name = body.name;
        if (typeof body.color === "number") role.color = body.color;
        if (typeof body.permissions === "string") role.permissions = body.permissions;
        if (typeof body.position === "number") role.position = body.position;

        await role.save();
        res.json(role);
    },
);

router.get(
    "/settings",
    route({
        responses: {
            200: { body: "Object" },
        },
        spacebarOnly: true,
    }),
    async (req: Request, res: Response) => {
        await ensureAdmin(req);
        const cfg = Config.get();
        res.json({
            register: {
                requireInvite: cfg.register.requireInvite,
                disabled: cfg.register.disabled,
                allowNewRegistration: cfg.register.allowNewRegistration,
            },
            guild: {
                autoJoin: cfg.guild.autoJoin,
            },
        });
    },
);

router.patch(
    "/settings",
    route({
        requestBody: "Object",
        responses: {
            200: { body: "Object" },
        },
        spacebarOnly: true,
    }),
    async (req: Request, res: Response) => {
        await ensureAdmin(req);
        const cfg = Config.get();
        const body = req.body as {
            register?: { requireInvite?: boolean; disabled?: boolean; allowNewRegistration?: boolean };
            guild?: { autoJoin?: { enabled?: boolean; canLeave?: boolean } };
        };

        if (body.register) {
            if (typeof body.register.requireInvite === "boolean") cfg.register.requireInvite = body.register.requireInvite;
            if (typeof body.register.disabled === "boolean") cfg.register.disabled = body.register.disabled;
            if (typeof body.register.allowNewRegistration === "boolean")
                cfg.register.allowNewRegistration = body.register.allowNewRegistration;
        }

        if (body.guild && body.guild.autoJoin) {
            if (typeof body.guild.autoJoin.enabled === "boolean") cfg.guild.autoJoin.enabled = body.guild.autoJoin.enabled;
            if (typeof body.guild.autoJoin.canLeave === "boolean") cfg.guild.autoJoin.canLeave = body.guild.autoJoin.canLeave;
        }

        await Config.set(cfg);
        res.json({ ok: true });
    },
);

export default router;

