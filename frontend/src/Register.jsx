import { useState } from "react";
import axios from "axios";

function Register({ onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        { username, password }
      );

      setMessage(res.data.message);
      setUsername("");
      setPassword("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "30px" }}>
      <h2>Student Registration</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={handleRegister} style={{ width: "100%" }}>
        Register
      </button>

      <button
        onClick={onBack}
        style={{ width: "100%", marginTop: "10px" }}
      >
        Back to Login
      </button>

      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
}

export default Register;
