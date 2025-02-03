import React, { useState } from "react";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import authService from "../services/authService"; // Ensure the path is correct
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [registerData, setRegisterData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    manager: { id: "" }
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setRegisterData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setRegisterData(prev => ({ ...prev, [name]: value }));
    }

    if (name === "confirmPassword") {
      setPasswordError(value !== registerData.password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!registerData.id.trim()) {
      setModalMessage("Employee ID field should not be empty.");
      setShowModal(true);
      return;
    }
    if (!registerData.firstName.trim()) {
      setModalMessage("First Name field should not be empty.");
      setShowModal(true);
      return;
    }
    if (!registerData.lastName.trim()) {
      setModalMessage("Last Name field should not be empty.");
      setShowModal(true);
      return;
    }
    if (!registerData.email.includes("@") || registerData.email.split("@")[1].trim() === "") {
      setModalMessage("Email must contain '@' followed by a valid domain.");
      setShowModal(true);
      return;
    }
    if (!registerData.role.trim()) {
      setModalMessage("Role not selected. Please select a role.");
      setShowModal(true);
      return;
    }
    if (!registerData.password) {
      setModalMessage("Password field should not be empty.");
      setShowModal(true);
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setModalMessage("Password and Confirm Password do not match.");
      setShowModal(true);
      return;
    }

    // Prepare the data to send to backend
    const employeeData = {
      id: registerData.id,
      name: `${registerData.firstName} ${registerData.lastName}`,
      email: registerData.email,
      role: registerData.role,
      credentials: registerData.password,
      manager: {
        id: registerData.manager.id
      }
    };

    try {
      // Call the register function from authService
      await authService.registerEmployee(employeeData);
      setModalMessage("Registration successful!");
      setShowModal(true);
      // Reset form data
      setRegisterData({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
        manager: { id: "" }
      });
    } catch (error) {
      setModalMessage(error.message || "An error occurred during registration.");
      setShowModal(true);
    }
  };

  const handleModalClose = () => setShowModal(false);

  return (
    <div>
      <h3 className="text-center mt-4">Register New Employee</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formId">
          <Form.Label>Employee ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter employee ID"
            name="id"
            value={registerData.id}
            onChange={handleRegisterChange}
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="firstName"
                value={registerData.firstName}
                onChange={handleRegisterChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="lastName"
                value={registerData.lastName}
                onChange={handleRegisterChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={registerData.email}
            onChange={handleRegisterChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formRole">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            name="role"
            value={registerData.role}
            onChange={handleRegisterChange}
          >
            <option value="">Select Role</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formManagerId">
          <Form.Label>Manager ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter manager ID"
            name="manager.id"
            value={registerData.manager.id}
            onChange={handleRegisterChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={registerData.password}
            onChange={handleRegisterChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
          />
          {passwordError && (
            <Form.Text className="text-danger">
              Password and Confirm Password do not match.
            </Form.Text>
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registration Message</Modal.Title>
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

export default Register;
