import { MenuItem, Modal, Select, SelectChangeEvent } from "@mui/material";
import "./updatemember.css";
import { ProjectMember, ProjectRole } from "@/utils/types";
import { useEffect, useState } from "react";
import { API } from "@/utils/api";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

export interface UpdateMemberProps {
	open: boolean;
	setOpen: (val: boolean) => void;
	member: ProjectMember;
}

export default function UpdateMember(props: UpdateMemberProps) {
	const { open = false, setOpen, member } = props;

	const [input, setInput] = useState({
		role: member.role,
	});

	const queryClient = useQueryClient();

	const handleRoleChange = (event: SelectChangeEvent<ProjectRole>) => {
		const updatedRole = event.target.value as ProjectRole;
		setInput((prevInput) => ({
			...prevInput,
			role: updatedRole,
		}));
	};

	const handleUpdateMember = () => {
		return API.patch(
			`/api/organisations/${member.projectId}/members/${member.user.id}`,
			{ ...input }
		)
			.then(() => {
				toast.success(`Member ${member.user.username} updated!`);
				queryClient.invalidateQueries("members");
				setOpen(false);
			})
			.catch((error) => {
				toast.error(
					`Failed to update member: ${member.user.username}, Error: ${error.message}`,
					{ position: "top-left" }
				);
			});
	};

	const handleRemoveMember = () => {
		return API.delete(
			`/api/organisations/${member.projectId}/members/${member.user.id}`
		)
			.then(() => {
				toast.success(`Removed ${member.user.username} from the organisation`);
				queryClient.invalidateQueries("members");
				setOpen(false);
			})
			.catch((error) => {
				toast.error("Failed to remove user! Error: " + error.message, {
					position: "top-left",
				});
			});
	};

	useEffect(() => {
		setInput({ role: member.role });
	}, [open, member]);

	return (
		<Modal open={open} onClose={() => setOpen(false)}>
			<div className="update-member-container">
				<h2>Update {member.user.username}</h2>
				<Select value={input.role} name="role" onChange={handleRoleChange}>
					{Object.keys(ProjectRole).map((key) => (
						<MenuItem
							key={key}
							value={ProjectRole[key as keyof typeof ProjectRole]}
						>
							{ProjectRole[key as keyof typeof ProjectRole]}
						</MenuItem>
					))}
				</Select>
				<button onClick={handleUpdateMember}>Update</button>
				<div className="danger-zone">
					<span>Danger Zone:</span>
					<button onClick={handleRemoveMember}>Remove User</button>
				</div>
			</div>
		</Modal>
	);
}
