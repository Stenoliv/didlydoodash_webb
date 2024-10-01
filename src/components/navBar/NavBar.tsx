import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import "./navBar.css";

export default function NavBar() {
	const { user, logout } = useAuth();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const navigate = useNavigate();
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleProfileClick = () => {
		navigate("/profile");
		setAnchorEl(null);
	};

	const handleLogout = () => {
		logout();
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<header className="header">
			<Link to={"/"}>
				<h1 className="header-title">DidlydooDash</h1>
			</Link>
			{user && (
				<div className="header-profile">
					<Button
						id="basic-button"
						aria-controls={open ? "basic-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						onClick={handleClick}
					>
						<Avatar
							alt={user.username}
							src={user?.avatar || "@/assets/profile.svg"}
						/>
					</Button>
					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							"aria-labelledby": "basic-button",
						}}
					>
						<MenuItem onClick={handleProfileClick}>Profile</MenuItem>
						<MenuItem onClick={handleLogout}>Logout</MenuItem>
					</Menu>
				</div>
			)}
		</header>
	);
}
