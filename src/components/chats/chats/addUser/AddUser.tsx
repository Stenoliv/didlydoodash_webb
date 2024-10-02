import { Modal } from "@mui/material";
import "./adduser.css";

export interface AddUserProps {
	open: boolean;
	setOpen: (val: boolean) => void;
}

export default function AddUser(props: AddUserProps) {
	const { open, setOpen } = props;

	return (
		<Modal open={open} onClose={() => setOpen(false)}>
			<div>Add user</div>
		</Modal>
	);
}
