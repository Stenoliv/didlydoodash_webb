import { useParams } from "react-router-dom";

export default function ProjectView() {
	const projectID = useParams()["projectID"];

	return <div>{projectID}</div>;
}
