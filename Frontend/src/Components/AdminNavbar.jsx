import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom
function AdminNavbar() {
  let [searchvalue, setSearchValue] = useState("");

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  let navigate = useNavigate();

  function handleSearch(event) {
    setSearchValue(event.target.value);
  }

  return (
    <>
    <nav className="navbar">
      <div className="navbar-brand">
      <Link to=""></Link>
      </div>
      <div className={`navbar-links ${isMobileMenuOpen ? "active" : ""}`}>
        <Link to="/insertProduct" className="navbar-link">Add Product</Link> {/* Changed a tag to Link */}
        <Link to="/home" className="navbar-link">Home</Link> {/* Changed a tag to Link */}
        <Link to="/orders" className="navbar-link">Orders</Link> 
        <span
       className="navbar-link"
        onClick={() => {
         if (window.confirm("Are you sure you want to logout?")) {
           localStorage.removeItem("role"); // Remove 'role' from localStorage
           localStorage.removeItem("token"); //remove "token from localstorage"
            navigate('/login'); // Navigate to the login page
         }
        }}
         style={{ cursor: "pointer" }}
         >
         Logout
        </span>
        <input type="text" onChange={handleSearch} />

        <button className="search" onClick={() => {
          navigate('/search', { state: { value: searchvalue } });
        }}>
          Search
        </button>
      </div>
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span className="navbar-toggle-icon"></span>
        <span className="navbar-toggle-icon"></span>
        <span className="navbar-toggle-icon"></span>
      </div>
    </nav>
    </>
  );
}

export default AdminNavbar;
