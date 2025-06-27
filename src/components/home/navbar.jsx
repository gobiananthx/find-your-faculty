import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { UserAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, googleSignIn, logOut } = UserAuth();
  const navigate = useNavigate();

  const handleAuthClick = async () => {
    if (user) {
      await logOut();
      navigate("/");
    } else {
      await googleSignIn();
      navigate("/");
    }
  };

  return (
    <div className="navbar-wrapper">
      <div className="navbar-logo">Logo</div>

      <div className="navbar-center">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/requests">Requests</Link></li>
          <li><Link to="/bookmark">Bookmark</Link></li>
          <li><Link to="/faqs">FAQs</Link></li>
        </ul>
      </div>

      <button className="login-button" onClick={handleAuthClick}>
        {user ? "Logout" : "Login"}
      </button>
    </div>
  );
};

export default Navbar;
