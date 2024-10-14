import UserList from "@/components/users/list/UserList";
import { useOrgStore } from "@/stores/organisation";
import { API } from "@/utils/api";
import { Organisation, OrgMember, OrgRole, User } from "@/utils/types";
import { Button, FormControl, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import "./createorganisation.css";
import MemberItem from "@/components/organisation/member/item/MemberItem";
import { useAuth } from "@/context/AuthContext";

interface CreateOrgInput {
	name: string | null;
	members?: OrgMember[] | null;
}

export default function CreatePage() {
	const { user } = useAuth();
	const [input, setInput] = useState<CreateOrgInput>({
		name: "",
		members: [{ organisationId: "", role: OrgRole.CEO, user: user as User }],
	});
	const { addOrganisation } = useOrgStore();

	const submitCreate = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			return API.post("/organisations", { ...input })
				.then((response) => {
					console.log(response);
					const organisation = response.data.organisation as Organisation;
					console.log(organisation);
					addOrganisation(organisation);
					toast.success(`Created new organisation: ${organisation.name}`);
				})
				.catch(() => {
					toast.error("Failed to create organisation", {
						position: "top-left",
					});
				})
				.finally();
		} catch (error) {
			return error;
		}
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInput((prevInput) => ({
			...prevInput,
			[name]: value,
		}));
	};

	const handleUserAdd = (newMember: User) => {
		if (!input.members?.some((member) => member.user.id === newMember.id)) {
			setInput((prev) => ({
				...prev,
				members: [
					...(prev.members || []),
					{ role: OrgRole.NotSpecified as OrgRole, user: newMember },
				],
			}));
			toast.info(`${newMember.username} added to the organisation.`);
		} else {
			toast.warning(`${newMember.username} is already in the organisation.`);
		}
	};

	const handleUserRemove = (memberToRemove: OrgMember) => {
		if (user === memberToRemove.user) return;
		setInput((prev) => ({
			...prev,
			members:
				prev.members?.filter(
					(member) => member.user.id !== memberToRemove.user.id
				) || [],
		}));
		toast.info(
			`${memberToRemove.user.username} removed from the organisation.`
		);
	};

	const handleRoleChange = (updatedMember: OrgMember) => {
		setInput((prev) => ({
			...prev,
			members:
				prev.members?.map((member) =>
					member.user.id === updatedMember.user.id ? updatedMember : member
				) || [],
		}));
	};

	return (
		<div className="org-container">
			<h2>Create a new organisation</h2>
			<FormControl
				onSubmit={submitCreate}
				component="form"
				autoComplete="off"
				className="org-create-form"
			>
				<TextField
					required
					label="Name"
					id="name"
					name="name"
					value={input.name}
					onChange={handleChange}
				/>
				<span>Users in organisation:</span>
				<div>
					{input.members?.map((member) => (
						<MemberItem
							memberAction={handleUserRemove}
							onRoleChange={handleRoleChange}
							member={member}
						/>
					))}
				</div>
				<span>Users that can be added:</span>
				<UserList
					userAction={handleUserAdd}
					filter={input.members?.map((member) => member.user) || []}
					pageSize={4}
				/>
				<Button type="submit" variant="contained">
					Create
				</Button>
			</FormControl>
		</div>
	);
}
