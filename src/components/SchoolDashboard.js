import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Form, Button, Table, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { getDatabase, ref, push, get, remove, update, set } from 'firebase/database';
import { Toast, ToastContainer } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEnvelope } from 'react-icons/fa';

const SchoolDashboard = () => {
  const [key, setKey] = useState("add");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState({}); // Store messages by studentId

  const [formData, setFormData] = useState({
    phoneNumber: "",
    fullName: "",
    email: "",
    schoolName: "",
    course: "",
    year: "",
    class: "",
    address: "",
    familyMemberCount: "",
    reasonForDropout: "",
    fatherOccupation: "",
  });

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1979 },
    (_, i) => (currentYear - i).toString()
  );

  const classOptions = Array.from({ length: 8 }, (_, i) => `Class ${i + 3}`);
  const reasonOptions = [
    "Financial Issues",
    "Family Problems",
    "Health Issues",
    "Academic Difficulties",
    "Transportation Problems",
    "Lack of Interest",
    "Marriage",
    "Others",
  ];
  const occupationOptions = [
    "Farmer",
    "Business Owner",
    "Government Employee",
    "Private Sector Employee",
    "Daily Wage Worker",
    "Self-Employed",
    "Unemployed",
    "Others",
  ];

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const db = getDatabase();
      const studentsRef = ref(db, "StudentDropOut/studentDetails");
      const snapshot = await get(studentsRef);

      if (snapshot.exists()) {
        const data = [];
        const messagesPromises = [];

        snapshot.forEach((childSnapshot) => {
          const student = { id: childSnapshot.key, ...childSnapshot.val() };
          data.push(student);

          messagesPromises.push(
            fetchMessages(student.id).then((studentMessages) => ({
              studentId: student.id,
              messages: studentMessages,
            }))
          );
        });

        Promise.all(messagesPromises).then((messagesData) => {
          const newMessages = { ...messages };
          messagesData.forEach(({ studentId, messages }) => {
            newMessages[studentId] = messages;
          });
          setMessages(newMessages);
        });

        setStudentData(data.reverse());
      } else {
        setStudentData([]);
      }
    } catch (error) {
      showToastMessage("Error fetching student data");
    }
  };

  const fetchMessages = async (studentId) => {
    try {
      const db = getDatabase();
      const messagesRef = ref(db, `StudentDropOut/messages`);
      const snapshot = await get(messagesRef);

      if (snapshot.exists()) {
        const studentMessages = [];
        snapshot.forEach((childSnapshot) => {
          const message = childSnapshot.val();
          if (message.studentId === studentId) {
            studentMessages.push({ id: childSnapshot.key, ...message });
          }
        });
        return studentMessages.reverse();
      }
    } catch (error) {
      showToastMessage("Error fetching messages");
    }
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getDatabase();
      if (editingId) {
        const studentRef = ref(
          db,
          `StudentDropOut/studentDetails/${editingId}`
        );
        await update(studentRef, formData);
        showToastMessage("Student details updated successfully!");
        setEditingId(null);
      } else {
        const studentsRef = ref(db, "StudentDropOut/studentDetails");
        await push(studentsRef, formData);
        showToastMessage("Student details added successfully!");
      }

      resetForm();
      fetchStudentData();
      setKey("view");
    } catch (error) {
      showToastMessage("Error saving student details");
    }
  };

  const handleMessageSubmit = async (studentId) => {
    if (messageText.trim() === "") return;

    try {
      const db = getDatabase();
      const messagesRef = ref(db, "StudentDropOut/messages");
      await push(messagesRef, {
        studentId: studentId,
        studentName: selectedStudent.fullName,
        message: messageText,
        timestamp: Date.now(), // Use Date.now() for consistency
        sender: "school",
        read: false,
      });

      // Update messages state
      setMessages((prevMessages) => ({
        ...prevMessages,
        [studentId]: [
          ...(prevMessages[studentId] || []),
          {
            id: Date.now().toString(), 
            studentId: studentId,
            studentName: selectedStudent.fullName,
            message: messageText,
            timestamp: Date.now(), 
            sender: "school",
            read: false,
          },
        ],
      }));

      showToastMessage("Message sent successfully!");
      setMessageText("");
    } catch (error) {
      showToastMessage("Error sending message");
    }
  };

  const handleDelete = async () => {
    try {
      const db = getDatabase();
      const studentRef = ref(
        db,
        `StudentDropOut/studentDetails/${deleteId}`
      );
      await remove(studentRef);
      showToastMessage("Student details deleted successfully!");
      fetchStudentData();
      setShowDeleteModal(false);
    } catch (error) {
      showToastMessage("Error deleting student details");
    }
  };

  const resetForm = () => {
    setFormData({
      phoneNumber: "",
      fullName: "",
      email: "",
      schoolName: "",
      course: "",
      year: "",
      class: "",
      address: "",
      familyMemberCount: "",
      reasonForDropout: "",
      fatherOccupation: "",
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const openMessageModal = (student) => {
    setSelectedStudent(student);
    setShowMessageModal(true);
  };

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Body>
          <Tabs
            id="school-dashboard-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-4"
          >

 <Tab
              eventKey="add"
              title={editingId ? "Edit Student Details" : "Add Student Details"}
            >
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>School Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Class</Form.Label>
                      <Form.Select
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Class</option>
                        {classOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Year</Form.Label>
                      <Form.Select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Year</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {/* ... (other form fields remain the same) ... */}
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Family Member Count</Form.Label>
                      <Form.Control
                        type="number"
                        name="familyMemberCount"
                        value={formData.familyMemberCount}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Father's Occupation</Form.Label>
                      <Form.Select
                        name="fatherOccupation"
                        value={formData.fatherOccupation}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Occupation</option>
                        {occupationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Reason for Dropout</Form.Label>
                      <Form.Select
                        name="reasonForDropout"
                        value={formData.reasonForDropout}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Reason</option>
                        {reasonOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    className="flex-grow-1"
                  >
                    {editingId ? "Update" : "Submit"}
                  </Button>
                  {editingId && (
                    <Button variant="secondary" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </Form>
            </Tab>

            <Tab eventKey="view" title="View Students">
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Year</th>
                    <th>Reason for Dropout</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.map((student) => (
                    <tr key={student.id}>
                      <td>{student.fullName}</td>
                      <td>{student.class}</td>
                      <td>{student.year}</td>
                      <td>{student.reasonForDropout}</td>
                      <td>{student.phoneNumber}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => openMessageModal(student)}
                        >
                          <FaEnvelope /> Message
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setDeleteId(student.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash /> Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab>


           
            
          </Tabs>
        </Card.Body>
      </Card>

      {/* Message Modal */}
      <Modal
      show={showMessageModal}
      onHide={() => setShowMessageModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Messages - {selectedStudent?.fullName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="message-list">
          {selectedStudent &&
            messages[selectedStudent.id]?.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.sender === "school" ? "sent" : "received"
                }`}
              >
                <span>{message.message}</span>
                <br />
                <small className="text-muted">
                  {new Date(message.timestamp).toLocaleString()}
                </small>
              </div>
            ))}
        </div>
        <div className="input-group mt-3">
          <Form.Control
            as="textarea"
            rows={2}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
          />
          <Button
            variant="primary"
            onClick={() =>
              handleMessageSubmit(selectedStudent.id)
            }
          >
            Send
          </Button>
        </div>
      </Modal.Body>
    </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Remove</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this student from your dashboard?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>

    <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default SchoolDashboard;