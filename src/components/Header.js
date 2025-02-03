import React from 'react';
import { Navbar, Container, Image } from 'react-bootstrap';
import logo from '../assets/logo.jpg'; // Replace with your logo path

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className="custom-header">
      <Container>
        <Navbar.Brand href="/">
          <Image
            src={logo}
            width="100"
            height="50"
            className="d-inline-block align-top"
            alt="Organization Logo"
          />{' '}
          Evernorth Health Services
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;