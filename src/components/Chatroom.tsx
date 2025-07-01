import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { EmojiClickData } from "emoji-picker-react";
import { ChatHeader } from "./ChatHeader";
import { UsernameForm } from "./UsernameForm";
import { UserInfo } from "./UserInfo";
import { ChatBox } from "./ChatBox";
import { ChatInput } from "./ChatInput";
import { UserSidebar } from "./UserSidebar";

const socket: Socket = io("http://localhost:3002");

export interface Message {
  id: string;
  text: string;
  gifUrl?: string;
  username: string;
}

export default function Chatroom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const typingTimeout = useRef<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  const [isUserNearBottom, setIsUserNearBottom] = useState(true);

  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [isUsernameSet, setIsUsernameSet] = useState(!!username);

  // New: Track users in sidebar
  const [users, setUsers] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      localStorage.setItem("username", username);
      setIsUsernameSet(true);
      socket.emit("set username", username); // Inform server of username
    }
  };

  // Emit username if already set (e.g. on reload)
  useEffect(() => {
    if (isUsernameSet && username.trim()) {
      socket.emit("set username", username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUsernameSet]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!chatBoxRef.current) return;
      const { scrollHeight, scrollTop, clientHeight } = chatBoxRef.current;
      const nearBottom = scrollHeight - scrollTop <= clientHeight + 100;
      setIsUserNearBottom(nearBottom);
    };

    const chatBox = chatBoxRef.current;
    chatBox?.addEventListener("scroll", handleScroll);

    return () => chatBox?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const scrollIfNearBottom = () => {
      if (chatBoxRef.current) {
        const { scrollHeight, scrollTop, clientHeight } = chatBoxRef.current;
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 100;
        if (isNearBottom) {
          setTimeout(scrollToBottom, 50);
        }
      }
    };

    socket.on("chat message", (msg: Message) => {
      setMessages((prev) => {
        const updated = [...prev, msg];
        scrollIfNearBottom();
        return updated;
      });
    });

    socket.on("typing", () => {
      setTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTyping(false), 1000);
      scrollIfNearBottom();
    });

    socket.on("chat history", (history: Message[]) => {
      setMessages(history);
      setTimeout(scrollToBottom, 50); // Scroll after loading history
    });

    // Listen for user list updates
    socket.on("user list", (userList: string[]) => {
      setUsers(userList);
    });

    socket.on("typing", () => {
      setTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTyping(false), 1000);
    });

    return () => {
      socket.off("chat message");
      socket.off("chat history");
      socket.off("typing");
      socket.off("user list");
    };
  }, []);

  const sendMessage = (gifUrl?: string) => {
    if ((input.trim() === "" && !gifUrl) || !username.trim()) return;
    const newMessage = { id: crypto.randomUUID(), text: input, username, gifUrl };
    socket.emit("chat message", newMessage);
    setInput("");
    setShowGifPicker(false);
    scrollToBottom();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    socket.emit("typing");
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleGifSelect = (gifUrl: string) => {
    sendMessage(gifUrl);
  };

  return (
    <div
      className="w-full max-w-3xl mx-auto p-4 rounded-xl shadow-lg flex h-[24rem] relative"
      style={{
        backgroundColor: "var(--color-primary)",
        color: "var(--color-neutral)",
      }}
    >
      <div className="flex flex-col flex-1 h-full w-full relative">
        {/* Header */}
        <ChatHeader />
        {/*Username handling*/}
        {!isUsernameSet ? (
          <UsernameForm
            username={username}
            setUsername={setUsername}
            handleUsernameSubmit={handleUsernameSubmit}
          />
        ) : (
          <UserInfo username={username} />
        )}
        {/* Chatbox & Sidebar Row */}
        <div className="flex flex-1 h-full relative">
          {/*Chatbox*/}
          <div className="flex flex-col flex-shrink w-4/5 max-w-md h-full relative">
            <ChatBox
              messages={messages}
              typing={typing}
              isUserNearBottom={isUserNearBottom}
              chatEndRef={chatEndRef as React.RefObject<HTMLDivElement>}
              chatBoxRef={chatBoxRef as React.RefObject<HTMLDivElement>}
            />
            {typing && !isUserNearBottom && (
              <div
                className="text-sm italic mb-1 text-right"
                style={{ color: "var(--color-secondary)" }}
              >
                Someone is typing...
              </div>
            )}
            <ChatInput
              input={input}
              setInput={setInput}
              sendMessage={() => sendMessage()}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
              handleEmojiClick={handleEmojiClick}
              handleInputChange={handleInputChange}
              showGifPicker={showGifPicker}
              setShowGifPicker={setShowGifPicker}
              handleGifSelect={handleGifSelect}
            />
          </div>
          {/* Sidebar - wider */}
          <UserSidebar users={users} username={username} />
        </div>
      </div>
    </div>
  );
}
