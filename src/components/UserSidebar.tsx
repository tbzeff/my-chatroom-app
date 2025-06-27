interface UserSidebarProps {
  users: string[];
  username: string;
}

export function UserSidebar({ users, username }: UserSidebarProps) {
  return (
    <aside
      className="w-[12rem] rounded border px-4 flex flex-col ml-4 h-full self-start"
      style={{
        backgroundColor: "var(--color-secondary)",
        borderColor: "var(--color-accent)",
        color: "var(--color-neutral)",
      }}
    >
      <h2
        className="text-lg font-semibold mb-2 text-center"
        style={{ color: "var(--color-accent)" }}
      >
        Users
      </h2>
      <ul className="flex-1 overflow-y-auto text-sm">
        {users.length === 0 && (
          <li className="italic" style={{ color: "var(--color-neutral)" }}>
            No users
          </li>
        )}
        {users.map((user) => (
          <li
            key={user}
            className={user === username ? "font-bold" : ""}
            style={user === username ? { color: "var(--color-accent)" } : {}}
          >
            {user === username ? "You" : user}
          </li>
        ))}
      </ul>
    </aside>
  );
}
