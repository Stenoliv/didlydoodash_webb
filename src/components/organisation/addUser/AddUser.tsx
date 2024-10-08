import { useState } from "react";
import "./adduser.css";
import { Modal } from "@mui/material";
import UserList from "@/components/users/list/UserList";
import { OrgMember, User } from "@/utils/types";
import { toast } from "react-toastify";
import { API } from "@/utils/api";
import { useOrgStore } from "@/stores/organisation";

export interface AddUserProps {
	members: OrgMember[];
}

export default function AddUser(props: AddUserProps) {
	const { members } = props;

	const [open, setOpen] = useState(false);

	const { organisation } = useOrgStore();

	const userAction = async (user: User | OrgMember) => {
		user = user as User;
		API.post(`/api/organisations/${organisation?.id}/members/${user.id}`)
			.then(() => {
				toast.success(`User: ${user.username} added to organisation!`);
			})
			.catch(() => {
				toast.error("Failed to add user: " + user.username, {
					position: "top-left",
				});
			})
			.finally(() => {});
	};

	return (
		<div>
			<button className="add-user-btn" onClick={() => setOpen(true)}>
				Add User
			</button>
			<Modal open={open} onClose={() => setOpen(false)}>
				<div className="add-user-container">
					<h3>Add user to organisation</h3>
					<UserList
						userAction={userAction}
						filter={members.map((member) => member.user)}
					/>
				</div>
			</Modal>
		</div>
	);
}
