interface UserInfoProps {
  username: string;
}

export function UserInfo({ username }: UserInfoProps) {
  return (
    <div
      className="text-sm mb-2"
      style={{ color: "var(--color-secondary)" }}
    >
      Logged in as: {" "}
      <span
        className="font-semibold"
        style={{ color: "var(--color-accent)" }}
      >
        {username}
      </span>
    </div>
  );
}
