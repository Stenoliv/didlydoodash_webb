import { MenuItem, Modal, Select, SelectChangeEvent } from "@mui/material";
import "./updatemember.css";
import { OrgMember, OrgRole } from "@/utils/types";
import { useEffect, useState } from "react";
import { API } from "@/utils/api";
import { useOrgStore } from "@/stores/organisation";
import { toast } from "react-toastify";

export interface UpdateMemberProps {
	open: boolean;
	setOpen: (val: boolean) => void;
	member: OrgMember;
}

export default function UpdateMember(props: UpdateMemberProps) {
	const { open = false, setOpen, member } = props;

	const { organisation } = useOrgStore();

	const [input, setInput] = useState({
		role: member.role,
	});

	const handleRoleChange = (event: SelectChangeEvent<OrgRole>) => {
		const updatedRole = event.target.value as OrgRole;
		setInput((prevInput) => ({
			...prevInput,
			role: updatedRole,
		}));
	};

	const handleUpdateMember = () => {};

	const handleRemoveMember = () => {
		return API.delete(
			`/api/organisations/${organisation?.id}/members/${member.user.id}`
		)
			.then(() => {
				toast.success(`Removed ${member.user.username} from the organisation`);
				setOpen(false);
			})
			.catch(() => {
				toast.error("Failed to remove user!", { position: "top-left" });
			});
	};

	useEffect(() => {
		setInput({ role: member.role });
	}, [open, member]);

	return (
		<Modal open={open} onClose={() => setOpen(false)}>
			<div className="update-member-container">
				<h2>Update {member.user.username}</h2>
				<Select value={input.role} onChange={handleRoleChange}>
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
