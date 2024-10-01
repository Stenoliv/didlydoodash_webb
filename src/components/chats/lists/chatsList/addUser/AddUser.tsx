import "./adduser.css";

export default function AddUser() {
	return (
		<div className="addUser">
			<form>
				<input type="text" placeholder="Username" name="username" />
				<button>Search</button>
			</form>
			{/** if user show and add button to add to chat */}
		</div>
	);
}
