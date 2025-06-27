import React, { useEffect, useState } from "react";
import "./facultyinfo.css";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/config";
import { UserAuth } from "../../context/AuthContext";
import ReviewModal from "../reviewModel";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

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

function FacultyInfo() {
  const { facultyId } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = UserAuth();

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const ref = doc(db, "faculty", facultyId);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          setFaculty({ id: snapshot.id, ...snapshot.data() });
        } else {
          console.error("Faculty not found");
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    fetchFacultyData();
  }, [facultyId]);

  const handleBookmark = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      bookmarks: arrayUnion(facultyId),
    });
    alert("Faculty bookmarked!");
  };

  const handleReviewSubmit = async (review) => {
    const facultyRef = doc(db, "faculty", facultyId);
    const userReview = {
      ...review,
      userId: user.uid,
      name: user.displayName,
      helpful: 0,
      notHelpful: 0,
      votes: {},
    };
    const updatedReviews = (faculty.reviews || []).filter(
      (r) => r.userId !== user.uid
    );
    updatedReviews.push(userReview);
    await updateDoc(facultyRef, {
      reviews: updatedReviews,
    });
    setFaculty((prev) => ({ ...prev, reviews: updatedReviews }));
    setShowModal(false);
  };

  if (!faculty) return <div className="faculty-info-page">Loading...</div>;

  const hasUserReviewed = faculty.reviews?.some((r) => r.userId === user?.uid);

  const getAverageRating = (key) => {
    const ratings = faculty.reviews?.map((r) => r[key]) || [];
    if (!ratings.length) return 0;
    const avg = ratings.reduce((acc, val) => acc + val, 0) / ratings.length;
    return Math.round(avg * 10) / 10;
  };

  return (
    <div className="faculty-info-page">
      <h1 className="faculty-info-title">FACULTY INFO</h1>

      <div className="faculty-details-section">
        <div className="teacher-image-container">
          <img
            src={faculty.image || "/default-avatar.png"}
            alt={faculty.name}
            className="teacher-image"
          />
        </div>

        <div className="teacher-info-texts">
          <h2 className="teacher-name">{faculty.name}</h2>
          <p className="teacher-school">
            <b>School:</b> {faculty.school}
          </p>
          <p className="teacher-department">
            <b>Department:</b> {faculty.department}
          </p>
          <p className="teacher-cabin">
            <b>Cabin:</b> {faculty.cabin}
          </p>
          <p className="teacher-email">
            <b>Email:</b> {faculty.email}
          </p>
          {!hasUserReviewed && (
            <button className="rev-button" onClick={() => setShowModal(true)}>
              Write Review
            </button>
          )}
          <button className="rev-button" onClick={handleBookmark}>
            Bookmark
          </button>
        </div>

        <div className="ratings-section">
          <h2 className="ratings-title">Ratings</h2>
          <p className="rating-text">
            Overall: {getAverageRating("overall")}/5
          </p>
          {renderStars(getAverageRating("overall"))}
          <p className="rating-text">Notes: {getAverageRating("notes")}/5</p>
          {renderStars(getAverageRating("notes"))}
          <p className="rating-text">Marks: {getAverageRating("marks")}/5</p>
          {renderStars(getAverageRating("marks"))}
        </div>
      </div>

      <h2 className="student-reviews-title">Student Reviews</h2>
      {faculty.reviews?.map((rev, i) => (
        <ReviewBox
          key={i}
          review={rev}
          facultyId={facultyId}
          setFaculty={setFaculty}
          currentUserId={user?.uid}
        />
      ))}

      {showModal && (
        <ReviewModal
          onClose={() => setShowModal(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}

function ReviewBox({ review, facultyId, setFaculty, currentUserId }) {
  const [expanded, setExpanded] = useState(false);
  const nameMasked = review.name
    ? `${review.name.slice(0, 2)}******${review.name.slice(-2)}`
    : "Anonymous";

  const handleVote = async (type) => {
    if (!currentUserId) return;
    if (review.votes?.[currentUserId]) return; // already voted

    const ref = doc(db, "faculty", facultyId);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return;
    const data = snapshot.data();

    const updatedReviews = data.reviews.map((r) => {
      if (r.userId === review.userId) {
        return {
          ...r,
          helpful: type === "helpful" ? r.helpful + 1 : r.helpful,
          notHelpful: type === "notHelpful" ? r.notHelpful + 1 : r.notHelpful,
          votes: { ...(r.votes || {}), [currentUserId]: type },
        };
      }
      return r;
    });

    await updateDoc(ref, { reviews: updatedReviews });
    setFaculty((prev) => ({ ...prev, reviews: updatedReviews }));
  };

  return (
    <div className="review-box">
      <div className="review-header">
        <p className="review-name">
          <b>{nameMasked}</b>
        </p>
      </div>
      <p className="rating-text">Overall</p>
      {renderStars(review.overall)}
      <p className="rating-text">Notes</p>
      {renderStars(review.notes)}
      <p className="rating-text">Marks</p>
      {renderStars(review.marks)}
      <p className="review-text">
        {expanded ? review.text : review.text.slice(0, 150)}
        {review.text.length > 150 && (
          <span
            style={{ color: "#FBFF0C", cursor: "pointer" }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? " Show less" : "... Show more"}
          </span>
        )}
      </p>
      <div className="review-actions">
        <button
          className="rev-button"
          onClick={() => handleVote("helpful")}
          disabled={review.votes?.[currentUserId]}
        >
          <FaThumbsUp style={{ marginRight: "8px" }} /> {review.helpful || 0}
        </button>
        <button
          className="rev-button"
          onClick={() => handleVote("notHelpful")}
          disabled={review.votes?.[currentUserId]}
        >
          <FaThumbsDown style={{ marginRight: "8px" }} />{" "}
          {review.notHelpful || 0}
        </button>
      </div>
    </div>
  );
}

export default FacultyInfo;
