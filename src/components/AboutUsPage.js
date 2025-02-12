import React from 'react';
import { FaUsers, FaChartLine, FaHandshake } from 'react-icons/fa';

const AboutUsPage = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4"></h1>
      <div className="row">
        <div className="col-md-6">
          <img
            src="about.jpg"
            alt="Data Analysis"
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <p className="lead">
            The Student Dropout Analysis Dashboard is dedicated to understanding and addressing the complex issue of student dropouts. Our mission is to provide data-driven insights to policymakers and educators, enabling them to make informed decisions to reduce dropout rates.
          </p>
          <div className="mt-4">
            <h4><FaUsers className="text-primary me-2" /> Our Team</h4>
            <p>We are a group of data scientists, educators, and developers committed to improving educational outcomes through advanced analytics and machine learning.</p>
          </div>
          <div className="mt-4">
            <h4><FaChartLine className="text-success me-2" /> Our Approach</h4>
            <p>We analyze various factors including school, area, gender, caste, and age to identify patterns and trends in student dropout rates, providing actionable insights.</p>
          </div>
          <div className="mt-4">
            <h4><FaHandshake className="text-warning me-2" /> Our Impact</h4>
            <p>By collaborating with schools and educational institutions, we aim to contribute to the development of targeted interventions and policies to reduce student dropouts.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
