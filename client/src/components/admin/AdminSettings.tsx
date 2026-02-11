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

const Title = styled.h3`
	margin: 0 0 12px 0;
	font-size: 16px;
	color: var(--text-normal);
`;

const Row = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 0;
	border-bottom: 1px solid var(--background-tertiary);
	font-size: 14px;

	&:last-child {
		border-bottom: none;
	}
`;

const Label = styled.span`
	color: var(--text-normal);
`;

const Value = styled.span`
	color: var(--text-muted);
`;

const Meta = styled.p`
	margin: 0 0 12px 0;
	color: var(--text-muted);
	font-size: 13px;
`;

function AdminSettings() {
	const app = useAppStore();
	const [data, setData] = React.useState<{
		register?: { requireInvite?: boolean; allowNewRegistration?: boolean; disabled?: boolean };
		guild?: { autoJoin?: { enabled?: boolean; guilds?: string[]; canLeave?: boolean } };
		limits?: { user?: { maxGuilds?: number } };
	} | null>(null);

	React.useEffect(() => {
		app.rest.get<typeof data>("/admin/settings").then(setData).catch(console.error);
	}, []);

	if (!data) return <div>Loading settings...</div>;

	return (
		<>
			<Card>
				<Title>Instance Settings</Title>
				<Meta>Read-only view. Changes require server config or OPERATOR access.</Meta>
			</Card>
			<Card>
				<Title>Registration</Title>
				<Row>
					<Label>Require invite</Label>
					<Value>{data.register?.requireInvite ? "Yes" : "No"}</Value>
				</Row>
				<Row>
					<Label>Allow new registration</Label>
					<Value>{data.register?.allowNewRegistration ? "Yes" : "No"}</Value>
				</Row>
				<Row>
					<Label>Registration disabled</Label>
					<Value>{data.register?.disabled ? "Yes" : "No"}</Value>
				</Row>
			</Card>
			<Card>
				<Title>Guild</Title>
				<Row>
					<Label>Auto-join enabled</Label>
					<Value>{data.guild?.autoJoin?.enabled ? "Yes" : "No"}</Value>
				</Row>
				<Row>
					<Label>Can leave guild</Label>
					<Value>{data.guild?.autoJoin?.canLeave ? "Yes" : "No"}</Value>
				</Row>
				<Row>
					<Label>Auto-join guild IDs</Label>
					<Value>{(data.guild?.autoJoin?.guilds ?? []).join(", ") || "None"}</Value>
				</Row>
			</Card>
			<Card>
				<Title>Limits</Title>
				<Row>
					<Label>Max guilds per user</Label>
					<Value>{data.limits?.user?.maxGuilds ?? "—"}</Value>
				</Row>
			</Card>
		</>
	);
}

export default observer(AdminSettings);
