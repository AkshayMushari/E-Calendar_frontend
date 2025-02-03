import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import LogoutButton from "./LogoutButton";

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Employee Portal</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="/dashboard">Dashboard</Nav.Link>
          <Nav.Link href="/profile">Profile</Nav.Link>
          <LogoutButton /> {/* Add Logout Button here */}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
