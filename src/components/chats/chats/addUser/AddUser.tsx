import { Modal } from "@mui/material";
import "./adduser.css";
import { API } from "@/utils/api";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { OrgMember, User } from "@/utils/types";
import { useOrgStore } from "@/stores/organisation";
import { useState } from "react";
import { useChatStore } from "@/stores/organisation/chats";

export interface AddUserProps {
	open: boolean;
	setOpen: (val: boolean) => void;
}

export default function AddUser(props: AddUserProps) {
	const { open, setOpen } = props;
	const { organisation } = useOrgStore();
	const { chatId, chats, addMember } = useChatStore();

	const [members, setMembers] = useState<OrgMember[]>([]);

	const { isLoading, isError, error } = useQuery<OrgMember[], Error>(
		["members", organisation, chatId],
		() => memberLoader(organisation?.id || ""),
		{
			onSuccess: (data) => {
				setMembers(data);
			},
		}
	);

	const handleAddMember = (user: User) => {
		return API.put(
			`/api/organisations/${organisation?.id}/chats/${chatId}/member/${user.id}`
		)
			.then((response) => {
				toast.success(`User: ${user.username} added to chat!`);
				if (chatId) addMember(chatId, response.data.member);
			})
			.catch(() => {
				toast.error(`Failed to add ${user.username} to chat`, {
					position: "top-left",
				});
			})
			.finally(() => {});
	};

	if (isLoading) return <div>Loading...</div>;

	if (isError) return <div>Error: {error.message}</div>;

	return (
		<Modal open={open} onClose={() => setOpen(false)}>
			<div className="add-user-container">
				<h2>Add user</h2>
				{members &&
					Array.isArray(members) &&
					members
						.filter(
							(member) =>
								!chats
									.find((chat) => chat.id === chatId)
									?.members.some(
										(chatMember) => chatMember.member.id === member.user.id
									) || false
						)
						.map((member) => {
							return (
								<div
									onClick={() => {
										handleAddMember(member.user);
									}}
								>
									{member.user.username}
								</div>
							);
						})}
			</div>
		</Modal>
	);
}

const memberLoader = async (id: string) => {
	try {
		const response = await API.get(`/api/organisations/${id}/members`);
		return response.data.members;
	} catch (error: any) {
		toast.error("Failed to retrive members: " + error?.message, {
			position: "top-left",
		});
	}
};
