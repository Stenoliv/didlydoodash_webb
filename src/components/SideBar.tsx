import React, { ReactNode, useState } from "react";
import styles from "../styles/sidebar.module.css";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { NavLink, useLocation } from "react-router-dom";

import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import FolderIcon from "@mui/icons-material/Folder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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
				<NavItem
					to="/organisations"
					text="Organisations"
					icon={<CorporateFareIcon />}
					open={open}
				/>
				<NavItem
					to="/projects"
					text="Projects"
					icon={<FolderIcon />}
					open={open}
				/>
			</>
			<div style={{ flex: 1 }} />
			<>
				<NavItem
					to="/profile"
					text="Profile"
					icon={<AccountCircleIcon />}
					open={open}
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
