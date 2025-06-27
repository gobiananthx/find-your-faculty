import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/home/navbar";
import Home from "./components/home/home";
import SearchResults from "./components/home/search";
import FacultyInfo from "./components/home/FacultyInfo";
import { AuthContextProvider } from "./context/AuthContext";
import Bookmark from "./components/home/bookmark";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/bookmark" element={<Bookmark />} />
            <Route path="/faculty/:facultyId" element={<FacultyInfo />} />
          </Routes>
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
