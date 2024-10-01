import { ReactNode, useState } from "react";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Location, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Organisation } from "@/utils/types";
import { useQuery } from "react-query";
import styles from "./sidebar.module.css";

import FolderIcon from "@mui/icons-material/Folder";
import FolderOffRoundedIcon from "@mui/icons-material/FolderOffRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
	Badge,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Tooltip,
} from "@mui/material";
import { API } from "@/utils/api";
import { toast } from "react-toastify";
import {
	ChatRounded,
	DashboardRounded,
	Home,
	AddBoxRounded,
} from "@mui/icons-material";
import { useOrgStore } from "@/stores/organisation";

export default function SideBar() {
	const { isLoading, error } = useQuery<Organisation[], Error>(
		"organisations",
		organisationLoader,
		{
			onSuccess: (data) => {
				setOrganisations(data);
			},
		}
	);

	const [open, setopen] = useState(true);
	const location = useLocation();
	const { organisation, setOrganisation, organisations, setOrganisations } =
		useOrgStore();

	// Functions
	const handleChange = (event: SelectChangeEvent) => {
		const selectedOrganisationId = event.target.value as string;
		const selectedOrganisation =
			organisations.find((org) => org.id === selectedOrganisationId) ||
			undefined;
		setOrganisation(selectedOrganisation);
	};

	const toggleOpen = () => {
		setopen(!open);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error != null) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className={open ? styles.sidenav : styles.sidenavClosed}>
			<Button
				onClick={toggleOpen}
				style={{
					justifyContent: open ? "flex-start" : "center",
					margin: 10,
					paddingRight: 0,
					paddingLeft: open ? 10 : 0,
					minWidth: 0,
				}}
			>
				{open ? (
					<KeyboardDoubleArrowLeftIcon />
				) : (
					<KeyboardDoubleArrowRightIcon />
				)}
			</Button>
			<>
				<NavItem to={"/"} text="Home" icon={<Home />} open={open} />
				{organisations && organisations.length > 0 && (
					<Tooltip
						title={
							organisation != null
								? `Organisation: ${organisation.name}`
								: "Choose organisation"
						}
						placement="right"
					>
						<FormControl>
							<InputLabel
								style={{
									marginTop: 10,
									marginBottom: 5,
									marginRight: open ? 10 : 0,
									marginLeft: open ? 20 : 0,
								}}
								id="organisation-label"
							>
								Organisations
							</InputLabel>
							<Select
								style={{
									marginTop: 10,
									marginBottom: 5,
									marginRight: open ? 10 : 0,
									marginLeft: open ? 20 : 0,
								}}
								size="small"
								labelId="organisation-label"
								label="Organisations"
								id="organisation-select"
								value={organisation?.id}
								onChange={handleChange}
							>
								{organisations?.map((org) => (
									<MenuItem key={org.id} value={org.id}>
										{org.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Tooltip>
				)}
			</>
			<NavItem
				to={"/organisations/create"}
				text="Create"
				icon={<AddBoxRounded />}
				tooltip="New organisation"
				open={open}
			/>
			{organisation && organisations && organisations.length > 0 && (
				<>
					<NavItem
						to={"/organisations"}
						text="Dashboard"
						icon={<DashboardRounded />}
						tooltip="Dashboard for organisation"
						open={open}
					/>
					<NavItem
						to={"/organisations/chats"}
						text="Chats"
						icon={
							<Badge showZero>
								<ChatRounded />
							</Badge>
						}
						tooltip="Organisation chats"
						open={open}
					/>
					<ExpandableNavItem
						to="/projects"
						text="Projects"
						icon={<FolderIcon />}
						tooltip="Projects folder"
						open={open}
						location={location}
						subItems={[
							{
								to: "/projects/create",
								text: "Create",
								icon: <CreateNewFolderRoundedIcon />,
								tooltip: "New project",
							},
							{
								to: "/projects",
								text: "Active",
								icon: <FolderOpenRoundedIcon />,
								tooltip: "Active projects",
							},
							{
								to: "/projects/completed",
								text: "Completed",
								icon: <FolderRoundedIcon />,
								tooltip: "Completed projects",
							},
							{
								to: "/projects/archived",
								text: "Archived",
								icon: <FolderOffRoundedIcon />,
								tooltip: "Archived projects",
							},
						]}
					/>
				</>
			)}
		</div>
	);
}

const organisationLoader = async () => {
	try {
		const result = await API.get("/api/organisations");
		return result.data.organisations;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		toast.error(
			`Failed to get organisations error message: ${error?.message}`,
			{
				position: "top-left",
			}
		);
	}
};

export type NavItemProps = {
	to: string;
	icon: ReactNode;
	text: string;
	open: boolean;
	tooltip?: string;
};

export const NavItem = (props: NavItemProps) => {
	const location = useLocation();
	const { to, icon, text, open, tooltip } = props;

	const isActive = location.pathname === to;

	return tooltip ? (
		<Tooltip title={tooltip} placement="right">
			<NavLink
				to={to}
				className={`${styles.sideitem} ${isActive ? styles.active : ""}`}
			>
				{icon}
				<span className={open ? styles.linkText : styles.linkTextClosed}>
					{text}
				</span>
			</NavLink>
		</Tooltip>
	) : (
		<NavLink
			to={to}
			className={`${styles.sideitem} ${isActive ? styles.active : ""}`}
		>
			{icon}
			<span className={open ? styles.linkText : styles.linkTextClosed}>
				{text}
			</span>
		</NavLink>
	);
};

export interface ItemProperties {
	to: string;
	text: string;
	icon?: ReactNode | null;
	tooltip?: string;
}

export type ExpandableNavItemProps = NavItemProps & {
	subItems?: ItemProperties[];
	location: Location;
};

// Expandable navigation item with sub-items
export const ExpandableNavItem = (props: ExpandableNavItemProps) => {
	const { location, to, text, icon, open, subItems } = props;
	const [expanded, setExpanded] = useState(false);

	const active = `/${location.pathname.split("/")[1]}` === to ? true : false;
	const navigator = useNavigate();

	const toggleExpand = () => {
		if (!open) {
			return navigator(to);
		}
		setExpanded(!expanded);
	};

	return (
		<div className={styles.expandableItem}>
			<div
				aria-expanded={expanded}
				aria-controls={`sub-item-${text}`}
				className={`${styles.sideitem} ${active ? styles.active : ""}`}
				onClick={toggleExpand}
			>
				{icon}
				<span className={open ? styles.linkText : styles.linkTextClosed}>
					{text}
				</span>
				{open && (
					<span className={styles.expandIcon}>
						{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
					</span>
				)}
			</div>
			{expanded &&
				open &&
				subItems?.map((subItem, index) => {
					return (
						<NavItem
							key={index}
							to={subItem.to}
							text={subItem.text}
							icon={subItem.icon} // Optional: no icon for sub-items
							tooltip={subItem.tooltip}
							open={open}
						/>
					);
				})}
		</div>
	);
};
