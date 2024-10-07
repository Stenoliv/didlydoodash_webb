import { User } from "@/utils/types";
import "./user.css";

export interface UserItemProps {
	user: User;
	userAction?: (user: User) => void;
}

export function UserItem(props: UserItemProps) {
	const { user, userAction } = props;
	const { username } = user;

	return (
		<div
			className="user-item"
			onClick={() => {
				if (userAction) userAction(user);
			}}
		>
			<div className="texts">
				<span>{username}</span>
			</div>
		</div>
	);
}
