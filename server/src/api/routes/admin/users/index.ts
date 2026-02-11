/*
	Custom admin routes - user management.
*/

import { route } from "@spacebar/api";
import { Config, getPermission, getRights, Member, User } from "@spacebar/util";
import { Request, Response, Router } from "express";
import { SpacebarApiErrors } from "@spacebar/util";

const router = Router({ mergeParams: true });

async function requireAdmin(req: Request, _res: Response, next: (err?: unknown) => void) {
	try {
		const rights = await getRights(req.user_id!);
		if (rights.has("OPERATOR")) return next();

		const config = Config.get();
		const primaryGuilds = config.guild?.autoJoin?.guilds ?? [];
		const guildId = primaryGuilds[0];
		if (!guildId) {
			return next(SpacebarApiErrors.MISSING_RIGHTS.withParams("OPERATOR or guild admin"));
		}

		const permission = await getPermission(req.user_id!, guildId);
		if (permission.has("MANAGE_GUILD") || permission.has("ADMINISTRATOR") || permission.has("MANAGE_ROLES")) {
			return next();
		}

		next(SpacebarApiErrors.MISSING_RIGHTS.withParams("OPERATOR or guild admin"));
	} catch (e) {
		next(e);
	}
}

router.get(
	"/",
	route({
		query: {
			q: { type: "string", description: "Search by username or email" },
			limit: { type: "number", description: "Max results (default 50)" },
			after: { type: "string", description: "Pagination cursor" },
		},
		responses: {
			200: { body: "Object" },
			403: { body: "APIErrorResponse" },
		},
	}),
	requireAdmin,
	async (req: Request, res: Response) => {
		const config = Config.get();
		const primaryGuilds = config.guild?.autoJoin?.guilds ?? [];
		const guildId = primaryGuilds[0];
		if (!guildId) {
			return res.json({ users: [], members: [] });
		}

		const q = String(req.query.q || "").trim();
		const limit = Math.min(Number(req.query.limit) || 50, 100);

		// Get members of primary guild with user data
		const members = await Member.find({
			where: { guild_id: guildId },
			relations: { user: true, roles: true },
			order: { id: "ASC" },
			take: limit,
		});

		// Filter by search if provided
		let filtered = members;
		if (q) {
			const lowerQ = q.toLowerCase();
			filtered = members.filter(
				(m) =>
					m.user &&
					(m.user.username?.toLowerCase().includes(lowerQ) ||
						(m.user.email && String(m.user.email).toLowerCase().includes(lowerQ)))
			);
		}

		// Redact sensitive user fields for list view
		const result = filtered.map((m) => {
			const safeUser = m.user
				? {
						id: m.user.id,
						username: m.user.username,
						discriminator: m.user.discriminator,
						avatar: m.user.avatar,
						public_flags: m.user.public_flags,
						created_at: m.user.created_at,
					}
				: null;
			return {
				id: m.id,
				guild_id: m.guild_id,
				nick: m.nick,
				roles: m.roles?.map((r) => r.id) ?? [],
				joined_at: m.joined_at,
				user: safeUser,
			};
		});

		return res.json({ users: result.map((r) => r.user).filter(Boolean), members: result });
	}
);

export default router;
