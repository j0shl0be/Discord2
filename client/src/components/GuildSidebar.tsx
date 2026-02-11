import { modalController } from "@/controllers/modals";
import { useAppStore } from "@hooks/useAppStore";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AutoSizer, List, ListRowProps } from "react-virtualized";
import styled from "styled-components";
import GuildItem, { GuildSidebarListItem } from "./GuildItem";
import SidebarAction from "./SidebarAction";

const Container = styled.div`
	display: flex;
	flex: 0 0 72px;
	margin: 4px 0 0 0;

	// @media (max-width: 560px) {
	// 	display: none;
	// }

	.ReactVirtualized__List {
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* Internet Explorer 10+ */

		&::-webkit-scrollbar {
			width: 0;
			height: 0;
		}
	}
`;

const Divider = styled.div`
	height: 2px;
	width: 32px;
	border-radius: 1px;
	background-color: var(--text-disabled);
`;

function GuildSidebar() {
	const app = useAppStore();

	const navigate = useNavigate();
	const { all } = app.guilds;
	const itemCount = all.length + 4; // home, divider, guilds, admin, add server
	const adminIndex = itemCount - 2;
	const addServerIndex = itemCount - 1;

	const rowRenderer = ({ index, key, style }: ListRowProps) => {
		let element: React.ReactNode;
		if (index === 0) {
			element = (
				<SidebarAction
					key="home"
					tooltip="Home"
					icon={{ icon: "mdiHome", size: "24px" }}
					action={() => navigate("/channels/@me")}
					margin={false}
					active={app.activeGuildId === "@me"}
				/>
			);
		} else if (index === 1) {
			element = (
				<GuildSidebarListItem>
					<Divider key="divider" />
				</GuildSidebarListItem>
			);
		} else if (index === adminIndex) {
			element = (
				<SidebarAction
					key="admin"
					tooltip="Admin Panel"
					icon={{ icon: "mdiCog", size: "24px" }}
					action={() => navigate("/admin/dashboard")}
					margin={false}
					active={window.location.pathname.startsWith("/admin")}
				/>
			);
		} else if (index === addServerIndex) {
			element = (
				<SidebarAction
					key="add-server"
					tooltip="Add Server"
					icon={{ icon: "mdiPlus", size: "24px", color: "var(--success)" }}
					action={() => modalController.push({ type: "add_server" })}
					margin={false}
					disablePill
					useGreenColorScheme
				/>
			);
		} else {
			const guild = all[index - 2];
			element = <GuildItem key={key} guild={guild} />;
		}

		return <div style={style}>{element}</div>;
	};

	return (
		<Container>
			<AutoSizer>
				{({ width, height }) => (
					<List
						height={height}
						overscanRowCount={2}
						rowCount={itemCount}
						rowHeight={({ index }) => {
							if (index === 1) return 8; // divider
							return 56; // item is 48 + 8 top margin
						}}
						rowRenderer={rowRenderer}
						width={width}
					/>
				)}
			</AutoSizer>
		</Container>
	);
}

export default observer(GuildSidebar);
