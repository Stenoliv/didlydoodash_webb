import AddUser from "@/components/organisation/addUser/AddUser";
import { useOrgStore } from "@/stores/organisation";
import { API } from "@/utils/api";
import { OrgMember } from "@/utils/types";
import { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

export default function Page() {
	const [members, setMembers] = useState<OrgMember[]>([]);

	const { organisation } = useOrgStore();

	const { isLoading, isError, error } = useQuery<OrgMember[], Error>(
		["members", organisation],
		() => memberLoader(organisation?.id || ""),
		{
			onSuccess: (data) => {
				setMembers(data);
			},
		}
	);

	if (isLoading) return <div>Loading...</div>;

	if (isError) return <div>Error: {error.message} </div>;

	return (
		<div>
			Dashboard: {organisation?.name}
			<AddUser members={members} />
		</div>
	);
}

const memberLoader = async (id: string) => {
	try {
		const response = await API.get(`/api/organisations/${id}/members`);
		console.log(response.data);
		return response.data.members;
	} catch (error: any) {
		toast.error(`Error loading organisationMembers: ${error?.message}`, {
			position: "top-left",
		});
	}
};
