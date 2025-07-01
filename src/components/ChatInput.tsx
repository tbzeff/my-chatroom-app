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

    // Get the button ref for positioning
    const inputRef = React.useRef<HTMLDivElement>(null);
    const [pickerPos, setPickerPos] = React.useState<{ top: number; left: number } | null>(null);

    // Calculate position for the pickers (right aligned above ChatInput)
    React.useEffect(() => {
        if ((showEmojiPicker || showGifPicker) && inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setPickerPos({
                top: rect.top - 320, // adjust as needed for picker height
                left: rect.right - 350, // adjust as needed for picker width
            });
        }
    }, [showEmojiPicker, showGifPicker]);

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
            <button
                type="button"
                className="px-2 py-2 rounded border"
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
            {showEmojiPicker && pickerPos &&
                createPortal(
                    <div
                        style={{
                            position: "absolute",
                            top: pickerPos.top,
                            left: pickerPos.left,
                            zIndex: 1000,
                        }}
                    >
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <EmojiPicker onEmojiClick={handleEmojiClick} theme={"dark" as any} />
                    </div>,
                    portalRoot
                )
            }
            {showGifPicker && pickerPos &&
                createPortal(
                    <div
                        style={{
                            position: "absolute",
                            top: pickerPos.top,
                            left: pickerPos.left,
                            zIndex: 1000,
                        }}
                    >
                        <GifPicker onGifSelect={handleGifSelect} onClose={() => setShowGifPicker(false)} />
                    </div>,
                    portalRoot
                )
            }
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
