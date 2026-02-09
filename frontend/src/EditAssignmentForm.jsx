import { useState } from "react";
import axios from "axios";

function EditAssignmentForm({ assignment, token, onUpdated }) {
  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/edit-assignment/${assignment.id}/`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Assignment updated");
      onUpdated && onUpdated();
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to update assignment");
    }
  };

  return (
    <div className="card">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}

export default EditAssignmentForm;
