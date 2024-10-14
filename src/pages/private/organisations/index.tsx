import AddUser from "@/components/organisation/addUser/AddUser";
import { useOrgStore } from "@/stores/organisation";
import { API } from "@/utils/api";
import { OrgMember } from "@/utils/types";
import {useEffect, useRef, useState } from "react";
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

	const annoncementDivRef = useRef<HTMLDivElement | null>(null);
	const [announcementText, setAnnouncementText] = useState<string>("");
	const [announcements, setAnnouncements] = useState<any[]>([]);

	const { isLoading, isError, error } = useQuery<OrgMember[], Error>(
		["members", organisation],
		() => memberLoader(organisation?.id || ""),
		{
			onSuccess: (data) => {
				setMembers(data);
			},
		}
	);

	const postNewAnnouncement = () => {
		if (annoncementDivRef.current){
			annoncementDivRef.current.style.display = 'flex';
		}
	}

	const postAnnouncement = async () => {
		if (!announcementText) {
			toast.error("Announcement cannot be empty", {
				position: "top-left",
			});
			return;
		}
		try {
			const response = await API.post(`/api/organisations/${organisation?.id}/announcements`, {
				text: announcementText,
			});
			console.log(response);
			toast.success("Announcement posted successfully");
			setAnnouncementText(""); // Clear the input after posting
		} catch (error) {
			console.error(error);
			toast.error("Failed to post announcement", {
				position: "top-left",
			});
		} finally {
			if (annoncementDivRef.current) {
				annoncementDivRef.current.style.display = "none";
			}
		}
	};
	const fetchAnnouncements = async () => {
		if (!organisation?.id) return; // Ensure there is an organisation ID
		try {
			const response = await API.get(`/api/organisations/${organisation.id}/announcements`);
			setAnnouncements(response.data.announcements);
			console.log(announcements) 
		} catch (error) {
			toast.error("Failed to load announcements", {
				position: "top-left",
			});
		}
	};
	const deleteAnnouncement = async (announcementId: string) => {
        try {
			if (!organisation?.id) return;
            await API.delete(`/api/organisations/${organisation.id}/announcements/${announcementId}`);
            // Update the local state to remove the deleted announcement
            setAnnouncements((prevAnnouncements) => 
                prevAnnouncements.filter((announcement) => announcement.id !== announcementId)
            );
            toast.success("Announcement deleted successfully");
        } catch (error) {
            toast.error("Failed to delete announcement");
        }
    };
	useEffect(() => {
		fetchAnnouncements();
	}, [organisation]); // Re-fetch if organisation changes

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
					<div className="announcement_header">
						<h2>Announcements</h2>
						<button onClick={() => postNewAnnouncement()} className="new_announcement_btn">+</button>
					</div>
					<div style={{display: 'none', flexDirection:"column"}} ref={annoncementDivRef}>
						<textarea className="announcement_Text_Input" placeholder="Enter your announcement..." value={announcementText} onChange={(e) => setAnnouncementText(e.target.value)}></textarea>
						<button onClick={() => postAnnouncement()} style={{marginTop:"10px"}}>Post</button>
					</div>
					<div className="announcement_list">
					{announcements && announcements.length > 0 ? (
						announcements.map((announcement) => (
							<div key={announcement.id} className="announcement_item" style={{backgroundColor:"#090912", padding: "4px", marginTop:"8px", borderRadius:"8px"}}>
								<button style={{}} onClick={()=> deleteAnnouncement(announcement.id)}>delete</button>	
								<p style={{fontSize:"12px"}}>Posted at: {new Date(announcement.createdAt).toLocaleString()}</p>
								<h3>{announcement.AnnouncmentText}</h3>
							</div>
						))
					) : (
						<p>No announcements available.</p>
					)}
				</div>
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

