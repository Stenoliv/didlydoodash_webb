import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "@/styles/MainHeader.css";
import {
	Avatar,
	Button,
	FormControl,
	InputLabel,
	Menu,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

export default function NavBar() {
	const { user, logout } = useAuth();
	const [organisation, setOrganisation] = useState("");
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const navigate = useNavigate();

	const handleChange = (event: SelectChangeEvent) => {
		setOrganisation(event.target.value as string);
	};

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
				<h1 className="header-name">DidlydooDash</h1>
			</Link>
			{user && (
				<div>
					<FormControl>
						<InputLabel id="select-organisation-label">Organisation</InputLabel>
						<Select
							labelId="select-organisation-label"
							label="Organisation"
							id="select-organisation-select"
							defaultValue="Organisation1"
							value={organisation}
							onChange={handleChange}
						>
							<MenuItem value={"Organisation1"}>Organisation1</MenuItem>
							<MenuItem value={"Organisation2"}>Organisation2</MenuItem>
						</Select>
					</FormControl>
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
