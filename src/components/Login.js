import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
// import bootst
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [modalMessage, setModalMessage] = useState(""); // Error message to display in modal
  const [emailError, setEmailError] = useState(false); // Track email validation error
  const navigate = useNavigate();
  

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prev) => ({ ...prev, [name]: value }));

    // Real-time email validation
    if (name === "email") {
      const isValidEmail = value.includes("@") && value.endsWith(".com");
      setEmailError(!isValidEmail);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate fields
    if (!loginDetails.email) {
      setModalMessage("Email field should not be empty.");
      setShowModal(true);
      return;
    }
    if (!loginDetails.password) {
      setModalMessage("Password field should not be empty.");
      setShowModal(true);
      return;
    }
    if (emailError) {
      setModalMessage("Invalid email. Please provide a valid email.");
      setShowModal(true);
      return;
    }
    
    try {
      // Attempt login via authService
      const response = await authService.login(loginDetails.email, loginDetails.password);
      // Display the success message (including role)
      setModalMessage(response); 
      setShowModal(true);
      navigate("/dashboard");
      
    } catch (error) {
      // Handle error properly based on status and message
      if (error.status === 401) {
        setModalMessage(error.message || "Invalid email or password");
      } else {
        setModalMessage("An error occurred during login.");
      }
      setShowModal(true);
    }
  };
  

  const handleModalClose = () => setShowModal(false);

  return (
    <div>
      <h3 className="text-center mt-4">Login</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={loginDetails.email}
            onChange={handleLoginChange}
            isInvalid={emailError} // Highlight the field if email is invalid
          />
          {emailError && (
            <Form.Text className="text-danger">
              Invalid email.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={loginDetails.password}
            onChange={handleLoginChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      {/* Modal for validation messages */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
