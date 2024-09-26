import { ChangeEvent, FormEvent, useState } from "react";
import "@/styles/auth.css";
import { API } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function SignupPage() {
	const [input, setInput] = useState({
		username: "",
		email: "",
		password: "",
		rememberMe: false,
	});

	const { login } = useAuth();

	const handleSubmitEvent = (e: FormEvent) => {
		e.preventDefault();
		if (input.username !== "" && input.email !== "" && input.password !== "") {
			return API.post("/api/auth/signup", { ...input })
				.then((response) => {
					console.log(response);
					login(response.data.user);
					toast.success(
						`Welcome to didlydoodash ${response.data.user.username}`
					);
				})
				.catch(() => {
					toast.error("Failed to signin check inputs", {
						position: "top-left",
					});
				})
				.finally();
		}
		toast.error("Please fill out the form first", {
			position: "top-left",
		});
	};

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, type, checked, value } = e.target;
		setInput((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const toggleRememberMe = () => {
		setInput((prev) => ({
			...prev,
			rememberMe: !input.rememberMe,
		}));
	};

	return (
		<div className="container">
			<div className="form">
				<h1>DidlydooDash</h1>
				<h2>Get started now</h2>
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
					<div className="form-field row">
						<div className="rememberMe" onClick={toggleRememberMe}>
							<input
								type="checkbox"
								name="rememberMe"
								checked={input.rememberMe}
								onChange={handleInput}
							/>
							<label>Remember me!</label>
						</div>
					</div>
					<button className="">Submit</button>
				</form>
				<span>
					Already signed up? <a href="/signin">Signin</a>
				</span>
			</div>
		</div>
	);
}
