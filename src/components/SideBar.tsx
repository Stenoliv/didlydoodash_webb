import { ReactNode, useState } from "react";
import styles from "../styles/sidebar.module.css";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";

import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";

import FolderIcon from "@mui/icons-material/Folder";
import FolderOffRoundedIcon from "@mui/icons-material/FolderOffRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Badge } from "@mui/material";

export default function SideBar() {
	const [open, setopen] = useState(true);

	const toggleOpen = () => {
		setopen(!open);
	};

	return (
		<div className={open ? styles.sidenav : styles.sidenavClosed}>
			<button className={styles.menuBtn} onClick={toggleOpen}>
				{open ? (
					<KeyboardDoubleArrowLeftIcon />
				) : (
					<KeyboardDoubleArrowRightIcon />
				)}
			</button>
			<>
				<ExpandableNavItem
					to="/organisations"
					text="Organisations"
					icon={<CorporateFareIcon />}
					open={open}
					subItems={[
						{
							to: "/organisations/create",
							text: "Create",
							icon: <AddBoxRoundedIcon />,
						},
						{ to: "/organisations", text: "View", icon: <CorporateFareIcon /> },
						{
							to: "/organisations/chats",
							text: "Chats",
							icon: (
								<Badge badgeContent={0} color="primary">
									<MessageRoundedIcon />
								</Badge>
							),
						},
					]}
				/>
				<ExpandableNavItem
					to="/projects"
					text="Projects"
					icon={<FolderIcon />}
					open={open}
					subItems={[
						{
							to: "/projects/create",
							text: "Create",
							icon: <CreateNewFolderRoundedIcon />,
						},
						{
							to: "/projects",
							text: "Active",
							icon: <FolderOpenRoundedIcon />,
						},
						{
							to: "/projects/completed",
							text: "Completed",
							icon: <FolderRoundedIcon />,
						},
						{
							to: "/projects/archived",
							text: "Archived",
							icon: <FolderOffRoundedIcon />,
						},
					]}
				/>
			</>
		</div>
	);
}

export type NavItemProps = {
	to: string;
	icon: ReactNode;
	text: string;
	open: boolean;
};

export function NavItem(props: NavItemProps) {
	const location = useLocation();
	const { to, icon, text, open } = props;

	const isActive = location.pathname === to;

	return (
		<NavLink
			key={0}
			className={`${styles.sideitem} ${isActive ? styles.active : ""}`}
			to={to}
		>
			{icon}
			<span className={open ? styles.linkText : styles.linkTextClosed}>
				{text}
			</span>
		</NavLink>
	);
}

export interface ItemProperties {
	to: string;
	text: string;
	icon?: ReactNode | null;
}

export type ExpandableNavItemProps = NavItemProps & {
	subItems?: ItemProperties[];
};

// Expandable navigation item with sub-items
export function ExpandableNavItem(props: ExpandableNavItemProps) {
	const location = useLocation().pathname.split("/")[1];
	const { to, text, icon, open, subItems } = props;
	const [expanded, setExpanded] = useState(false);

	const active = `/${location}` === to ? true : false;
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
			{/* Sub-items */}
			{expanded &&
				open &&
				subItems?.map((subItem, index) => {
					return (
						<NavItem
							key={index}
							to={subItem.to}
							text={subItem.text}
							icon={subItem.icon} // Optional: no icon for sub-items
							open={open}
						/>
					);
				})}
		</div>
	);
}
