import "./userlist.css";
import { API } from "@/utils/api";
import { toast } from "react-toastify";
import { UserItem } from "../item/User";
import { Pagination } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useQuery } from "react-query";
import { User } from "@/utils/types";

export type UserPage = {
	data: User[];
	total: number;
	currentPage: number;
	totalPages: number;
};

export type UserListProps = {
	userAction?: (user: User) => void;
	filter?: User[];
	pageSize?: number;
};

export default function UserList(props: UserListProps) {
	const { userAction, filter, pageSize = 10 } = props;

	const [page, setPage] = useState(0);

	// Users list
	const [users, setUsers] = useState<UserPage>({} as UserPage);

	const { isLoading, isError, error } = useQuery<UserPage, Error>(
		["users", page, filter],
		() => userLoader(page, pageSize),
		{
			onSuccess: (data) => {
				console.log(filter);
				console.log(data.data);
				if (filter && filter.length > 0) {
					const filtered = data.data.filter(
						(user) => !filter.some((fUser) => fUser.id === user.id)
					);
					setUsers({ ...data, data: filtered });
				} else {
					setUsers(data);
				}
			},
		}
	);

	const handlePageChange = (_: ChangeEvent<unknown>, page: number) => {
		setPage(page - 1);
	};

	if (isLoading) {
		return <div>Laoding...</div>;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div>
			{users &&
				Array.isArray(users.data) &&
				users?.data.map((user) => (
					<UserItem key={user.id} user={user} userAction={userAction} />
				))}
			<Pagination
				count={users?.totalPages} // Adjust pagination count
				page={page + 1} // Adjust for 1-based pagination
				onChange={handlePageChange}
			/>
		</div>
	);
}

const userLoader = async (page: number, pageSize: number = 10) => {
	try {
		const result = await API.get(
			`/api/users?page=${page + 1}&limits=${pageSize}`
		);
		return result.data;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		toast.error(`Failed to get users error message: ${error?.message}`, {
			position: "top-left",
		});
	}
};
