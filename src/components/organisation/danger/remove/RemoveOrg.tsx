import { Modal } from "@mui/material";
import "./removeorg.css";
import { useOrgStore } from "@/stores/organisation";
import { ChangeEvent, FormEvent, useState } from "react";
import { API } from "@/utils/api";
import { toast } from "react-toastify";

export interface RemoveOrgProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export default function RemoveOrg(props: RemoveOrgProps) {
	const { open, setOpen } = props;
	const { organisation, setOrganisation, removeOrganisation } = useOrgStore();
	const [input, setInput] = useState({
		orgName: "",
		password: "",
	});

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		return API.delete(`/organisations/${organisation?.id}`, {
			data: { ...input },
		})
			.then(() => {
				toast.success(
					`Organisation ${organisation?.name} was removed successfully`
				);
				if (organisation) removeOrganisation(organisation);
				setOrganisation(null);
			})
			.catch((error) => {
				toast.error("Failed to delete organisation: " + error.message, {
					position: "top-left",
				});
			});
	};

	const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setInput((prevInput) => ({
			...prevInput,
			[name]: value,
		}));
	};

	return (
		<Modal open={open} onClose={() => setOpen(false)}>
			<div className="delete-org-container">
				<div className="texts">
					<h2>Delete organisation</h2>
					<p>
						Type <span>{organisation?.name}</span> to confirm that you want to
						delete this organisation
					</p>
				</div>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						name="orgName"
						placeholder="Write the name of the organisation to confirm delete action"
						value={input.orgName}
						onChange={handleInput}
					/>
					<input
						type="password"
						name="password"
						placeholder="Your password"
						aria-description="user-password"
						value={input.password}
						onChange={handleInput}
					/>
					<input type="submit" value={"Remove Organisation"} />
				</form>
			</div>
		</Modal>
	);
}
