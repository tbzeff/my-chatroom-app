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

  const [isUserNearBottom, setIsUserNearBottom] = useState(true);

  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [isUsernameSet, setIsUsernameSet] = useState(!!username);

  // New: Track users in sidebar
  const [users, setUsers] = useState<string[]>([]);

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

  const sendMessage = () => {
    if (input.trim() === "" || !username.trim()) return;
    const newMessage = { id: crypto.randomUUID(), text: input, username };
    socket.emit("chat message", newMessage);
    setInput("");
    scrollToBottom();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    socket.emit("typing");
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-gray-900 text-white rounded-xl shadow-lg flex h-[24rem]">
      <div className="flex flex-col flex-1 h-full w-full">
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
          <div className="text-sm mb-2 text-gray-400">
            Logged in as:{" "}
            <span className="font-semibold">{username}</span>
          </div>
        )}
        {/* Chatbox & Sidebar Row */}
        <div className="flex flex-1 h-full">
          {/*Chatbox - set max-w-md and flex-shrink*/}
          <div className="flex flex-col flex-shrink w-4/5 max-w-md h-full">
            <div
              ref={chatBoxRef}
              className="flex-1 overflow-y-auto border border-gray-700 p-2 mb-4 rounded scroll-smooth"
            >
              {messages.map((msg) => (
                <div key={msg.id} className="mb-1">
                  <span className="font-semibold text-green-400">
                    {msg.username}:
                  </span>{" "}
                  {msg.text}
                </div>
              ))}
              {typing && isUserNearBottom && (
                <div className="italic text-sm text-gray-400">
                  Someone is typing...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {typing && !isUserNearBottom && (
              <div className="text-sm italic text-gray-400 mb-1 text-right">
                Someone is typing...
              </div>
            )}
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
          {/* Sidebar - wider */}
          <aside className="w-[12rem] bg-gray-800 rounded border border-gray-700 px-4 flex flex-col ml-4 h-full self-start">
            <h2 className="text-lg font-semibold mb-2 text-center">Users</h2>
            <ul className="flex-1 overflow-y-auto text-sm">
              {users.length === 0 && (
                <li className="text-gray-500 italic">No users</li>
              )}
              {users.map((user) => (
                <li
                  key={user}
                  className={
                    user === username ? "font-bold text-green-400" : ""
                  }
                >
                  {user === username ? "You" : user}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
