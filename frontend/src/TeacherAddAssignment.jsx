import { useState } from "react";
import axios from "axios";

function TeacherAddAssignment({ token, onAssignmentAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = async () => {
  if (!title || !description) {
    alert("Fill all fields");
    return;
  }

  try {
    await axios.post(
      "http://127.0.0.1:8000/api/add-assignment/",
      { title, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    setTitle("");
    setDescription("");
    onAssignmentAdded && onAssignmentAdded();
  } catch (err) {
    console.error(err.response?.data); // 👈 VERY IMPORTANT
    alert("Failed to add assignment");
  }
};

  return (
    <div style={{ background: "#222", padding: "15px", marginBottom: "20px" }}>
      <h3>Add Assignment (Teacher)</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      <button onClick={handleAdd} style={{ width: "100%" }}>
        Add Assignment
      </button>
    </div>
  );
}

export default TeacherAddAssignment;
