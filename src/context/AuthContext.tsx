import { useContext, createContext, ReactNode } from "react";
import { User } from "@/utils/types";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth/store";
import { useOrgStore } from "@/stores/organisation";

export type AuthContextType = {
	user: User | null;
	login: (user: User) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export type AuthProviderProps = {
	children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
	const { user, setUser } = useAuthStore();
	const { setOrganisation } = useOrgStore();
	const navigate = useNavigate();

	const login = (user: User) => {
		setOrganisation(null);
		setUser(user);
		navigate("/");
	};

	const logout = () => {
		setUser(null);
		navigate("/");
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
