import React, { useState } from 'react';
import { Form, Button, Toast, ToastContainer, Image } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaSignInAlt, FaUser, FaArrowRight } from 'react-icons/fa';
import { getDatabase, ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'Student',
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getDatabase();
      const usersRef = ref(db, 'StudentDropOut/users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        let userFound = false;
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (
            userData.email === formData.email &&
            userData.password === formData.password &&
            userData.userType === formData.userType
          ) {
            userFound = true;
            onLogin({ 
              email: formData.email,
              userType: formData.userType,
              id: childSnapshot.key
            });
            showToastMessage('Login successful!', 'success');
            switch (formData.userType) {
              case 'Student':
                navigate('/student-dashboard');
                break;
              case 'School':
                navigate('/school-dashboard');
                break;
              case 'Admin':
                navigate('/admin-dashboard');
                break;
              default:
                navigate('/');
            }
            return;
          }
        });
        if (!userFound) {
          showToastMessage('Invalid email, password, or user type', 'danger');
        }
      } else {
        showToastMessage('No users found', 'danger');
      }
    } catch (error) {
      showToastMessage('An error occurred during login.', 'danger');
      console.error('Login error:', error);
    }
  };

  const showToastMessage = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center"
         style={{
           background: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 51%, #fdbb2d 100%)',
           padding: '2rem 0'
         }}>
      <div className="container">
        <div className="row justify-content-center align-items-center g-0">
          {/* Left side - Image and Text */}
          <div className="col-md-6 d-none d-md-block p-4">
            <div className="text-center animate-in-delayed">
             
              <div className="text-white text-center mt-4">
                <h3 className="fw-bold">Welcome Back!</h3>
                <p className="lead">Access your dashboard and analyze student dropout patterns</p>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="col-md-6 p-4">
            <div className="card border-0 shadow-lg animate-in"
                 style={{
                   borderRadius: '20px',
                   background: 'rgba(255, 255, 255, 0.95)',
                   backdropFilter: 'blur(10px)'
                 }}>
              <div className="card-body p-4">
                <h2 className="text-center mb-4 fw-bold">
                  <FaSignInAlt className="me-2 text-primary" />
                  Login to Your Account
                </h2>
                <Form onSubmit={handleSubmit} className="form-floating">
                  <div className="form-group floating-input mb-4">
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter email address"
                      className="form-control rounded-pill"
                      style={{ padding: '0.75rem 1.25rem' }}
                    />
                    <Form.Label className="ms-2"><FaEnvelope className="me-2" />Email Address</Form.Label>
                  </div>

                  <div className="form-group floating-input mb-4">
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter password"
                      className="form-control rounded-pill"
                      style={{ padding: '0.75rem 1.25rem' }}
                    />
                    <Form.Label className="ms-2"><FaLock className="me-2" />Password</Form.Label>
                  </div>

                  <div className="form-group mb-4">
                    <Form.Select
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      required
                      className="form-control rounded-pill"
                      style={{ padding: '0.75rem 1.25rem' }}
                    >
                      <option value="Student">Student</option>
                      <option value="School">School</option>
                      <option value="Admin">Admin</option>
                    </Form.Select>
                  </div>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 rounded-pill py-3 mt-3 d-flex align-items-center justify-content-center"
                  >
                    <FaSignInAlt className="me-2" /> Sign In 
                    <FaArrowRight className="ms-2" />
                  </Button>

                  <div className="text-center mt-4">
                   
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-end" className="p-3">
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={3000} 
          autohide 
          bg={toastVariant}
          className="animate-toast"
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">
              {toastVariant === 'success' ? 'Success!' : 'Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'success' ? 'text-white' : ''}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <style jsx>{`
        .form-floating > .form-control {
          height: calc(3.5rem + 2px);
          line-height: 1.25;
        }

        .form-floating > label {
          padding: 1rem 1.25rem;
        }

        .animate-in {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease forwards;
        }

        .animate-in-delayed {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease forwards 0.3s;
        }

        .animate-toast {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .form-control:focus {
          border-color: #1a2a6c;
          box-shadow: 0 0 0 0.2rem rgba(26, 42, 108, 0.25);
        }

        .btn-primary {
          background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
          border: none;
          transition: transform 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
        }

        .hover-link {
          transition: all 0.3s ease;
        }

        .hover-link:hover {
          color: #1a2a6c !important;
        }

        @media (max-width: 768px) {
          .animate-in, .animate-in-delayed {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;