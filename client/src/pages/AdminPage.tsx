import BannerRenderer from "@/controllers/banners/BannerRenderer";
import ChannelSidebar from "@components/ChannelSidebar";
import ContainerComponent from "@components/Container";
import ErrorBoundary from "@components/ErrorBoundary";
import GuildSidebar from "@components/GuildSidebar";
import AdminDashboard from "@components/admin/AdminDashboard";
import SwipeableLayout from "@components/SwipeableLayout";
import { useAppStore } from "@hooks/useAppStore";
import { observer } from "mobx-react-lite";
import React from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";

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

function LeftPanel() {
	return (
		<div
			style={{
				display: "flex",
				flex: 1,
			}}
		>
			<GuildSidebar />
			<ChannelSidebar />
		</div>
	);
}

function RightPanel() {
	return <AdminDashboard />;
}

function AdminPage() {
	const app = useAppStore();

	React.useEffect(() => {
		// when visiting admin, clear active guild/channel selection
		app.setActiveGuildId(undefined);
		app.setActiveChannelId(undefined);
	}, []);

	if (isMobile) {
		return (
			<Container>
				<BannerRenderer />
				<SwipeableLayout leftChildren={<LeftPanel />} rightChildren={<RightPanel />}>
					<ErrorBoundary section="component">
						<AdminDashboard />
					</ErrorBoundary>
				</SwipeableLayout>
			</Container>
		);
	}

	return (
		<Container>
			<BannerRenderer />
			<Wrapper>
				<GuildSidebar />
				<ChannelSidebar />
				<ErrorBoundary section="component">
					<AdminDashboard />
				</ErrorBoundary>
			</Wrapper>
		</Container>
	);
}

export default observer(AdminPage);

