import { useContext, createContext, ReactNode, useState } from "react";
import { User } from "@/utils/types";
import { useNavigate } from "react-router-dom";

export type AuthContextType = {
	user: User | null;
	login: (username: User) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export type AuthProviderProps = {
	children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const navigate = useNavigate();

	const login = (username: User) => {
		setUser(username);
		navigate("/");
	};

	const logout = () => {
		setUser(null);
		navigate("/signin");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export default AuthProvider;
