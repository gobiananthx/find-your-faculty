import React, { useEffect, useState } from "react";
import "./bookmark.css";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase/config";
import { UserAuth } from "../../context/AuthContext";

const renderStars = (rating) => {
  const rounded = Math.round(rating);
  return (
    <div className="star-row">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          style={{
            color: i < rounded ? "#FBFF0C" : "#ccc",
            fontSize: "42px",
            textShadow: "0 0 0 #000",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const Bookmark = () => {
  const { user } = UserAuth();
  const [facultyList, setFacultyList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const { bookmarks = [] } = userSnap.data();

        const facultyData = await Promise.all(
          bookmarks.map(async (id) => {
            const facultyRef = doc(db, "faculty", id);
            const facultySnap = await getDoc(facultyRef);
            if (facultySnap.exists()) {
              return { id, ...facultySnap.data() };
            } else {
              return null;
            }
          })
        );

        setFacultyList(facultyData.filter(Boolean)); // remove nulls
      }
    };

    fetchBookmarks();
  }, [user]);

  const handleKnowMoreClick = (facultyId) => {
    navigate(`/faculty/${facultyId}`);
  };

  return (
    <div className="bookmark-page">
      <h2 className="bookmark-title">BOOKMARKED FACULTY</h2>

      <div className="card-grid">
        {facultyList.length === 0 ? (
          <p style={{ fontSize: "20px", color: "#333" }}>
            You haven’t bookmarked any faculty yet.
          </p>
        ) : (
          facultyList.map((faculty) => (
            <div className="faculty-card-b" key={faculty.id}>
              <div className="faculty-name-b">{faculty.name}</div>
              <div className="faculty-content-b">
                <img
                  src={faculty.image || "/default-avatar.png"}
                  alt={faculty.name}
                  className="faculty-photo-b"
                />

                <div className="rating-block">
                  <div className="rating-label">
                    Overall:{" "}
                    {faculty.reviews?.length
                      ? (
                          faculty.reviews.reduce(
                            (sum, r) => sum + r.overall,
                            0
                          ) / faculty.reviews.length
                        ).toFixed(1)
                      : "N/A"}
                    /5
                  </div>
                  {renderStars(
                    faculty.reviews?.length
                      ? faculty.reviews.reduce((sum, r) => sum + r.overall, 0) /
                          faculty.reviews.length
                      : 0
                  )}

                  <div className="rating-label">
                    Notes:{" "}
                    {faculty.reviews?.length
                      ? (
                          faculty.reviews.reduce((sum, r) => sum + r.notes, 0) /
                          faculty.reviews.length
                        ).toFixed(1)
                      : "N/A"}
                    /5
                  </div>
                  {renderStars(
                    faculty.reviews?.length
                      ? faculty.reviews.reduce((sum, r) => sum + r.notes, 0) /
                          faculty.reviews.length
                      : 0
                  )}

                  <div className="rating-label">
                    Marks:{" "}
                    {faculty.reviews?.length
                      ? (
                          faculty.reviews.reduce((sum, r) => sum + r.marks, 0) /
                          faculty.reviews.length
                        ).toFixed(1)
                      : "N/A"}
                    /5
                  </div>
                  {renderStars(
                    faculty.reviews?.length
                      ? faculty.reviews.reduce((sum, r) => sum + r.marks, 0) /
                          faculty.reviews.length
                      : 0
                  )}
                </div>
              </div>

              <button
                className="know-more-btn"
                onClick={() => handleKnowMoreClick(faculty.id)}
              >
                Know More →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookmark;
