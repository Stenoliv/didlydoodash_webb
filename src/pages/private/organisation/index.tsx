import { API } from "@/utils/api";
import { useQuery } from "react-query";

export default function OrganisationPage() {
	const { data, isLoading, error } = useQuery("organisations", dataLoader);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	if (!data || data.length === 0) {
		return <div>No organisations available.</div>;
	}

	return data.map((organisation, index) => (
		<div key={index}>{organisation.name}</div>
	));
}

export const dataLoader = async () => {
	try {
		const result = await API.get("/api/organisations");
		return result.data.organisations;
	} catch (error) {
		throw new Error("Failed to fetch organisations: " + error.message);
	}
};
