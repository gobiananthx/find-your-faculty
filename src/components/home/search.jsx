import React, { useEffect, useState } from "react";
import "./search.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchResults = async (queryText) => {
    const trimmedQuery = queryText.trim().toLowerCase().replace(/\s+/g, "");

    if (trimmedQuery.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const facultyRef = collection(db, "faculty");
      const snapshot = await getDocs(facultyRef);

      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((faculty) => {
          const idMatch = faculty.id
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(trimmedQuery);
          const nameMatch = (faculty.name || "")
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(trimmedQuery);
          return idMatch || nameMatch;
        });

      setResults(data);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    navigate(`/search?query=${encodeURIComponent(value)}`);
  };

  const handleKnowMoreClick = (facultyId) => {
    navigate(`/faculty/${facultyId}`);
  };

  return (
    <div className="search-page">
      <div className="search-bar search-bar-top">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Enter Faculty Name"
          value={searchQuery}
          onChange={handleInputChange}
          required
          minLength={3}
        />
      </div>

      {searchQuery.trim().length >= 1 && searchQuery.trim().length < 3 && (
        <p className="search-note">Type at least 3 characters to search</p>
      )}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="card-grid">
          {results.length === 0 && searchQuery.trim().length >= 3 && (
            <p>No faculty found.</p>
          )}
          {results.map((faculty) => (
            <div className="faculty-card" key={faculty.id}>
              <img
                src={faculty.image || "/default-avatar.png"}
                alt={faculty.name}
                className="faculty-photo"
              />
              <div className="faculty-name">{faculty.name}</div>
              <button
                className="know-more-btn"
                onClick={() => handleKnowMoreClick(faculty.id)}
              >
                Know More →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
