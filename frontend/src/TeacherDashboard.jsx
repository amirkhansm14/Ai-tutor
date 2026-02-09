import { useEffect, useState } from "react";
import axios from "axios";

function TeacherDashboard({ token }) {
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [comment, setComment] = useState("");

  // 🔹 editing state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // 🔹 load submissions
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/teacher/submissions/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubmissions(res.data));
  }, [token]);

  // 🔹 load assignments
  useEffect(() => {
    loadAssignments();
  }, [token]);

  const loadAssignments = () => {
    axios
      .get("http://127.0.0.1:8000/api/assignments/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error(err));
  };

  // 🔹 add teacher comment
  const addComment = (id) => {
    axios
      .post(
        `http://127.0.0.1:8000/api/teacher/comment/${id}/`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Comment added");
        setComment("");
      });
  };

  // 🔹 start editing assignment
  const startEdit = (a) => {
    setEditingId(a.id);
    setEditTitle(a.title);
    setEditDescription(a.description);
  };

  // 🔹 save edited assignment
  const saveEdit = (id) => {
    axios
      .put(
        `http://127.0.0.1:8000/api/teacher/assignment/edit/${id}/`,
        {
          title: editTitle,
          description: editDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        alert("Assignment updated");
        setEditingId(null);
        loadAssignments();
      })
      .catch((err) => {
        console.error(err.response?.data);
        alert("Update failed");
      });
  };

  return (
    <div>
      {/* ================= ASSIGNMENTS ================= */}
      <h3>Your Assignments</h3>

      {assignments.map((a) => (
        <div key={a.id} className="card">
          {editingId === a.id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ width: "100%", marginBottom: "8px" }}
              />

              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                style={{ width: "100%", marginBottom: "8px" }}
              />

              <button onClick={() => saveEdit(a.id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h4>{a.title}</h4>
              <p>{a.description}</p>
              <button onClick={() => startEdit(a)}>Edit</button>
            </>
          )}
        </div>
      ))}

      {/* ================= SUBMISSIONS ================= */}
      <h3>Student Submissions</h3>

      {submissions.map((s) => (
        <div key={s.id} className="card">
          <p><b>Student:</b> {s.student}</p>
          <p><b>Assignment:</b> {s.assignment_title}</p>

          <pre>{s.code}</pre>

          <p><b>AI Feedback:</b></p>
          <pre>{s.feedback}</pre>

          <textarea
            placeholder="Teacher comment"
            onChange={(e) => setComment(e.target.value)}
          />

          <button onClick={() => addComment(s.id)}>
            Add Comment
          </button>
        </div>
      ))}
    </div>
  );
}

export default TeacherDashboard;
