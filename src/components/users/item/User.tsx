import { User } from "@/utils/types";
import "./user.css";

export interface UserItemProps {
	user: User;
	userAction?: (user: User) => void;
}

export function UserItem(props: UserItemProps) {
	const { user, userAction } = props;

	const { avatar, username } = user;

	return (
		<div
			className="user-item"
			onClick={() => {
				if (userAction && user) userAction(user);
			}}
		>
			<img src={avatar || "/icons/avatars/avatar-boy.svg"} alt="" />
			<div className="texts">
				<span>{username}</span>
			</div>
		</div>
	);
}
