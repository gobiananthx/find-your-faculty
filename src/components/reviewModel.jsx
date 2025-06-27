import React, { useState } from "react";
import "./reviewModel.css";

function ReviewModal({ onClose, onSubmit }) {
  const [overall, setOverall] = useState(0);
  const [notes, setNotes] = useState(0);
  const [marks, setMarks] = useState(0);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (overall && notes && marks && text.trim()) {
      onSubmit({ overall, notes, marks, text });
    } else {
      alert("Please fill all fields.");
    }
  };

  const renderInputStars = (rating, setter) => (
    <div className="modal-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= rating ? "star filled" : "star"}
          onClick={() => setter(i)}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Write Your Review</h2>

        <label className="modal-label">Overall Rating</label>
        {renderInputStars(overall, setOverall)}

        <label className="modal-label">Notes Rating</label>
        {renderInputStars(notes, setNotes)}

        <label className="modal-label">Marks Rating</label>
        {renderInputStars(marks, setMarks)}

        <label className="modal-label">Review</label>
        <textarea
          className="modal-textarea"
          rows="5"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your experience here..."
        />

        <div className="modal-buttons">
          <button className="modal-submit" onClick={handleSubmit}>Submit</button>
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;