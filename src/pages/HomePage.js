import React, { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Login from "../components/Login"; // Updated import path for Login
import Register from "../components/Register"; // Updated import path for Register

function HomePage() {
  const [showLogin, setShowLogin] = useState(null); // null = no form selected, true = Login form, false = Register form

  return (
    <Container className="d-flex flex-column align-items-center justify-content-start min-vh-100 pt-5">
      {/* Sticky button container */}
      <Row className="sticky-top bg-light py-2 w-100" style={{ zIndex: 10 }}>
        <Col className="text-center">
          <Button
            variant={showLogin === true ? "primary" : "outline-primary"}
            className="m-2"
            onClick={() => setShowLogin(true)}
          >
            Login
          </Button>
          <Button
            variant={showLogin === false ? "primary" : "outline-primary"}
            className="m-2"
            onClick={() => setShowLogin(false)}
          >
            Register
          </Button>
        </Col>
      </Row>

      {/* Display Login or Register components */}
      {showLogin === true && <Login />}  {/* Display Login component */}
      {showLogin === false && <Register />} {/* Display Register component */}
    </Container>
  );
}

export default HomePage;
