// components/CustomNavbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomNavbar = ({ navItems, isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        {/* Logo/Brand on the left */}
        <Navbar.Brand as={Link} to="/" className="me-auto">
          Student Dropout Analysis
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        {/* All navigation items aligned to the right */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* Navigation Items */}
            {navItems.map((item, index) => (
              <Nav.Link
                key={index}
                as={Link}
                to={item.path}
                className="px-3"
              >
                {item.label}
              </Nav.Link>
            ))}
            
            {/* User Welcome and Logout Button */}
            {isAuthenticated && (
              <>
                <span className="navbar-text text-light px-3">
                  Welcome, {user?.userType}
                </span>
                <Button
                  variant="outline-light"
                  onClick={handleLogout}
                  className="ms-3"
                >
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;