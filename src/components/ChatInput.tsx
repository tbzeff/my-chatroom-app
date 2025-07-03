import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import React from "react";
import { createPortal } from "react-dom";
import { GifPicker } from "./GifPicker";

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  sendMessage: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (val: boolean) => void;
  handleEmojiClick: (emojiData: EmojiClickData) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showGifPicker: boolean;
  setShowGifPicker: (val: boolean) => void;
  handleGifSelect: (gifUrl: string) => void;
}

export function ChatInput({
    input,
    sendMessage,
    showEmojiPicker,
    setShowEmojiPicker,
    handleEmojiClick,
    handleInputChange,
    showGifPicker,
    setShowGifPicker,
    handleGifSelect,
}: ChatInputProps) {
    // Get the portal root (create if not present)
    const portalRoot = React.useMemo(() => {
        let el = document.getElementById("portal-root");
        if (!el) {
            el = document.createElement("div");
            el.id = "portal-root";
            document.body.appendChild(el);
        }
        return el;
    }, []);

    const emojiButtonRef = React.useRef<HTMLButtonElement>(null);
    const gifButtonRef = React.useRef<HTMLButtonElement>(null);
    const sendButtonRef = React.useRef<HTMLButtonElement>(null);
    // Ref for the input container
    const inputRef = React.useRef<HTMLDivElement>(null);
    // Ref for the emoji picker popup
    const emojiPickerRef = React.useRef<HTMLDivElement>(null);
    const [emojiPickerPos, setEmojiPickerPos] = React.useState<{ top: number; left: number } | null>(null);

    // Position EmojiPicker after mount
    React.useEffect(() => {
        if (showEmojiPicker && inputRef.current && emojiPickerRef.current && emojiButtonRef.current && sendButtonRef.current) {
            const inputRect = inputRef.current.getBoundingClientRect();
            const pickerRect = emojiPickerRef.current.getBoundingClientRect();
            const emojiBut = emojiButtonRef.current.getBoundingClientRect();
            const sendBut = sendButtonRef.current.getBoundingClientRect();
            setEmojiPickerPos({
                top: inputRect.top - pickerRect.height,
                left: inputRect.right - pickerRect.width - emojiBut.width - sendBut.width,
            });
        } else if (!showEmojiPicker) {
            setEmojiPickerPos(null);
        }
    }, [showEmojiPicker]);

    return (
        <div ref={inputRef} className="flex gap-2 items-center relative border-4 border-red-500">
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
                ref={emojiButtonRef}
                type="button"
                className="w-10 px-2 py-2 rounded border"
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
            <button
                ref={gifButtonRef}
                type="button"
                className="w-10 px-2 py-2 rounded border"
                style={{
                    backgroundColor: "var(--color-neutral)",
                    color: "var(--color-primary)",
                    borderColor: "var(--color-secondary)",
                }}
                onClick={() => setShowGifPicker(!showGifPicker)}
                aria-label="Add GIF"
            >
                <span role="img" aria-label="gif">
                    🖼️
                </span>
            </button>
            {/* Emoji Picker Portal: render offscreen first to measure, then at correct position */}
            {showEmojiPicker && createPortal(
                <div
                    ref={emojiPickerRef}
                    style={{
                        position: "absolute",
                        top: emojiPickerPos ? emojiPickerPos.top : -9999,
                        left: emojiPickerPos ? emojiPickerPos.left : -9999,
                        zIndex: 1000,
                        visibility: emojiPickerPos ? "visible" : "hidden",
                    }}
                >
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <EmojiPicker onEmojiClick={handleEmojiClick} theme={"dark" as any} />
                </div>,
                portalRoot
            )}
            {/* Gif Picker Portal: revert to original logic (fixed height/width offset) */}
            {showGifPicker && inputRef.current && createPortal(
                <div
                    style={{
                        position: "absolute",
                        top: inputRef.current.getBoundingClientRect().top - 320, // adjust as needed for picker height
                        left: inputRef.current.getBoundingClientRect().right - 350, // adjust as needed for picker width
                        zIndex: 1000,
                    }}
                >
                    <GifPicker onGifSelect={handleGifSelect} onClose={() => setShowGifPicker(false)} />
                </div>,
                portalRoot
            )}
            <button
                ref={sendButtonRef}
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
