import { Button, FormControl, TextField } from "@mui/material";

export default function CreateProjectPage() {
	return (
		<div>
			<FormControl component="form">
				<TextField name="name" placeholder="Name" />
				<Button variant="contained" type="submit">
					Create
				</Button>
			</FormControl>
		</div>
	);
}
