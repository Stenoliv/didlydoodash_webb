import { MenuItem, Modal, Select, SelectChangeEvent } from "@mui/material";
import "./updatemember.css";
import { OrgMember, OrgRole } from "@/utils/types";
import { useEffect, useState } from "react";
import { API } from "@/utils/api";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

export interface UpdateMemberProps {
	open: boolean;
	setOpen: (val: boolean) => void;
	member: OrgMember;
}

export default function UpdateMember(props: UpdateMemberProps) {
	const { open = false, setOpen, member } = props;

	const [input, setInput] = useState({
		role: member.role,
	});

	const queryClient = useQueryClient();

	const handleRoleChange = (event: SelectChangeEvent<OrgRole>) => {
		const updatedRole = event.target.value as OrgRole;
		setInput((prevInput) => ({
			...prevInput,
			role: updatedRole,
		}));
	};

	const handleUpdateMember = () => {
		return API.patch(
			`/organisations/${member.organisationId}/members/${member.user.id}`,
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
			`/organisations/${member.organisationId}/members/${member.user.id}`
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
					{Object.keys(OrgRole).map((key) => (
						<MenuItem key={key} value={OrgRole[key as keyof typeof OrgRole]}>
							{OrgRole[key as keyof typeof OrgRole]}
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
