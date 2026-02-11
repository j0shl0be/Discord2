import BannerRenderer from "@/controllers/banners/BannerRenderer";
import ChannelSidebar from "@components/ChannelSidebar";
import ContainerComponent from "@components/Container";
import GuildSidebar from "@components/GuildSidebar";
import { useAppStore } from "@hooks/useAppStore";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import AdminDashboard from "@components/admin/AdminDashboard";
import AdminUsers from "@components/admin/AdminUsers";
import AdminSettings from "@components/admin/AdminSettings";

const Container = styled(ContainerComponent)`
	display: flex;
	flex: 1;
	flex-direction: column;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
	flex: 1;
	overflow: hidden;
`;

const Content = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: auto;
	padding: 16px;
	background: var(--background-primary);
`;

const Tabs = styled.div`
	display: flex;
	gap: 8px;
	margin-bottom: 16px;
	border-bottom: 1px solid var(--background-tertiary);
	padding-bottom: 8px;
`;

const Tab = styled.button<{ $active?: boolean }>`
	background: none;
	border: none;
	color: var(--text-normal);
	cursor: pointer;
	padding: 8px 16px;
	border-radius: 4px;
	font-size: 14px;
	${(p) => p.$active && "background: var(--background-secondary); font-weight: 600;"}
	&:hover {
		background: var(--background-secondary);
	}
`;

const AccessDenied = styled.div`
	padding: 24px;
	text-align: center;
	color: var(--text-muted);
`;

function AdminPage() {
	const app = useAppStore();
	const navigate = useNavigate();
	const { section } = useParams<{ section?: string }>();
	const [accessDenied, setAccessDenied] = React.useState(false);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		app.rest
			.get<{ primaryGuildId: string | null }>("/admin")
			.then(() => setAccessDenied(false))
			.catch((err) => {
				if (err?.code === 40013 || err?.message?.includes("403")) {
					setAccessDenied(true);
				}
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<Container>
				<BannerRenderer />
				<Wrapper>
					<GuildSidebar />
					<ChannelSidebar />
					<Content>Loading admin panel...</Content>
				</Wrapper>
			</Container>
		);
	}

	if (accessDenied) {
		return (
			<Container>
				<BannerRenderer />
				<Wrapper>
					<GuildSidebar />
					<ChannelSidebar />
					<Content>
						<AccessDenied>
							You do not have permission to access the admin panel. You need OPERATOR rights or
							MANAGE_GUILD/ADMINISTRATOR in the primary guild.
						</AccessDenied>
					</Content>
				</Wrapper>
			</Container>
		);
	}

	const activeSection = section || "dashboard";

	return (
		<Container>
			<BannerRenderer />
			<Wrapper>
				<GuildSidebar />
				<ChannelSidebar />
				<Content>
					<Tabs>
						<Tab $active={activeSection === "dashboard"} onClick={() => navigate("/admin/dashboard")}>
							Dashboard
						</Tab>
						<Tab $active={activeSection === "users"} onClick={() => navigate("/admin/users")}>
							Users
						</Tab>
						<Tab $active={activeSection === "settings"} onClick={() => navigate("/admin/settings")}>
							Settings
						</Tab>
					</Tabs>
					{activeSection === "dashboard" && <AdminDashboard />}
					{activeSection === "users" && <AdminUsers />}
					{activeSection === "settings" && <AdminSettings />}
				</Content>
			</Wrapper>
		</Container>
	);
}

export default observer(AdminPage);
