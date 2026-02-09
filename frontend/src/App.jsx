import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import TeacherDashboard from "./TeacherDashboard";
import TeacherAddAssignment from "./TeacherAddAssignment";
import Navbar from "./Navbar";
import Spinner from "./Spinner";
import Register from "./Register";

function App() {
  /* ================= STATE ================= */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isTeacher, setIsTeacher] = useState(false);

  const [assignments, setAssignments] = useState([]);
  const [assignment, setAssignment] = useState("");
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loggedUser, setLoggedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (savedUser) {
      setLoggedUser(savedUser);
    }
  }, []);
  /* ================= LOGIN ================= */
 const handleLogin = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/token/", {
      username,
      password,
    });

    // ✅ Save token
    localStorage.setItem("token", res.data.access);

    // ✅ Save username (for navbar)
    localStorage.setItem("username", username);

    // ✅ Update state
    setToken(res.data.access);
    setLoggedUser(username);
  } catch {
    alert("Login failed");
  }
};
  /* ================= LOGOUT ================= */
 const handleLogout = () => {
  // 🔐 Clear storage
  localStorage.removeItem("token");
  localStorage.removeItem("username");

  // 🔄 Reset auth state
  setToken(null);
  setLoggedUser("");
  setIsTeacher(false);

  // 🧹 Clear form & data state
  setUsername("");
  setPassword("");
  setAssignments([]);
  setSubmissions([]);
  setAssignment("");
  setCode("");
  setFeedback("");
};
  /* ================= ROLE CHECK ================= */
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setIsTeacher(decoded.is_staff === true);
    }
  }, [token]);

  /* ================= FETCH ASSIGNMENTS ================= */
  const fetchAssignments = () => {
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/api/assignments/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAssignments(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchAssignments();
  }, [token]);

  /* ================= FETCH MY SUBMISSIONS ================= */
  useEffect(() => {
    if (!token || isTeacher) return;

    axios
      .get("http://127.0.0.1:8000/api/my-submissions/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubmissions(res.data))
      .catch(() => {});
  }, [token, feedback, isTeacher]);

  /* ================= SUBMIT CODE ================= */
  const handleSubmit = async () => {
  if (!assignment || !code) {
    alert("Select assignment and write code");
    return;
  }

  try {
    setLoading(true);
    setFeedback("");

    const res = await axios.post(
      "http://127.0.0.1:8000/api/submit/",
      { assignment, code },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setFeedback(res.data.feedback);
    setCode("");
  } catch {
    alert("Submission failed");
  } finally {
    setLoading(false);
  }
};
  /* ================= LOGIN SCREEN ================= */
  if (!token) {
  return showRegister ? (
    <Register onBack={() => setShowRegister(false)} />
  ) : (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "30px" }}>
      <h2>Login</h2>

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

      <button type="button" onClick={handleLogin} style={{ width: "100%" }}>
        Login
      </button>

      <button
        type="button"
        onClick={() => setShowRegister(true)}
        style={{
          width: "100%",
          marginTop: "12px",
          background: "transparent",
          color: "#93c5fd",
          border: "none",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        New student? Register
      </button>
    </div>
  );
}


  /* ================= MAIN UI ================= */
  return (
  <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>

    {/* 🔝 NAVBAR */}
    <Navbar
      username={loggedUser}
      role={isTeacher ? "Teacher" : "Student"}
      onLogout={handleLogout}
    />

    <h2 className="section-title">AI Programming Tutor</h2>

    {/* ============ TEACHER ============ */}
    {isTeacher && (
      <>
        <TeacherAddAssignment
          token={token}
          onAssignmentAdded={fetchAssignments}
        />
        <TeacherDashboard token={token} />
      </>
    )}

    {/* ============ STUDENT ============ */}
    {!isTeacher && (
      <>
        <select
          value={assignment}
          onChange={(e) => setAssignment(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        >
          <option value="">Select Assignment</option>
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>

        <textarea
          rows="8"
          placeholder="Write your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ width: "100%", marginTop: "10px" }}
        />

       <button
  onClick={handleSubmit}
  disabled={loading}
  style={{
    marginTop: "10px",
    padding: "10px",
    width: "100%",
    background: loading ? "#64748b" : "#38bdf8",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    cursor: loading ? "not-allowed" : "pointer",
    fontWeight: "bold",
  }}
>
  {loading ? "Submitting..." : "Submit Code"}
</button>

        {loading && <Spinner text="AI is reviewing your code..." />}

{!loading && feedback && (
  <div
    className="card"
    style={{
      marginTop: "20px",
    }}
  >
    <h3 className="section-title">AI Feedback</h3>
    <pre style={{ whiteSpace: "pre-wrap" }}>{feedback}</pre>
  </div>
)}
        <h3 style={{ marginTop: "30px" }}>My Submissions</h3>

        {submissions.map((s) => (
  <div className="card" key={s.id}>
    <strong>Assignment:</strong> {s.assignment_title || s.assignment}
    <br />
    <strong>Submitted:</strong>{" "}
    {new Date(s.created_at).toLocaleString()}
    <br />
    <strong>Code:</strong>
    <pre>{s.code}</pre>
    <strong>Feedback:</strong>
    <pre>{s.feedback}</pre>
  </div>
))}
      </>
    )}
  </div>
);

}

export default App;
