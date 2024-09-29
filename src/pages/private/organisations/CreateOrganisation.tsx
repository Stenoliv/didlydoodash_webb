import { useOrgStore } from "@/stores/organisation";
import { API } from "@/utils/api";
import { Organisation } from "@/utils/types";
import { Button, FormControl, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";

interface CreateOrgInput {
	name: string | null;
	members?: OrgMemberInput[] | null;
}

interface OrgMemberInput {
	id: string;
}

export default function CreatePage() {
	const [input, setInput] = useState<CreateOrgInput>({
		name: "",
		members: [],
	});
	const { addOrganisation } = useOrgStore();

	const submitCreate = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			return API.post("/api/organisations", { ...input })
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

	return (
		<div>
			<h2>Create a new organisation</h2>
			<FormControl onSubmit={submitCreate} component="form" autoComplete="off">
				<TextField
					required
					label="Name"
					id="name"
					name="name"
					value={input.name}
					onChange={handleChange}
				/>
				<Button type="submit" variant="contained">
					Create
				</Button>
			</FormControl>
		</div>
	);
}
