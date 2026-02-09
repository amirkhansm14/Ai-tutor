function Navbar({ username, role, onLogout }) {
  return (
    <div
      style={{
        background: "#020617",
        borderBottom: "1px solid #334155",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h3 style={{ margin: 0, color: "#38bdf8" }}>AI Tutor</h3>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ color: "#e5e7eb" }}>
          👤 {username} ({role})
        </span>

        <button
          onClick={onLogout}
          style={{
            background: "#ef4444",
            padding: "6px 12px",
            fontSize: "14px",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
