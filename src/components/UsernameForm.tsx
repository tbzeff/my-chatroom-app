import React from "react";

interface UsernameFormProps {
  username: string;
  setUsername: (name: string) => void;
  handleUsernameSubmit: () => void;
}

export function UsernameForm({ username, setUsername, handleUsernameSubmit }: UsernameFormProps) {
  return (
    <div className="mb-4">
      <input
        className="px-3 py-2 mr-2 rounded border"
        style={{
          backgroundColor: "var(--color-neutral)",
          color: "var(--color-primary)",
          borderColor: "var(--color-secondary)",
        }}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Choose a username..."
      />
      <button
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-neutral)",
          borderColor: "var(--color-secondary)",
        }}
        className="hover:brightness-110 px-4 py-2 rounded"
        onClick={handleUsernameSubmit}
      >
        Enter Chat
      </button>
    </div>
  );
}
