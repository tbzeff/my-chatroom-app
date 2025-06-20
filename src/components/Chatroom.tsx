import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3002");

interface Message {
  id: string;
  text: string;
  username: string;
}

export default function Chatroom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const typingTimeout = useRef<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);


  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  const [isUsernameSet, setIsUsernameSet] = useState(!!username);

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      localStorage.setItem("username", username);
      setIsUsernameSet(true);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  useEffect(() => {
    socket.on("chat message", (msg: Message) => {
      setMessages((prev) => {
        const isNearBottom =
          chatBoxRef.current &&
          chatBoxRef.current.scrollHeight - chatBoxRef.current.scrollTop <=
            chatBoxRef.current.clientHeight + 100;

        // Set messages first
        const updated = [...prev, msg];

        // Then scroll conditionally
        setTimeout(() => {
          if (isNearBottom) scrollToBottom();
        }, 50);

        return updated;
      });
    });

    socket.on("typing", () => {
      setTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTyping(false), 1000);
    });

    return () => {
      socket.off("chat message");
      socket.off("typing");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() === "" || !username.trim()) return;
    const newMessage = { id: crypto.randomUUID(), text: input, username };
    socket.emit("chat message", newMessage);
    setInput("");

    // Force scroll to bottom when user sends message
    scrollToBottom();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    socket.emit("typing");
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-gray-900 text-white rounded-xl shadow-lg flex flex-col h-[24rem]">

      {/* Header */}
      <h1 className="text-xl font-bold mb-4">Chatroom</h1>

      {/*Username handling*/}
      {!isUsernameSet ? (
        <div className="mb-4">
          <input
            className="px-3 py-2 mr-2 rounded bg-gray-800 border border-gray-700"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username..."
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            onClick={handleUsernameSubmit}
          >
            Enter Chat
          </button>
        </div>
      ) : (
        <div className="text-sm mb-2 text-gray-400">Logged in as: <span className="font-semibold">{username}</span></div>
      )}

     {/*Chatbox & Input*/}
      <div className="flex flex-col h-full">
        {/*Chatbox*/}
        
        <div
        ref={chatBoxRef}
         className="flex-1 overflow-y-auto border border-gray-700 p-2 mb-4 rounded">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-1">
              <span className="font-semibold text-green-400">{msg.username}:</span> {msg.text}
            </div>
          ))}

          {typing && <div className="italic text-sm text-gray-400">Someone is typing...</div>}
        <div ref={chatEndRef} />
        </div>
        {/*Input*/}
        <div className="flex gap-2">
          <input
            className="flex-grow px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
