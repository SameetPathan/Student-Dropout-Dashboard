import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomNavbar = ({ navItems, isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      className={`py-3 navbar-transition ${scrolled ? 'navbar-scrolled' : ''}`}
      style={{
        background: scrolled 
          ? 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 51%, #fdbb2d 100%)'
          : 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 51%, #fdbb2d 100%)',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <div className="w-100 px-4">
        {/* Logo/Brand on the left */}
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="me-auto brand-text"
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#fff',
            textShadow: scrolled ? 'none' : '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          SDA
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav"
          className="custom-toggler"
        />
        
        {/* Navigation items aligned to the right */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* Navigation Items */}
            {navItems.map((item, index) => (
              <Nav.Link
                key={index}
                as={Link}
                to={item.path}
                className={`px-3 nav-link-custom ${location.pathname === item.path ? 'active' : ''}`}
                style={{
                  color: '#fff',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
              >
                {item.label}
              </Nav.Link>
            ))}
            
            {/* User Welcome and Logout Button */}
            {isAuthenticated && (
              <>
                <span 
                  className="navbar-text px-3"
                  style={{
                    color: '#fff',
                    opacity: '0.9'
                  }}
                >
                  Welcome, {user?.userType}
                </span>
                <Button
                  variant="outline-light"
                  onClick={handleLogout}
                  className="ms-3 logout-btn"
                  style={{
                    borderRadius: '25px',
                    padding: '8px 20px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .navbar-transition {
          backdrop-filter: ${scrolled ? 'blur(10px)' : 'none'};
          box-shadow: ${scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'};
        }

        .nav-link-custom {
          font-weight: 500;
          padding: 0.5rem 1rem;
        }

        .nav-link-custom::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          background-color: #fff;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-link-custom:hover::after,
        .nav-link-custom.active::after {
          width: 70%;
        }

        .nav-link-custom:hover {
          color: #fff !important;
          transform: translateY(-2px);
        }

        .logout-btn:hover {
          background-color: #fff !important;
          color: #1a2a6c !important;
          transform: translateY(-2px);
        }

        .custom-toggler {
          border-color: rgba(255,255,255,0.8) !important;
        }

        .custom-toggler .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        @media (max-width: 991px) {
          .navbar-collapse {
            background: ${scrolled ? 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 51%, #fdbb2d 100%)' : 'rgba(0,0,0,0.9)'};
            padding: 1rem;
            border-radius: 10px;
            margin-top: 1rem;
          }
        }
      `}</style>
    </Navbar>
  );
};

export default CustomNavbar;