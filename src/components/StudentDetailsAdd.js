import React, { useState } from 'react';
import { Form, Button, Toast, ToastContainer, Image } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaUniversity, FaBuilding, FaUpload, FaFileAlt, FaRegFileAlt } from 'react-icons/fa';
import { ref, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from "../firebase"; 
import { v4 as uuidv4 } from 'uuid';

const StudentDashboard = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    fullName: '',
    email: '',
    collegeName: '',
    course: '',
    year: '',
    reasonForDropout: ''
  });
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setDocuments([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { phoneNumber, fullName, email, collegeName, course, year, reasonForDropout } = formData;

    if (!phoneNumber || !fullName || !email || !collegeName || !course || !year || !reasonForDropout) {
      setToastMessage('Please fill in all fields.');
      setShowToast(true);
      return;
    }

    setUploading(true);

    // Upload documents to Firebase Storage and collect download URLs
    let documentURLs = [];
    for (let file of documents) {
      const storageReference = storageRef(storage, `documents/${phoneNumber}/${uuidv4()}-${file.name}`);
      const snapshot = await uploadBytes(storageReference, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      documentURLs.push(downloadURL);
    }

    // Store data in Realtime Database
    set(ref(database, `students/${phoneNumber}`), {
      fullName,
      email,
      collegeName,
      course,
      year,
      reasonForDropout,
      documentURLs
    });

    setUploading(false);
    setToastMessage('Student information and documents uploaded successfully.');
    setShowToast(true);
    setFormData({
      phoneNumber: '',
      fullName: '',
      email: '',
      collegeName: '',
      course: '',
      year: '',
      reasonForDropout: ''
    });
    setDocuments([]);
  };

  return (
    <div className="container mt-5 shadow-lg mb-5 p-5">
      <h1 className="text-center mb-4">Student Dropout Dashboard</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label><FaPhone className="me-2" />Phone Number</Form.Label>
          <Form.Control
            type="text"
            name="phoneNumber"
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label><FaUser className="me-2" />Full Name</Form.Label>
          <Form.Control
            type="text"
            name="fullName"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label><FaEnvelope className="me-2" />Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label><FaUniversity className="me-2" />College Name</Form.Label>
          <Form.Control
            type="text"
            name="collegeName"
            placeholder="Enter college name"
            value={formData.collegeName}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label><FaBuilding className="me-2" />Course</Form.Label>
          <Form.Control
            type="text"
            name="course"
            placeholder="Enter course"
            value={formData.course}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Year of Study</Form.Label>
          <Form.Control
            type="text"
            name="year"
            placeholder="Enter year of study"
            value={formData.year}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Reason for Dropout</Form.Label>
          <Form.Control
            as="textarea"
            name="reasonForDropout"
            placeholder="Provide a reason for dropping out"
            value={formData.reasonForDropout}
            onChange={handleInputChange}
            rows={3}
            required
          />
        </Form.Group>

        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label><FaUpload className="me-2" />Upload Documents</Form.Label>
          <Form.Control type="file" multiple onChange={handleFileChange} />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Submit'}
        </Button>
      </Form>

      {/* Toast for feedback */}
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default StudentDashboard;
