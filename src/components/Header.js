import React from "react";
import { Navbar, Image, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg"; // Replace with your logo path
import "./Header.css"; // Import the CSS file

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <Navbar bg="light" expand="lg" className="custom-header px-3">
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex align-items-center">
          <div className="logo-container">
            <Image
              src={logo}
              width="100"
              height="50"
              className="logo"
              alt="Organization Logo"
            />
          </div>
          <span className="fw-bold ms-2">Evernorth Health Services</span>
        </div>
        {!isLoginPage && (
          <Button variant="outline-primary" onClick={handleLogout}>Logout</Button>
        )}
      </div>
    </Navbar>
  );
};

export default Header;
