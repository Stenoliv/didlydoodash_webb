import { useAuthStore } from "@/stores/auth/store";
import "./details.css";

export default function Details() {
	const { user } = useAuthStore();

	const handleBlock = () => {};

	const handleLogout = () => {};

	const isCurrentUserBlocked = false;
	const isReceiverBlocked = false;

	return (
		<div className="detail">
			<div className="user">
				<img src={user?.avatar || "/icons/avatars/avatar-girl.svg"} alt="" />
				<h2>{user?.username}</h2>
				<p>Lorem ipsum dolor sit amet.</p>
			</div>
			<div className="info">
				<div className="option">
					<div className="title">
						<span>Chat Settings</span>
						<img src="/icons/arrow-up.svg" alt="" />
					</div>
				</div>
				<div className="option">
					<div className="title">
						<span>Chat Settings</span>
						<img src="/icons/arrow-up.svg" alt="" />
					</div>
				</div>
				<div className="option">
					<div className="title">
						<span>Privacy & help</span>
						<img src="/icons/arrow-up.svg" alt="" />
					</div>
				</div>
				<div className="option">
					<div className="title">
						<span>Shared photos</span>
						<img src="/icons/arrow-down.svg" alt="" />
					</div>
					<div className="photos">
						<div className="photoItem">
							<div className="photoDetail">
								<img
									src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
									alt=""
								/>
								<span>photo_2024_2.png</span>
							</div>
							<img src="/icons/download.svg" alt="" className="icon" />
						</div>
						<div className="photoItem">
							<div className="photoDetail">
								<img
									src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
									alt=""
								/>
								<span>photo_2024_2.png</span>
							</div>
							<img src="/icons/download.svg" alt="" className="icon" />
						</div>
						<div className="photoItem">
							<div className="photoDetail">
								<img
									src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
									alt=""
								/>
								<span>photo_2024_2.png</span>
							</div>
							<img src="/icons/download.svg" alt="" className="icon" />
						</div>
						<div className="photoItem">
							<div className="photoDetail">
								<img
									src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
									alt=""
								/>
								<span>photo_2024_2.png</span>
							</div>
							<img src="/icons/download.svg" alt="" className="icon" />
						</div>
					</div>
				</div>
				<div className="option">
					<div className="title">
						<span>Shared Files</span>
						<img src="/icons/arrow-up.svg" alt="" />
					</div>
				</div>
				<button onClick={handleBlock}>
					{isCurrentUserBlocked
						? "You are Blocked!"
						: isReceiverBlocked
						? "User blocked"
						: "Block User"}
				</button>
				<button className="logout" onClick={handleLogout}>
					Logout
				</button>
			</div>
		</div>
	);
}
