import Button from "@components/Button";
import Text from "@components/Text";
import { SectionHeader } from "@components/SectionHeader";
import { useAppStore } from "@hooks/useAppStore";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: auto;
`;

const Section = styled.div`
	padding: 16px;
	border-bottom: 1px solid var(--background-modifier-accent);
`;

const List = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const Row = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
`;

const Label = styled.span`
	font-weight: 500;
`;

type AdminUser = {
	id: string;
	username: string;
	discriminator: string;
	email?: string | null;
	disabled: boolean;
	deleted: boolean;
	flags: number;
	rights: string;
	created_at: string;
};

type AdminSettings = {
	register: {
		requireInvite: boolean;
		disabled: boolean;
		allowNewRegistration: boolean;
	};
	guild: {
		autoJoin: {
			enabled: boolean;
			guilds: string[];
			canLeave: boolean;
			bots: boolean;
		};
	};
};

function AdminDashboard() {
	const app = useAppStore();
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [users, setUsers] = React.useState<AdminUser[]>([]);
	const [settings, setSettings] = React.useState<AdminSettings | null>(null);

	const load = React.useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [settingsRes, usersRes] = await Promise.all([
				app.rest.get<AdminSettings>("/admin/settings"),
				app.rest.get<{ users: AdminUser[] }>("/admin/users"),
			]);
			setSettings(settingsRes);
			setUsers(usersRes.users);
		} catch (e: any) {
			// if the backend rejects with a JSON error, try to surface a simple message
			const message = e?.message || e?.error || "You do not have permission to view the admin panel.";
			setError(typeof message === "string" ? message : "Failed to load admin data");
		} finally {
			setLoading(false);
		}
	}, [app]);

	React.useEffect(() => {
		void load();
	}, [load]);

	const toggleUserDisabled = async (user: AdminUser) => {
		try {
			const updated = await app.rest.patch<Partial<AdminUser>, AdminUser>(`/admin/users/${user.id}`, {
				disabled: !user.disabled,
			});
			setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, disabled: updated.disabled } : u)));
		} catch (e: any) {
			const message = e?.message || "Failed to update user";
			setError(typeof message === "string" ? message : "Failed to update user");
		}
	};

	const updateSettings = async (partial: Partial<AdminSettings["register"]>) => {
		if (!settings) return;
		try {
			const next: AdminSettings = {
				...settings,
				register: {
					...settings.register,
					...partial,
				},
			};
			await app.rest.patch<Partial<AdminSettings>, { ok: boolean }>("/admin/settings", {
				register: next.register,
			} as Partial<AdminSettings>);
			setSettings(next);
		} catch (e: any) {
			const message = e?.message || "Failed to update settings";
			setError(typeof message === "string" ? message : "Failed to update settings");
		}
	};

	if (loading && !settings && !users.length) {
		return (
			<Wrapper>
				<SectionHeader>
					<Text>Admin</Text>
				</SectionHeader>
				<Section>
					<Text>Loading admin data…</Text>
				</Section>
			</Wrapper>
		);
	}

	if (error) {
		return (
			<Wrapper>
				<SectionHeader>
					<Text>Admin</Text>
				</SectionHeader>
				<Section>
					<Text>{error}</Text>
					<Button palette="primary" style={{ marginTop: 8 }} onClick={() => void load()}>
						Retry
					</Button>
				</Section>
			</Wrapper>
		);
	}

	return (
		<Wrapper>
			<SectionHeader>
				<Text>Admin</Text>
				<Button palette="secondary" size="small" onClick={() => void load()}>
					Refresh
				</Button>
			</SectionHeader>

			<Section>
				<Label>Instance settings</Label>
				{settings && (
					<List style={{ marginTop: 8 }}>
						<Row>
							<Text>Registration disabled</Text>
							<Button
								palette={settings.register.disabled ? "primary" : "secondary"}
								size="small"
								onClick={() => void updateSettings({ disabled: !settings.register.disabled })}
							>
								{settings.register.disabled ? "Enable" : "Disable"}
							</Button>
						</Row>
						<Row>
							<Text>Invite required to register</Text>
							<Button
								palette={settings.register.requireInvite ? "primary" : "secondary"}
								size="small"
								onClick={() => void updateSettings({ requireInvite: !settings.register.requireInvite })}
							>
								{settings.register.requireInvite ? "Yes (click to allow open)" : "No (click to require)"}
							</Button>
						</Row>
						<Row>
							<Text>Allow new registrations</Text>
							<Button
								palette={settings.register.allowNewRegistration ? "primary" : "secondary"}
								size="small"
								onClick={() =>
									void updateSettings({ allowNewRegistration: !settings.register.allowNewRegistration })
								}
							>
								{settings.register.allowNewRegistration ? "Enabled" : "Disabled"}
							</Button>
						</Row>
					</List>
				)}
			</Section>

			<Section>
				<Label>Users</Label>
				<List style={{ marginTop: 8 }}>
					{users.map((u) => (
						<Row key={u.id}>
							<div>
								<Text>
									{u.username}#{u.discriminator}
								</Text>
								{u.email && (
									<Text style={{ fontSize: 12, opacity: 0.8 }}>
										{u.email} {u.disabled ? " • disabled" : ""}
									</Text>
								)}
							</div>
							<Button palette={u.disabled ? "secondary" : "primary"} size="small" onClick={() => void toggleUserDisabled(u)}>
								{u.disabled ? "Enable" : "Disable"}
							</Button>
						</Row>
					))}
					{!users.length && <Text>No users found.</Text>}
				</List>
			</Section>
		</Wrapper>
	);
}

export default observer(AdminDashboard);

