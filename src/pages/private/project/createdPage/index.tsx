import MemberItem from "@/components/projects/member/item/MemberItem";
import { useAuth } from "@/context/AuthContext";
import { useOrgStore } from "@/stores/organisation";
import { API } from "@/utils/api";
import { ProjectMember, ProjectRole, User } from "@/utils/types";
import { Button, FormControl, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";

import "./createdpage.css";
import UserList from "@/components/projects/users/list";
import { useProjectStore } from "@/stores/projects";

interface CreateProject {
	name: string;
	members?: ProjectMember[];
}

export default function CreateProjectPage() {
	const { organisation } = useOrgStore();
	const { addProject } = useProjectStore();
	const { user } = useAuth();

	const [input, setInput] = useState<CreateProject>({
		name: "",
		members: [
			{ projectId: "", user: user || ({} as User), role: ProjectRole.Admin },
		],
	});

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setInput((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleUserAdd = (newMember: User) => {
		if (!input.members?.some((member) => member.user.id === newMember.id)) {
			setInput((prev) => ({
				...prev,
				members: [
					...(prev.members || []),
					{
						role: ProjectRole.View as ProjectRole,
						user: newMember,
					},
				],
			}));
			toast.info(`${newMember.username} added to the organisation.`);
		} else {
			toast.warning(`${newMember.username} is already in the organisation.`);
		}
	};

	const handleUserRemove = (memberToRemove: ProjectMember) => {
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

	const handleRoleChange = (updatedMember: ProjectMember) => {
		setInput((prev) => ({
			...prev,
			members:
				prev.members?.map((member) =>
					member.user.id === updatedMember.user.id ? updatedMember : member
				) || [],
		}));
	};

	const handleCreate = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		return API.post(`/organisations/${organisation?.id}/projects`, {
			...input,
		})
			.then((response) => {
				const project = response.data.project;
				addProject(project);
				toast.success(`Created new project: ${project.name}!`);
			})
			.catch((error) => {
				toast.error(
					"Failed to create project: " + error.response.data.message,
					{
						position: "top-left",
					}
				);
			});
	};

	return (
		<div className="create-project">
			<FormControl
				className="project-form"
				component="form"
				onSubmit={handleCreate}
			>
				<h2>Create Project</h2>
				<TextField
					name="name"
					label="Name"
					value={input.name}
					onChange={handleChange}
					placeholder="Project name"
				/>
				<span>Users in organisation:</span>
				<div>
					{input.members?.map((member, idx) => (
						<MemberItem
							key={idx}
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
				/>
				<Button variant="contained" type="submit">
					Create
				</Button>
			</FormControl>
		</div>
	);
}
