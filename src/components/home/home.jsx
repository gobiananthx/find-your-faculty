import React from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import teacherImage from "./teacher.png";
import { UserAuth } from "../../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { user, googleSignIn } = UserAuth();

  const handleSearchClick = async () => {
    if (!user) {
      try {
        await googleSignIn();
      } catch (error) {
        console.error("Login failed:", error);
        return;
      }
    }
    navigate("/search");
  };

  return (
    <div className="home">
      <div className="home-content">
        <div className="home-left">
          <h1 className="home-title">Review Your Faculty</h1>

          <button className="search-button" onClick={handleSearchClick}>
            Search Faculty
          </button>
        </div>

        <div className="home-right">
          <img src={teacherImage} alt="Teacher" className="teacher-image" />
        </div>
      </div>

      <p className="footer-text">EXPLORE 2000+ FACULTIES FOR VIT VELLORE</p>
    </div>
  );
}

export default Home;
