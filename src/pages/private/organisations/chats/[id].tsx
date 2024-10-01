import { useAuthStore } from "@/stores/auth/store";
import { useOrgStore } from "@/stores/organisation";
import { useChatStore } from "@/stores/organisation/chats";
import { WSChatMessage, WSMessage } from "@/utils/types";
import {
  ChatContainer,
  ConversationHeader,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";

function ChatPage() {
  const { id } = useParams();
  const { organisation } = useOrgStore();
  const { openChat } = useChatStore();
  const { tokens } = useAuthStore();
  const { user } = useAuthStore();

  const WS_URL = `ws://localhost:3000/organisations/${organisation?.id}/chats/${id}?token=${tokens?.access}`;

  const { sendJsonMessage, lastMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("Websocket connection established");
    },
    onClose: () => {
      console.log("Connection closed");
    },
    onMessage: (data) => {
      console.log("Message: " + data.data);
    },
  });

  const [messageHistory, setMessageHistory] = useState<WSChatMessage[]>([]);
  const [input, setInput] = useState({
    message: "",
  });

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        // Parse the message and cast it as WSMessage
        const parsedData: WSMessage = JSON.parse(lastMessage.data);

        // Check if the message type is 'message.send' and if it belongs to the current room
        if (parsedData.type === "message.send" && parsedData.roomId === id) {
          setMessageHistory((prev) => [...prev, parsedData]);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    }
  }, [lastMessage, id]);

  const handleSendMessage = useCallback(
    () =>
      sendJsonMessage<WSChatMessage>({
        type: "message.send",
        roomId: id ? id : "",
        payload: {
          userId: user ? user?.id : "",
          message: input.message,
        },
      }),
    [id, user, sendJsonMessage, input.message]
  );

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div style={{ position: "relative", height: "100%" }}>
        <MainContainer>
          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Content
                userName={"Chat: " + openChat?.name}
              />
              <ConversationHeader.Actions>
                <ConversationHeader.Back />
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList>
              {messageHistory.map((message) => (
                <Message
                  model={{
                    direction: "incoming",
                    position: "normal",
                    sentTime: "just now",
                    message: message.payload.message,
                    sender: message.payload.userId,
                  }}
                />
              ))}
            </MessageList>
            <MessageInput
              placeholder="Type yout message here"
              value={input.message}
              onChange={(_, text) =>
                setInput((prev) => ({
                  ...prev,
                  ["message"]: text,
                }))
              }
              onSend={() => handleSendMessage()}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default ChatPage;
