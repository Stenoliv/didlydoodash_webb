import AddUser from "@/components/organisation/addUser/AddUser";
import { useOrgStore } from "@/stores/organisation";
import { API } from "@/utils/api";
import { OrgMember } from "@/utils/types";
import { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import "./dashboard.css";
import MemberItem from "@/components/organisation/member/item/MemberItem";
import RemoveOrg from "@/components/organisation/danger/remove/RemoveOrg";
import { useNavigate } from "react-router-dom";
import UpdateMember from "@/components/organisation/member/update/UpdateMember";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
	const [members, setMembers] = useState<OrgMember[]>([]);
	const [selectedMember, setSelectMember] = useState<OrgMember | null>(null);
	const [updateMember, setUpdateMember] = useState<boolean>(false);

	const [removeOrg, setRemoveOrg] = useState<boolean>(false);

	const { organisation } = useOrgStore();
	const { user } = useAuth();

	const owner = organisation?.owner.user.id === user?.id;
	const navigate = useNavigate();

	const { isLoading, isError, error } = useQuery<OrgMember[], Error>(
		["members", organisation],
		() => memberLoader(organisation?.id || ""),
		{
			onSuccess: (data) => {
				setMembers(data);
			},
		}
	);

	const handleMemberSelect = (member: OrgMember) => {
		if (owner) {
			setUpdateMember(true);
			setSelectMember(member);
		}
	};

	if (!organisation) {
		navigate("/", { replace: true });
		return null;
	}

	if (!Array.isArray(members)) {
		navigate("/", { replace: true });
		return null;
	}

	if (isLoading) return <div>Loading...</div>;

	if (isError) return <div>Error: {error.message} </div>;

	return (
		<div className="dashboard-container">
			<div className="texts">
				<h1>Dashboard</h1>
				<h2>Name: {organisation?.name}</h2>
			</div>
			<div className="texts">
				<span>
					Owner:
					<MemberItem member={organisation?.owner || ({} as OrgMember)} />
				</span>
			</div>
			<div className="texts">
				<span>
					Members: <AddUser members={members} />
				</span>
				{members.map((member, idx) => {
					return (
						<MemberItem
							key={idx}
							member={member}
							memberAction={handleMemberSelect}
						/>
					);
				})}
				{owner && selectedMember && (
					<UpdateMember
						open={updateMember}
						setOpen={setUpdateMember}
						member={selectedMember}
					/>
				)}
			</div>
			<div className="announcements">
				<div className="texts">
					<h2>Announcements</h2>
				</div>
				{/** Display announcments */}
			</div>
			<div className="projects">
				<div className="texts">
					<h2>Projects</h2>
				</div>
				{/** Display shorcuts to projects */}
			</div>
			<div className="chats">
				<div className="texts">
					<h2>Chats</h2>
				</div>
				{/** Display shorcuts to chats */}
			</div>
			{owner && (
				<div className="danger">
					<div className="texts">
						<h2>Danger zone</h2>
						<button onClick={() => setRemoveOrg(true)}>
							Delete organisation
						</button>
						<RemoveOrg open={removeOrg} setOpen={setRemoveOrg} />
						<button>Rename organisation</button>
					</div>
				</div>
			)}
		</div>
	);
}

const memberLoader = async (id: string) => {
	try {
		if (!id) return;
		const response = await API.get(`/api/organisations/${id}/members`);
		return response.data.members;
	} catch (error: any) {
		toast.error(`Error loading organisationMembers: ${error?.message}`, {
			position: "top-left",
		});
	}
};
