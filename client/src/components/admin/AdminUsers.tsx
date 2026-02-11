import { useAppStore } from "@hooks/useAppStore";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { REST } from "@utils";

const Card = styled.div`
	background: var(--background-secondary);
	border-radius: 8px;
	padding: 16px;
	margin-bottom: 16px;
`;

const Title = styled.h3`
	margin: 0 0 12px 0;
	font-size: 16px;
	color: var(--text-normal);
`;

const Input = styled.input`
	background: var(--background-tertiary);
	border: 1px solid var(--background-modifier-accent);
	border-radius: 4px;
	padding: 8px 12px;
	color: var(--text-normal);
	font-size: 14px;
	margin-bottom: 12px;
	width: 100%;
	max-width: 300px;
	box-sizing: border-box;
`;

const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
	font-size: 14px;
`;

const Th = styled.th`
	text-align: left;
	padding: 8px 12px;
	border-bottom: 1px solid var(--background-tertiary);
	color: var(--text-muted);
	font-weight: 500;
`;

const Td = styled.td`
	padding: 8px 12px;
	border-bottom: 1px solid var(--background-tertiary);
	color: var(--text-normal);
`;

const Avatar = styled.img`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	vertical-align: middle;
	margin-right: 8px;
`;

interface Member {
	id: string;
	guild_id: string;
	nick?: string;
	roles: string[];
	joined_at: string;
	user: {
		id: string;
		username: string;
		discriminator: string;
		avatar?: string;
		public_flags?: number;
		created_at: string;
	};
}

function AdminUsers() {
	const app = useAppStore();
	const [members, setMembers] = React.useState<Member[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [search, setSearch] = React.useState("");

	React.useEffect(() => {
		setLoading(true);
		app.rest
			.get<{ members: Member[] }>("/admin/users", { q: search, limit: 100 })
			.then((r) => setMembers(r.members || []))
			.catch(console.error)
			.finally(() => setLoading(false));
	}, [search]);

	if (loading && members.length === 0) return <div>Loading users...</div>;

	return (
		<Card>
			<Title>Guild Members</Title>
			<Input
				placeholder="Search by username or email..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<Table>
				<thead>
					<tr>
						<Th>User</Th>
						<Th>Nickname</Th>
						<Th>Roles</Th>
						<Th>Joined</Th>
					</tr>
				</thead>
				<tbody>
					{members.map((m) => (
						<tr key={m.id}>
							<Td>
								<Avatar
									src={
										m.user?.avatar
											? REST.makeCDNUrl(`/avatars/${m.user.id}/${m.user.avatar}.png`, { size: 32 })
											: undefined
									}
									alt=""
								/>
								{m.user?.username ?? "Unknown"}#{m.user?.discriminator ?? "0"}
							</Td>
							<Td>{m.nick || "—"}</Td>
							<Td>{m.roles?.length ?? 0} role(s)</Td>
							<Td>{m.joined_at ? new Date(m.joined_at).toLocaleDateString() : "—"}</Td>
						</tr>
					))}
				</tbody>
			</Table>
			{members.length === 0 && !loading && (
				<p style={{ color: "var(--text-muted)", marginTop: 12 }}>No members found.</p>
			)}
		</Card>
	);
}

export default observer(AdminUsers);
