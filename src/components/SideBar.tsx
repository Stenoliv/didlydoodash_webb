import React, { useState } from "react";
import { navData } from "../lib/navData";
import styles from "../styles/sidebar.module.css";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { NavLink } from "react-router-dom";

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
			{navData.map((item) => {
				return (
					<NavLink key={item.id} className={styles.sideitem} to={item.link}>
						{item.icon}
						<span className={open ? styles.linkText : styles.linkTextClosed}>
							{item.text}
						</span>
					</NavLink>
				);
			})}
		</div>
	);
}
