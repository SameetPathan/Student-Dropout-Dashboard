import React from 'react';
import { 
  Carousel, 
  Container, 
  Row, 
  Col, 
  Button, 
  Card 
} from 'react-bootstrap';
import { FaChartBar, FaUsers, FaMapMarkedAlt, FaArrowRight } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Carousel */}
      <Carousel fade interval={5000} className="hero-carousel" style={{marginTop:"-18px"}}>
        <Carousel.Item >
          <div style={{
            background: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 51%, #fdbb2d 100%)',
            height: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '0 5%'
          }}>
            <div className="text-white">
              <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeIn">
                Student Dropout Analysis
              </h1>
              <h3 className="h2 mb-4 animate__animated animate__fadeIn animate__delay-1s">
                Data-Driven Insights
              </h3>
              <p className="lead mb-4 animate__animated animate__fadeIn animate__delay-2s">
                Analyze dropout rates with advanced analytics and visualization tools
              </p>
              
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div style={{
            background: 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)',
            height: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '0 5%'
          }}>
            <div className="text-white">
              <h1 className="display-3 fw-bold mb-4">Demographic Analysis</h1>
              <h3 className="h2 mb-4">Understanding Patterns</h3>
              <p className="lead mb-4">Comprehensive analysis of student demographics and trends</p>
             
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div style={{
            background: 'linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)',
            height: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '0 5%'
          }}>
            <div className="text-white">
              <h1 className="display-3 fw-bold mb-4">Geographic Insights</h1>
              <h3 className="h2 mb-4">Regional Patterns</h3>
              <p className="lead mb-4">Explore dropout trends across different regions</p>
             
            </div>
          </div>
        </Carousel.Item>
      </Carousel>

      {/* Features Section */}
      <div className="w-100 py-5" style={{ background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)' }}>
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold mb-4">Our Features</h2>
          <p className="lead text-muted">Comprehensive tools for analyzing student dropout patterns</p>
        </div>

        <div className="px-4">
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 shadow-sm hover-card border-0">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon bg-primary bg-gradient text-white rounded-circle mb-4 mx-auto"
                       style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaChartBar size={40} />
                  </div>
                  <Card.Title className="h4 mb-3">Data Analysis</Card.Title>
                  <Card.Text className="text-muted">
                    Utilize machine learning algorithms to identify dropout patterns and predict at-risk students
                  </Card.Text>
                  <Button variant="outline-primary" className="mt-3">
                    Learn More <FaArrowRight className="ms-2" />
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 shadow-sm hover-card border-0">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon bg-success bg-gradient text-white rounded-circle mb-4 mx-auto"
                       style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaUsers size={40} />
                  </div>
                  <Card.Title className="h4 mb-3">Demographic Insights</Card.Title>
                  <Card.Text className="text-muted">
                    Analyze dropout rates by gender, caste, age groups, and other demographic factors
                  </Card.Text>
                  <Button variant="outline-success" className="mt-3">
                    View Details <FaArrowRight className="ms-2" />
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 shadow-sm hover-card border-0">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon bg-warning bg-gradient text-white rounded-circle mb-4 mx-auto"
                       style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaMapMarkedAlt size={40} />
                  </div>
                  <Card.Title className="h4 mb-3">Geographic Trends</Card.Title>
                  <Card.Text className="text-muted">
                    Visualize dropout rates across different schools, districts, and regions
                  </Card.Text>
                  <Button variant="outline-warning" className="mt-3">
                    Explore Map <FaArrowRight className="ms-2" />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-100 py-5" style={{ background: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)' }}>
        <Row className="text-center g-4 mx-0">
          <Col md={3}>
            <h2 className="display-4 fw-bold text-white mb-3">500+</h2>
            <p className="text-light">Schools Analyzed</p>
          </Col>
          <Col md={3}>
            <h2 className="display-4 fw-bold text-white mb-3">10k+</h2>
            <p className="text-light">Students Tracked</p>
          </Col>
          <Col md={3}>
            <h2 className="display-4 fw-bold text-white mb-3">95%</h2>
            <p className="text-light">Accuracy Rate</p>
          </Col>
          <Col md={3}>
            <h2 className="display-4 fw-bold text-white mb-3">24/7</h2>
            <p className="text-light">Support Available</p>
          </Col>
        </Row>
      </div>

      {/* CSS for animations and hover effects */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default HomePage;