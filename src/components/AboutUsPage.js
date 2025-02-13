import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaChartLine, FaHandshake, FaGraduationCap, FaChartBar, FaLightbulb } from 'react-icons/fa';

const AboutUsPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div 
        className="hero-section text-white py-5"
        style={{
          background: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 51%, #fdbb2d 100%)',
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4 animate-in">About Our Mission</h1>
              <p className="lead mb-4 animate-in">
                The Student Dropout Analysis Dashboard is dedicated to understanding and addressing 
                the complex issue of student dropouts through data-driven insights and advanced analytics.
              </p>
              <div className="d-flex gap-3 animate-in">
                <div className="d-flex align-items-center">
                  <FaGraduationCap className="me-2" size={24} />
                  <span>500+ Schools</span>
                </div>
                <div className="d-flex align-items-center">
                  <FaChartBar className="me-2" size={24} />
                  <span>95% Accuracy</span>
                </div>
                <div className="d-flex align-items-center">
                  <FaLightbulb className="me-2" size={24} />
                  <span>24/7 Support</span>
                </div>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <div className="py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <Card className="border-0 shadow-sm h-100 hover-card">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon bg-primary bg-gradient text-white rounded-circle mb-4 mx-auto"
                       style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaUsers size={40} />
                  </div>
                  <Card.Title className="h4 mb-3">Our Team</Card.Title>
                  <Card.Text>
                    We are a dedicated group of data scientists, educators, and developers working 
                    together to improve educational outcomes through advanced analytics and machine learning.
                    Our diverse team brings expertise from various fields to tackle the complex challenge 
                    of student retention.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="border-0 shadow-sm h-100 hover-card">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon bg-success bg-gradient text-white rounded-circle mb-4 mx-auto"
                       style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaChartLine size={40} />
                  </div>
                  <Card.Title className="h4 mb-3">Our Approach</Card.Title>
                  <Card.Text>
                    Using cutting-edge data analysis techniques, we examine multiple factors including 
                    school environment, geographic location, demographic details, and socioeconomic indicators 
                    to identify patterns and trends in student dropout rates.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="border-0 shadow-sm h-100 hover-card">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon bg-warning bg-gradient text-white rounded-circle mb-4 mx-auto"
                       style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaHandshake size={40} />
                  </div>
                  <Card.Title className="h4 mb-3">Our Impact</Card.Title>
                  <Card.Text>
                    Through strategic partnerships with educational institutions, we've helped develop 
                    targeted interventions that have significantly reduced dropout rates. Our data-driven 
                    insights continue to shape effective educational policies.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Vision Section */}
      <div className="py-5" style={{ background: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)' }}>
        <Container>
          <Row className="justify-content-center text-center text-white">
            <Col md={8}>
              <h2 className="display-5 fw-bold mb-4">Our Vision</h2>
              <p className="lead mb-4">
                We envision a future where every student has the support they need to complete their 
                education successfully. Through data-driven insights and collaborative efforts, 
                we're working to make this vision a reality.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        .animate-in {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hover-card {
          transition: transform 0.3s ease-in-out;
        }

        .hover-card:hover {
          transform: translateY(-10px);
        }

        .feature-icon {
          transition: all 0.3s ease-in-out;
        }

        .hover-card:hover .feature-icon {
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .animate-in {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUsPage;