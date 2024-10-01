import "./list.css";
import ChatsList from "./chatsList/ChatsList";
import UserInfo from "./userInfo/UserInfo";

export default function List() {
	return (
		<div className="list">
			<UserInfo />
			<ChatsList />
		</div>
	);
}
