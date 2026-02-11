import { useAppStore } from "@hooks/useAppStore";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";

const Card = styled.div`
	background: var(--background-secondary);
	border-radius: 8px;
	padding: 16px;
	margin-bottom: 16px;
`;

const Title = styled.h2`
	margin: 0 0 8px 0;
	font-size: 18px;
	color: var(--text-normal);
`;

const Meta = styled.p`
	margin: 0;
	color: var(--text-muted);
	font-size: 14px;
`;

function AdminDashboard() {
	const app = useAppStore();
	const [data, setData] = React.useState<{
		primaryGuildId: string | null;
		register: { requireInvite: boolean; allowNewRegistration: boolean; disabled: boolean };
	} | null>(null);

	React.useEffect(() => {
		app.rest.get<typeof data>("/admin").then(setData).catch(console.error);
	}, []);

	if (!data) return <div>Loading...</div>;

	return (
		<>
			<Card>
				<Title>Admin Panel</Title>
				<Meta>Single-guild Discord alternative – admin overview</Meta>
			</Card>
			<Card>
				<Title>Primary Guild</Title>
				<Meta>ID: {data.primaryGuildId ?? "Not configured"}</Meta>
			</Card>
			<Card>
				<Title>Registration</Title>
				<Meta>
					Invite-only: {data.register.requireInvite ? "Yes" : "No"} | New signups allowed:{" "}
					{data.register.allowNewRegistration ? "Yes" : "No"} | Registration disabled:{" "}
					{data.register.disabled ? "Yes" : "No"}
				</Meta>
			</Card>
		</>
	);
}

export default observer(AdminDashboard);
