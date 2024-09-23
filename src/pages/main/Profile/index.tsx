import { useAuth } from "@/components/context/AuthContext";
import React from "react";

export default function ProfilePage() {
	const { user } = useAuth();

	return <div>Username: {user?.username}</div>;
}
