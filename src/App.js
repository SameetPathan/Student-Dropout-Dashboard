// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';
import HomePage from './components/HomePage';
import AboutUsPage from './components/AboutUsPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import CustomNavbar from './components/CustomNavbar';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import SchoolDashboard from './components/SchoolDashboard';

// Protected Route Component
const ProtectedRoute = ({ isAllowed, redirectPath = '/login', children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  useEffect(() => {
    // Load user data from cookies on component mount
    const storedUser = cookies.user;
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []); 

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCookie('user', userData, { path: '/' });
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    removeCookie('user');
  };

  // Get default redirect path based on user type
  const getDefaultRedirect = () => {
    switch (user?.userType) {
      case 'Student':
        return '/student-dashboard';
      case 'School':
        return '/school-dashboard';
      case 'Admin':
        return '/admin-dashboard';
      default:
        return '/login';
    }
  };

  // Navigation items based on user type
  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About Us' },
        { path: '/register', label: 'Register' },
        { path: '/login', label: 'Login' }
      ];
    }

    // Remove Home from authenticated users' navigation
    switch (user?.userType) {
      case 'Student':
        return [
          { path: '/student-dashboard', label: 'Student Dashboard' }
        ];
      case 'School':
        return [
          { path: '/school-dashboard', label: 'School Dashboard' }
        ];
      case 'Admin':
        return [
          { path: '/admin-dashboard', label: 'Admin Dashboard' }
        ];
      default:
        return [];
    }
  };

  return (
    <CookiesProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <CustomNavbar 
            navItems={getNavItems()}
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
          />
          <main className="flex-grow-1 container py-4">
            <Routes>
              {/* Home Route - Redirects authenticated users to their dashboard */}
              <Route 
                path="/" 
                element={
                  isAuthenticated ? (
                    <Navigate to={getDefaultRedirect()} replace />
                  ) : (
                    <HomePage />
                  )
                } 
              />

              {/* Public Routes - Only accessible when not authenticated */}
              <Route 
                path="/about" 
                element={!isAuthenticated ? <AboutUsPage /> : <Navigate to={getDefaultRedirect()} />} 
              />
              <Route 
                path="/register" 
                element={!isAuthenticated ? <RegisterPage /> : <Navigate to={getDefaultRedirect()} />} 
              />
              <Route 
                path="/login" 
                element={
                  !isAuthenticated ? (
                    <LoginPage onLogin={handleLogin} />
                  ) : (
                    <Navigate to={getDefaultRedirect()} />
                  )
                } 
              />

              {/* Protected Routes */}
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute
                    isAllowed={isAuthenticated && user?.userType === 'Student'}
                  >
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/school-dashboard"
                element={
                  <ProtectedRoute
                    isAllowed={isAuthenticated && user?.userType === 'School'}
                  >
                    <SchoolDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute
                    isAllowed={isAuthenticated && user?.userType === 'Admin'}
                  >
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to={getDefaultRedirect()} replace />} />
            </Routes>
          </main>
          <footer className="footer mt-auto py-3 bg-dark text-light">
            <div className="container text-center">
              <p className="mb-0">&copy; 2024 Student Dropout Analysis. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </CookiesProvider>
  );
}

export default App;