import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import React from "react";

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  sendMessage: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (val: boolean) => void;
  handleEmojiClick: (emojiData: EmojiClickData) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ChatInput({
    input,
    sendMessage,
    showEmojiPicker,
    setShowEmojiPicker,
    handleEmojiClick,
    handleInputChange,
}: ChatInputProps) {
    return (
        <div className="flex gap-2 items-center relative">
            <input
                className="flex-grow px-3 py-2 rounded border focus:outline-none"
                style={{
                    backgroundColor: "var(--color-neutral)",
                    color: "var(--color-primary)",
                    borderColor: "var(--color-secondary)",
                }}
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
            />
            <button
                type="button"
                className="px-2 py-2 rounded border"
                style={{
                    backgroundColor: "var(--color-neutral)",
                    color: "var(--color-primary)",
                    borderColor: "var(--color-secondary)",
                }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                aria-label="Add emoji"
            >
                <span role="img" aria-label="emoji">
                    😊
                </span>
            </button>
            {showEmojiPicker && (
                <div className="absolute bottom-12 right-16 z-10">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <EmojiPicker onEmojiClick={handleEmojiClick} theme={"dark" as any} />
                </div>
            )}
            <button
                onClick={sendMessage}
                className="px-4 py-2 rounded"
                style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-neutral)",
                    borderColor: "var(--color-secondary)",
                }}
            >
                Send
            </button>
        </div>
    );
}
