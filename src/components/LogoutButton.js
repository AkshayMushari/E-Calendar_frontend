import React from "react";
import { Button } from "react-bootstrap";
import authService from "../services/authService";

const LogoutButton = () => {
  const handleLogout = () => {
    authService.logout();
  };

  return (
    <Button variant="danger" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
