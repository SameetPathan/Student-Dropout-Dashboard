import React from 'react';
import { Carousel } from 'react-bootstrap';
import { FaChartBar, FaUsers, FaMapMarkedAlt } from 'react-icons/fa';
import '../HomePage.css'; // You'll need to create this CSS file

const HomePage = () => {
  return (
    <div className="home-page">
      <Carousel fade className="full-screen-carousel">
        <Carousel.Item>
          <div 
            className="carousel-image"
            style={{backgroundImage: `url('bg1.jpg')`}}
          />
          <Carousel.Caption>
            <h1 className="main-title">Student Dropout Analysis</h1>
            <h3>Data-Driven Insights</h3>
            <p>Analyze dropout rates across various factors</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div 
            className="carousel-image"
            style={{backgroundImage: `url('bg3.jpg')`}}
          />
          <Carousel.Caption>
            <h1 className="main-title">Student Dropout Analysis</h1>
            <h3>Demographic Factors</h3>
            <p>Understand the impact of gender, caste, and age on dropout rates</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div 
            className="carousel-image"
            style={{backgroundImage: `url('bg2.jpg')`}}
          />
          <Carousel.Caption>
            <h1 className="main-title">Student Dropout Analysis</h1>
            <h3>Geographic Insights</h3>
            <p>Explore dropout patterns across different regions</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-md-4 text-center">
            <FaChartBar size={50} className="text-primary mb-3" />
            <h4>Data Analysis</h4>
            <p>Utilize machine learning algorithms to identify dropout patterns</p>
          </div>
          <div className="col-md-4 text-center">
            <FaUsers size={50} className="text-success mb-3" />
            <h4>Demographic Insights</h4>
            <p>Analyze dropout rates by gender, caste, and age groups</p>
          </div>
          <div className="col-md-4 text-center">
            <FaMapMarkedAlt size={50} className="text-warning mb-3" />
            <h4>Geographic Trends</h4>
            <p>Visualize dropout rates across schools and regions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
