function Spinner({ text = "Loading..." }) {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <div className="spinner" />
      <p style={{ marginTop: "10px", color: "#94a3b8" }}>{text}</p>
    </div>
  );
}

export default Spinner;