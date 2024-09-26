import { ReactNode, useState } from "react";
import styles from "../styles/sidebar.module.css";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import FolderIcon from "@mui/icons-material/Folder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useAuth } from "@/context/AuthContext";

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
						{ to: "/organisations", text: "Overview" },
						{ to: "/organisations/chats", text: "Chats" },
					]}
				/>
				<ExpandableNavItem
					to="/projects"
					text="Projects"
					icon={<FolderIcon />}
					open={open}
					subItems={[
						{ to: "/projects/create", text: "Create Project" },
						{
							to: "/projects",
							text: "Active Projects",
						},
						{
							to: "/projects/completed",
							text: "Completed Projects",
						},
					]}
				/>
			</>
			<div style={{ flex: 1 }} />
			{ProfileNav(open, toggleOpen)}
		</div>
	);
}

function ProfileNav(open: boolean, toggleOpen: () => void) {
	const location = useLocation().pathname.split("/")[1];
	const active = `/${location}` === "/profile" ? true : false;

	const { user } = useAuth();

	return (
		<>
			{open ? (
				<div className={`${styles.profileDiv} ${active ? styles.active : ""}`}>
					<NavLink
						to={"/profile"}
						className={`${styles.profileRow} ${active ? styles.active : ""}`}
					>
						<img
							className={styles.profilePic}
							src="https://i.pinimg.com/originals/ae/ec/c2/aeecc22a67dac7987a80ac0724658493.jpg"
						/>
						<h4>{user?.username}</h4>
					</NavLink>
					<button>
						<span>Logout</span>
					</button>
				</div>
			) : (
				<NavLink
					to="/profile"
					className={`${styles.sideitem} ${active ? styles.active : ""}`}
					onClick={() => {
						if (!open) {
							toggleOpen();
						}
					}}
				>
					{<AccountCircleIcon />}
					<span className={open ? styles.linkText : styles.linkTextClosed}>
						Profile
					</span>
				</NavLink>
			)}
		</>
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
