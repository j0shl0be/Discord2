/*
	Custom admin routes - instance settings (read-only subset).
*/

import { route } from "@spacebar/api";
import { Config, getPermission, getRights } from "@spacebar/util";
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
		if (permission.has("MANAGE_GUILD") || permission.has("ADMINISTRATOR")) {
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
		responses: {
			200: { body: "Object" },
			403: { body: "APIErrorResponse" },
		},
	}),
	requireAdmin,
	async (_req: Request, res: Response) => {
		const config = Config.get();
		return res.json({
			register: {
				requireInvite: config.register?.requireInvite ?? false,
				allowNewRegistration: config.register?.allowNewRegistration ?? true,
				disabled: config.register?.disabled ?? false,
			},
			guild: {
				autoJoin: config.guild?.autoJoin
					? {
							enabled: config.guild.autoJoin.enabled,
							guilds: config.guild.autoJoin.guilds,
							canLeave: config.guild.autoJoin.canLeave,
						}
					: null,
			},
			limits: {
				user: config.limits?.user ? { maxGuilds: config.limits.user.maxGuilds } : null,
			},
		});
	}
);

export default router;
