import { useOrgStore } from "@/stores/organisation";
import { useProjectStore } from "@/stores/projects";
import { API } from "@/utils/api";
import { Project } from "@/utils/types";
import { useQuery } from "react-query";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProjectLayout() {
	const { setProjects } = useProjectStore();

	const { isLoading, isError, error } = useQuery<Project[], Error>(
		"projects",
		projectLoader,
		{
			onSuccess: (data) => {
				setProjects(data);
			},
		}
	);

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

	return (
		<>
			<div>
				<p>Projects</p>
			</div>
			<Outlet />
		</>
	);
}

export async function projectLoader() {
	try {
		const { organisation } = useOrgStore.getState();
		const response = await API.get(
			`/api/organisations/${organisation?.id}/projects`
		);
		return response.data.projects;
	} catch (error: any) {
		toast.error(`Error loading projects: ${error?.message}`, {
			position: "top-left",
		});
	}
}
