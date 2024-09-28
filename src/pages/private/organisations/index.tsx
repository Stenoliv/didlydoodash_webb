import { useOrgStore } from "@/stores/organisation";

export default function Page() {
	const { organisation } = useOrgStore();
	return <div>Dashboard: {organisation?.name}</div>;
}
