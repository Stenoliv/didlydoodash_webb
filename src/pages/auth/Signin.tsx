import { ChangeEvent, FormEvent, useState } from "react";
import "@/styles/auth.css";
import { API } from "@/utils/api";
import { useAuth } from "@/components/context/AuthContext";

export default function SignupPage() {
	const [input, setInput] = useState({
		email: "",
		password: "",
	});

	const { login } = useAuth();

	const handleSubmitEvent = (e: FormEvent) => {
		e.preventDefault();
		if (input.email !== "" && input.password !== "") {
			return API.post("/api/signin", {})
				.then((response) => {
					console.log(response);
					login(response.data.user);
				})
				.finally();
		}
		alert("Please provide a valid input");
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
				<h3>Welcome back!</h3>
				<form onSubmit={handleSubmitEvent}>
					<div className="form-field">
						<label>Email:</label>
						<input
							type="email"
							id="user-email"
							name="email"
							placeholder="example@mail.com"
							aria-description="user-email"
							aria-invalid="false"
							onChange={handleInput}
						/>
					</div>
					<div className="form-field">
						<label>Password:</label>
						<input
							type="password"
							id="user-password"
							name="password"
							placeholder=""
							aria-description="user-password"
							aria-invalid="false"
							onChange={handleInput}
						/>
					</div>
					<button className="">Submit</button>
				</form>
				<a href="/signup">Not signed up? Signup</a>
			</div>
			<div className="filler" />
		</div>
	);
}
