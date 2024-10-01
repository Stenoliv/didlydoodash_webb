import { useEffect, useRef, useState } from "react";
import "./chats.css";
import { useAuthStore } from "@/stores/auth/store";
import EmojiPicker from "emoji-picker-react";

export default function Chats() {
	const [chat, setChat] = useState();
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");
	const [img, setImg] = useState({
		file: null,
		url: "",
	});

	const endRef = useRef<HTMLDivElement>(null);

	const { user } = useAuthStore();

	const handleEmoji = (e: any) => {
		setText((prev) => prev + e.emoji);
		setOpen(false);
	};

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chat]);

	const handleSend = async () => {
		if (text === "") return;
	};

	return (
		<div className="chat">
			<div className="top">
				<div className="user">
					<img src={user?.avatar || "/icons/avatars/avatar-girl2.svg"} alt="" />
					<div className="texts">
						<span>Username</span>
						<p>Lorem ipsum dolor, sit amet.</p>
					</div>
				</div>
				<div className="icons">
					<img src="/icons/phone.svg" alt="" />
					<img src="/icons/video.svg" alt="" />
					<img src="/icons/info.svg" alt="" />
				</div>
			</div>
			<div className="center">
				{/** Messages map */}
				<div ref={endRef} />
			</div>
			<div className="bottom">
				<div className="icons">
					<label htmlFor="file">
						<img src="/icons/file.svg" alt="" />
					</label>
					<input type="file" id="file" style={{ display: "none" }} />
				</div>
				<input
					type="text"
					placeholder="Type a message..."
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<div className="emoji">
					<img src="/icons/emoji.svg" alt="" />
					<div className="picker">
						<EmojiPicker open={open} onEmojiClick={handleEmoji} />
					</div>
				</div>
				<button className="sendButton" onClick={handleSend} disabled={false}>
					Send
				</button>
			</div>
		</div>
	);
}
