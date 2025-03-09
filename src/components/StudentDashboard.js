import React, { useState, useEffect } from "react";
import {
  Tab,
  Tabs,
  Form,
  Button,
  Table,
  Container,
  Row,
  Col,
  Card,
  Modal,
  Badge
} from "react-bootstrap";
import { getDatabase, ref, push, get, remove, update } from "firebase/database";
import { Toast, ToastContainer } from "react-bootstrap";
import { 
  FaEdit, 
  FaTrash, 
  FaEnvelope, 
  FaUserGraduate, 
  FaUserPlus, 
  FaUsers,
  FaSchool 
} from "react-icons/fa";

const StudentDashboard = (props) => {
  const [key, setKey] = useState("add");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [newMessage, setNewMessage] = useState(""); // State to store the new message
  const [showMessageModal, setShowMessageModal] = useState(false); // For the modal
  const [selectedStudent, setSelectedStudent] = useState(null);
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

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("user={user}",props.user)
    fetchMessages();
  }, []);

  // Add this new function to fetch messages
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
        return studentMessages.reverse(); // Return messages in reverse chronological order
      }
    } catch (error) {
      showToastMessage("Error fetching messages");
    }
    return []; // Return an empty array if there are no messages
  };

  // Generate year options from 1980 to current year
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1979 }, (_, i) =>
    (currentYear - i).toString()
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

  const handleSendMessage = async (studentId) => {
    if (newMessage.trim() === "") return; // Don't send empty messages

    try {
      const db = getDatabase();
      const messagesRef = ref(db, "StudentDropOut/messages");
      await push(messagesRef, {
        studentId: studentId,
        message: newMessage,
        sender: "student", // Assuming the student is sending the message
        timestamp: Date.now(),
      });

      // Update the messages state
      setMessages((prevMessages) => ({
        ...prevMessages,
        [studentId]: [
          ...(prevMessages[studentId] || []),
          {
            id: Date.now().toString(), // Generate a temporary ID
            studentId: studentId,
            message: newMessage,
            sender: "student",
            timestamp: Date.now(),
          },
        ],
      }));

      setNewMessage("");
      showToastMessage("Message sent successfully!");
    } catch (error) {
      showToastMessage("Error sending message");
    }
  };

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
        const messagesPromises = []; // Array to hold promises for fetching messages
  
        snapshot.forEach((childSnapshot) => {
          const student = { id: childSnapshot.key, ...childSnapshot.val() };
          
          // Filter students by who added them
          if (student.addedby === props.user.email) {
            data.push(student);
  
            // Fetch messages for each student
            messagesPromises.push(
              fetchMessages(student.id).then((studentMessages) => ({
                studentId: student.id,
                messages: studentMessages,
              }))
            );
          }
        });
  
        // Wait for all message fetching promises to resolve
        Promise.all(messagesPromises).then((messagesData) => {
          const newMessages = { ...messages };
          messagesData.forEach(({ studentId, messages }) => {
            newMessages[studentId] = messages;
          });
          setMessages(newMessages);
        });
  
        setStudentData(data.reverse()); // Show newest entries first
      } else {
        setStudentData([]);
      }
    } catch (error) {
      showToastMessage("Error fetching student data", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getDatabase();
      if (editingId) {
        // Update existing record
        const studentRef = ref(
          db,
          `StudentDropOut/studentDetails/${editingId}`
        );
        await update(studentRef, {...formData,addedby:props.user.email});
        showToastMessage("Student details updated successfully!");
        setEditingId(null);
      } else {
        // Add new record
        const studentsRef = ref(db, "StudentDropOut/studentDetails");
        await push(studentsRef, {...formData,addedby:props.user.email});
        showToastMessage("Student details added successfully!");
      }

      resetForm();
      fetchStudentData();
      setKey("view"); // Switch to view tab after submission
    } catch (error) {
      showToastMessage("Error saving student details");
    }
  };

  const openMessageModal = (student) => {
    setSelectedStudent(student);
    setShowMessageModal(true);
  };

  const handleEdit = (student) => {
    setFormData({
      phoneNumber: student.phoneNumber || "",
      fullName: student.fullName || "",
      email: student.email || "",
      schoolName: student.schoolName || "",
      course: student.course || "",
      year: student.year || "",
      class: student.class || "",
      address: student.address || "",
      familyMemberCount: student.familyMemberCount || "",
      reasonForDropout: student.reasonForDropout || "",
      fatherOccupation: student.fatherOccupation || "",
    });
    setEditingId(student.id);
    setKey("add"); // Switch to add/edit tab
  };

  const handleDelete = async () => {
    try {
      const db = getDatabase();
      const studentRef = ref(db, `StudentDropOut/studentDetails/${deleteId}`);
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

  return (
    <div className="student-dashboard min-vh-100 py-4" 
         style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)' }}>
      <Container>
        {/* Dashboard Header */}
        <div className="mb-4">
          <h2 className="fw-bold text-primary mb-1">Student Dashboard</h2>
          <p className="text-muted">Manage your academic information and communications</p>
        </div>



        {/* Main Content */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Tabs
              id="student-dashboard-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-4 nav-tabs-custom"
            >
              {/* Add/Edit Student Tab */}
              <Tab 
                eventKey="add" 
                title={
                  <span>
                    <FaUserPlus className="me-2" />
                    {editingId ? "Edit Profile" : "Add Profile"}
                  </span>
                }
              >
                <Form onSubmit={handleSubmit} className="p-2">
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="rounded-pill border-0 shadow-sm"
                          style={{ padding: "0.75rem 1.25rem" }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                          className="rounded-pill border-0 shadow-sm"
                          style={{ padding: "0.75rem 1.25rem" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="rounded-pill border-0 shadow-sm"
                          style={{ padding: "0.75rem 1.25rem" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">School Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="schoolName"
                          value={formData.schoolName}
                          onChange={handleChange}
                          required
                          className="rounded-pill border-0 shadow-sm"
                          style={{ padding: "0.75rem 1.25rem" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Class</Form.Label>
                        <Form.Select
                          name="class"
                          value={formData.class}
                          onChange={handleChange}
                          required
                          className="rounded-pill border-0 shadow-sm"
                          style={{ padding: "0.75rem 1.25rem" }}
                        >
                          <option value="">Select Class</option>
                          {classOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Year</Form.Label>
                        <Form.Select
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          required
                          className="rounded-pill border-0 shadow-sm"
                          style={{ padding: "0.75rem 1.25rem" }}
                        >
                          <option value="">Select Year</option>
                          {yearOptions.map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Family Members</Form.Label>
                        <Form.Control
                          type="number"
                          name="familyMemberCount"
                          value={formData.familyMemberCount}
                          onChange={handleChange}
                          required
                          className="rounded-pill border-0 shadow-sm"
                          style={{ padding: "0.75rem 1.25rem" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Father's Occupation</Form.Label>
                        <Form.Select
                          name="fatherOccupation"
                          value={formData.fatherOccupation}
                          onChange={handleChange}
                          required
                          className="rounded-pill border-0 shadow-sm"
                          style={{ padding: "0.75rem 1.25rem" }}
                        >
                          <option value="">Select Occupation</option>
                          {occupationOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Reason for Dropout</Form.Label>
                        <Form.Select
                          name="reasonForDropout"
                          value={formData.reasonForDropout}
                          onChange={handleChange}
                          required
                          className="rounded-pill border-0 shadow-sm"
                          style={{ padding: "0.75rem 1.25rem" }}
                        >
                          <option value="">Select Reason</option>
                          {reasonOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="border-0 shadow-sm rounded"
                          style={{ padding: "0.75rem 1.25rem" }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 mt-4">
                    <Button
                      variant="primary"
                      type="submit"
                      className="rounded-pill px-4 py-2 flex-grow-1"
                    >
                      {editingId ? "Update Profile" : "Add Profile"}
                    </Button>
                    {editingId && (
                      <Button 
                        variant="outline-secondary"
                        onClick={resetForm}
                        className="rounded-pill px-4 py-2"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </Form>
              </Tab>

              {/* View Details Tab */}
              <Tab 
                eventKey="view" 
                title={
                  <span>
                    <FaUsers className="me-2" />
                    View Details
                  </span>
                }
              >
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th>Student</th>
                        <th>School</th>
                        <th>Class</th>
                        <th>Year</th>
                        <th>Dropout Reason</th>
                        <th>Contact</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div 
                                className="rounded-circle bg-primary bg-opacity-10 p-2 me-2 text-center"
                                style={{ width: '40px', height: '40px' }}
                              >
                                <span className="fw-bold">{student.fullName.charAt(0)}</span>
                              </div>
                              <span>{student.fullName}</span>
                            </div>
                          </td>
                          <td>{student.schoolName}</td>
                          <td>{student.class}</td>
                          <td>{student.year}</td>
                          <td>
                            <Badge bg="warning" text="dark" className="rounded-pill px-3 py-2">
                              {student.reasonForDropout}
                            </Badge>
                          </td>
                          <td>{student.phoneNumber}</td>
                          <td>
                            <Button
                              variant="link"
                              className="text-primary p-0 me-3"
                              onClick={() => handleEdit(student)}
                            >
                              <FaEdit size={18} />
                            </Button>
                            <Button
                              variant="link"
                              className="text-primary p-0 me-3"
                              onClick={() => openMessageModal(student)}
                            >
                              <FaEnvelope size={18} />
                            </Button>
                            <Button
                              variant="link"
                              className="text-danger p-0"
                              onClick={() => {
                                setDeleteId(student.id);
                                setShowDeleteModal(true);
                              }}
                            >
                              <FaTrash size={18} />
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
          size="lg"
          centered
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title>
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
                  <FaEnvelope className="text-primary" />
                </div>
                Messages - {selectedStudent?.fullName}
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4">
            <div className="message-container p-3 bg-light rounded mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {selectedStudent &&
                messages[selectedStudent.id]?.map((message) => (
                  <div
                    key={message.id}
                    className={`message-bubble mb-3 ${message.sender === 'student' ? 'sent' : 'received'}`}
                  >
                    <div className={`p-3 rounded-3 ${
                      message.sender === 'student' 
                        ? 'bg-primary text-white' 
                        : 'bg-white border'
                    }`}>
                      <p className="mb-1">{message.message}</p>
                      <small className={message.sender === 'student' ? 'text-white-50' : 'text-muted'}>
                        {new Date(message.timestamp).toLocaleString()}
                      </small>
                    </div>
                  </div>
                ))}
            </div>
            <div className="message-input">
              <Form.Control
                as="textarea"
                rows={3}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="border-0 shadow-sm mb-2"
              />
              <Button
                variant="primary"
                className="rounded-pill px-4"
                onClick={() => selectedStudent && handleSendMessage(selectedStudent.id)}
              >
                Send Message
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        {/* Delete Modal */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title>
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-danger bg-opacity-10 p-2 me-2">
                  <FaTrash className="text-danger" />
                </div>
                Confirm Deletion
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove your profile from the system? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button 
              variant="outline-secondary" 
              className="rounded-pill"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              className="rounded-pill"
              onClick={handleDelete}
            >
              Delete Profile
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide
            className="border-0 shadow-sm"
          >
            <Toast.Header closeButton={false}>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>

        <style jsx>{`
          .student-dashboard {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
          }
          
          .hover-card {
            transition: transform 0.2s ease;
          }
          
          .hover-card:hover {
            transform: translateY(-5px);
          }
          
          .nav-tabs-custom .nav-link {
            border: none;
            color: #6c757d;
            padding: 1rem 1.5rem;
            font-weight: 500;
            position: relative;
          }
          
          .nav-tabs-custom .nav-link.active {
            color: #0d6efd;
            background: none;
          }
          
          .nav-tabs-custom .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: #0d6efd;
          }
          
          .message-container {
            scrollbar-width: thin;
            scrollbar-color: #dee2e6 #ffffff;
          }
          
          .message-container::-webkit-scrollbar {
            width: 6px;
          }
          
          .message-container::-webkit-scrollbar-track {
            background: #ffffff;
          }
          
          .message-container::-webkit-scrollbar-thumb {
            background-color: #dee2e6;
            border-radius: 3px;
          }
          
          .message-bubble {
            max-width: 80%;
          }
          
          .message-bubble.sent {
            margin-left: auto;
          }
          
          .message-bubble.received {
            margin-right: auto;
          }
          
          .table-responsive {
            scrollbar-width: thin;
            scrollbar-color: #dee2e6 #ffffff;
          }
          
          .table-responsive::-webkit-scrollbar {
            height: 6px;
          }
          
          .table-responsive::-webkit-scrollbar-track {
            background: #ffffff;
          }
          
          .table-responsive::-webkit-scrollbar-thumb {
            background-color: #dee2e6;
            border-radius: 3px;
          }
          
          .form-control:focus,
          .form-select:focus {
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
            border-color: #86b7fe;
          }
          
          @media (max-width: 768px) {
            .nav-tabs-custom .nav-link {
              padding: 0.75rem 1rem;
            }
            
            .message-bubble {
              max-width: 90%;
            }
          }
        `}</style>
      </Container>
    </div>
  );
};

export default StudentDashboard;