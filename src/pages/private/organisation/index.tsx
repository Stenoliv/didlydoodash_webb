import { API } from "@/utils/api";
import { Organisation } from "@/utils/types";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

export default function OrganisationPage() {
	const { data, isLoading, error } = useQuery<Organisation[], Error>(
		"organisations",
		dataLoader
	);

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
	} catch (error: any) {
		toast.error(
			`Failed to get organisations error message: ${error?.message}`,
			{
				position: "top-left",
			}
		);
	}
};
