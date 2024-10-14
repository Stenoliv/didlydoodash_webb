import { UserItem } from "@/components/users/item/User";
import { API } from "@/utils/api";
import { OrgMember, User } from "@/utils/types";
import { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import "./list.css";
import { useOrgStore } from "@/stores/organisation";

export type UserListProps = {
	userAction?: (user: User) => void;
	filter?: User[];
};

interface MemberResponse {
	members: OrgMember[];
}

export default function UserList(props: UserListProps) {
	const { userAction, filter } = props;

	// Users list
	const [users, setUsers] = useState<User[]>([]);

	const { isLoading, isError, error } = useQuery<MemberResponse, Error>(
		["users", filter],
		userLoader,
		{
			onSuccess: (data) => {
				if (filter && filter.length > 0) {
					const filtered = data.members
						.map((member) => member.user)
						.filter((user) => !filter.some((fUser) => fUser.id === user.id));
					setUsers(filtered);
				} else {
					setUsers(data.members.map((member) => member.user));
				}
			},
		}
	);

	if (isLoading) {
		return <div>Laoding...</div>;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div>
			{users &&
				Array.isArray(users) &&
				users?.map((user) => (
					<UserItem key={user.id} user={user} userAction={userAction} />
				))}
		</div>
	);
}

const userLoader = async () => {
	try {
		const { organisation } = useOrgStore.getState();
		const result = await API.get(`/organisations/${organisation?.id}/members`);
		return result.data;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		toast.error(`Failed to get users error message: ${error?.message}`, {
			position: "top-left",
		});
	}
};
