import type { RefObject } from "react";
import type { Message } from "./Chatroom";

interface ChatBoxProps {
  messages: Message[];
  typing: boolean;
  isUserNearBottom: boolean;
  chatEndRef: RefObject<HTMLDivElement | null>;
  chatBoxRef: RefObject<HTMLDivElement | null>;
}

export function ChatBox({ messages, typing, isUserNearBottom, chatEndRef, chatBoxRef }: ChatBoxProps) {
  return (
    <div
      ref={chatBoxRef}
      className="flex-1 overflow-y-auto border p-2 mb-4 rounded scroll-smooth"
      style={{
        borderColor: "var(--color-secondary)",
        backgroundColor: "var(--color-neutral)",
        color: "var(--color-primary)",
      }}
    >
      {messages.map((msg) => (
        <div key={msg.id} className="mb-1">
          <span
            className="font-semibold"
            style={{ color: "var(--color-accent)" }}
          >
            {msg.username}:
          </span>{" "}
          {msg.text}
        </div>
      ))}
      {typing && isUserNearBottom && (
        <div
          className="italic text-sm"
          style={{ color: "var(--color-secondary)" }}
        >
          Someone is typing...
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
}
