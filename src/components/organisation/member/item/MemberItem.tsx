import { OrgMember, OrgRole } from "@/utils/types";
import "./memberitem.css";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

export interface MemberItemProps {
	member: OrgMember;
	memberAction?: (member: OrgMember) => void;
	onRoleChange?: (updatedMember: OrgMember) => void;
}

export default function MemberItem(props: MemberItemProps) {
	const { member, memberAction, onRoleChange } = props;

	const { role } = member;
	const { avatar, username } = member.user;

	const handleRoleChange = (event: SelectChangeEvent<OrgRole>) => {
		event.stopPropagation();
		const updatedRole = event.target.value as OrgRole;
		const updatedMember: OrgMember = {
			...member,
			role: updatedRole,
		};

		if (onRoleChange) {
			onRoleChange(updatedMember);
		}
	};

	const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const target = event.target as HTMLElement;
		if (
			target.classList.contains("member-item") ||
			target.closest(".member-item")
		) {
			if (memberAction) {
				memberAction(member);
			}
		}
	};

	return (
		<div className="member-item" onClick={handleClick}>
			<img src={avatar || "/icons/avatars/avatar-boy.svg"} alt="" />
			<div className="texts">
				<span>{username}</span>
				{!onRoleChange ? (
					<p>{role}</p>
				) : (
					<Select
						className="role-select"
						value={member.role}
						onChange={handleRoleChange}
						SelectDisplayProps={{
							style: { padding: "5px", paddingRight: "35px" },
						}}
					>
						{Object.keys(OrgRole).map((key) => (
							<MenuItem
								key={key}
								className="role-select"
								value={OrgRole[key as keyof typeof OrgRole]}
							>
								{OrgRole[key as keyof typeof OrgRole]}
							</MenuItem>
						))}
					</Select>
				)}
			</div>
		</div>
	);
}
