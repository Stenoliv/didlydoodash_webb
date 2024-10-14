import { ChangeEvent, FormEvent, useState } from "react";
import "@/styles/auth.css";
import { API } from "@/utils/api";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
	const [input, setInput] = useState({
		email: "",
	});

	const handleSubmitEvent = (e: FormEvent) => {
		e.preventDefault();
		if (input.email !== "") {
			return API.post(`/auth/forgot`, {})
				.then((response) => {
					console.log(response);
					toast(`Password reset sent to email!`, {
						type: "success",
					});
				})
				.catch(() => {
					toast.error("Failed to send password reset", {
						position: "top-left",
					});
				})
				.finally();
		}
		toast("Please fill out the form first", {
			type: "error",
			position: "top-left",
		});
	};

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInput((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div className="container">
			<div className="form">
				<h1>DidlydooDash</h1>
				<h3>Send password reset link</h3>
				<form onSubmit={handleSubmitEvent}>
					<div className="form-field">
						<label>Email:</label>
						<input
							type="email"
							id="user-email"
							name="email"
							placeholder="example@foo.bar"
							aria-description="user-email"
							aria-invalid="false"
							onChange={handleInput}
						/>
					</div>
					<button className="">Submit</button>
				</form>
				<span>
					Try signing in again <a href="/signin">Signin</a>
				</span>
			</div>
		</div>
	);
}
