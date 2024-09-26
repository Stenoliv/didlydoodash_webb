import { useAuth } from "@/components/context/AuthContext";

export default function ProfilePage() {
	const { user } = useAuth();

	return <div>Username: {user?.username}</div>;
}
