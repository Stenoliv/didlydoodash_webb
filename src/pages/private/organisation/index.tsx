import { API } from "@/utils/api";
import { useLoaderData, useNavigation } from "react-router-dom";

export default function OrganisationPage() {
	const organisations = useLoaderData();
	const navigation = useNavigation();

	console.log(organisations);

	if (navigation.state === "loading") {
		return <div>Loading...</div>;
	}

	if (!Array.isArray(organisations)) {
		return <div>Error: Organisations data is not an array.</div>;
	}

	if (!organisations || organisations.length === 0) {
		return <div>No organisations available.</div>;
	}

	return organisations.map((organisation, index) => (
		<div key={index}>{organisation.name}</div>
	));
}

export const dataLoader = async () => {
	const result = await API.get("/api/organisations");
	return result.data.organisations;
};
