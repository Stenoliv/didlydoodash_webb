import { ChangeEvent, FormEvent, useState } from "react";
import "@/styles/auth.css";
import { API } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useAuthStore } from "@/stores/auth/store";

export default function SignupPage() {
	const [input, setInput] = useState({
		email: "",
		password: "",
		rememberMe: false,
	});

	const [passwordShown, setPasswordShown] = useState(false);

	const { login } = useAuth();
	const { setTokens } = useAuthStore();

	const handleSubmitEvent = (e: FormEvent) => {
		e.preventDefault();
		if (input.email !== "" && input.password !== "") {
			return API.post("/auth/signin", { ...input })
				.then((response) => {
					console.log(response);
					login(response.data.user);
					setTokens(response.data.tokens);
					toast.success(`Welcome back ${response.data.user.username}`);
				})
				.catch(() => {
					toast.error("Failed to signin check your credentials", {
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
				<h2>Welcome back!</h2>
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
							type={passwordShown ? "text" : "password"}
							id="user-password"
							name="password"
							placeholder="Password"
							aria-description="user-password"
							aria-invalid="false"
							onChange={handleInput}
						/>
						<img
							src={passwordShown ? "/icons/hide.svg" : "/icons/show.svg"}
							onClick={() => setPasswordShown(!passwordShown)}
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
						<a href="/forgot">Forgot password?</a>
					</div>
					<button className="">Submit</button>
				</form>
				<span>
					Not signed up? <a href="/signup">Signup</a>
				</span>
			</div>
		</div>
	);
}
