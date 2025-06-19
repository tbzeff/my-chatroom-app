import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3002");

interface Message {
  id: string;
  text: string;
}

export default function Chatroom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const typingTimeout = useRef<number | null>(null);

  useEffect(() => {
    socket.on("chat message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
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
    if (input.trim() === "") return;
    const newMessage = { id: crypto.randomUUID(), text: input };
    socket.emit("chat message", newMessage);
    setInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    socket.emit("typing");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-gray-900 text-white rounded-xl shadow-lg">
      <h1 className="text-xl font-bold mb-4">Chatroom</h1>
      <div className="h-64 overflow-y-auto border border-gray-700 p-2 mb-4 rounded">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-1">
            {msg.text}
          </div>
        ))}
        {typing && <div className="italic text-sm text-gray-400">Someone is typing...</div>}
      </div>
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
  );
}
