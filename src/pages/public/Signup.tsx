import { ChangeEvent, FormEvent, useState } from "react";
import "@/styles/auth.css";
import { API } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
	const [input, setInput] = useState({
		username: "",
		email: "",
		password: "",
	});

	const { login } = useAuth();

	const handleSubmitEvent = (e: FormEvent) => {
		e.preventDefault();
		if (input.username !== "" && input.email !== "" && input.password !== "") {
			return API.post("/api/auth/signup", {})
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
				<h3>Welcome new user!</h3>
				<form onSubmit={handleSubmitEvent}>
					<div className="form-field">
						<label>Username:</label>
						<input
							type="text"
							id="user-name"
							name="username"
							placeholder="name"
							aria-description="user-name"
							aria-invalid="false"
							onChange={handleInput}
						/>
					</div>
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
							placeholder="Password"
							aria-description="user-password"
							aria-invalid="false"
							onChange={handleInput}
						/>
					</div>
					<button className="">Submit</button>
				</form>
				<a href="/signin">Already signed up? Signin</a>
			</div>
		</div>
	);
}
