import React, { useState, useEffect } from 'react';
import {
  Tab, Tabs, Form, Button, Table, Container, Row, Col, Card, Modal,
  Toast, ToastContainer, Badge
} from 'react-bootstrap';
import { getDatabase, ref, get, remove, update, push } from 'firebase/database';
import { 
  FaEdit, FaTrash, FaChartLine, FaUsers, FaGraduationCap, 
  FaSearch, FaDownload, FaSync, FaFilter 
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const [key, setKey] = useState('students'); // Default tab
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Students Data
  const [studentData, setStudentData] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [showDeleteStudentModal, setShowDeleteStudentModal] =
    useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    fullName: '',
    email: '',
    schoolName: '',
    course: '',
    year: '',
    class: '',
    address: '',
    familyMemberCount: '',
    reasonForDropout: '',
    fatherOccupation: '',
  });

  // Users Data
  const [usersData, setUsersData] = useState([]);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);

  // Chart Data
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStudentData();
    fetchUsersData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const db = getDatabase();
      const studentsRef = ref(db, 'StudentDropOut/studentDetails');
      const snapshot = await get(studentsRef);
      if (snapshot.exists()) {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          data.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setStudentData(data.reverse());
      } else {
        setStudentData([]);
      }
    } catch (error) {
      showToastMessage('Error fetching student data');
    }
  };

  const fetchUsersData = async () => {
    try {
      const db = getDatabase();
      const usersRef = ref(db, 'StudentDropOut/users');
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          data.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setUsersData(data);
      } else {
        setUsersData([]);
      }
    } catch (error) {
      showToastMessage('Error fetching users data');
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1979 }, (_, i) =>
    (currentYear - i).toString()
  );

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getDatabase();
      if (editingStudentId) {
        const studentRef = ref(
          db,
          `StudentDropOut/studentDetails/${editingStudentId}`
        );
        await update(studentRef, formData);
        showToastMessage('Student details updated successfully!');
        setEditingStudentId(null);
      } else {
        const studentsRef = ref(db, 'StudentDropOut/studentDetails');
        await push(studentsRef, formData);
        showToastMessage('Student details added successfully!');
      }
      resetForm();
      fetchStudentData();
    } catch (error) {
      showToastMessage('Error saving student details');
    }
  };

  const handleStudentEdit = (student) => {
    setFormData({
      phoneNumber: student.phoneNumber,
      fullName: student.fullName,
      email: student.email,
      schoolName: student.schoolName,
      course: student.course,
      year: student.year,
      class: student.class,
      address: student.address,
      familyMemberCount: student.familyMemberCount,
      reasonForDropout: student.reasonForDropout,
      fatherOccupation: student.fatherOccupation,
    });
    setEditingStudentId(student.id);
  };

  const handleDeleteStudent = async () => {
    try {
      const db = getDatabase();
      const studentRef = ref(
        db,
        `StudentDropOut/studentDetails/${deleteStudentId}`
      );
      await remove(studentRef);
      showToastMessage('Student details deleted successfully!');
      fetchStudentData();
      setShowDeleteStudentModal(false);
    } catch (error) {
      showToastMessage('Error deleting student details');
    }
  };

  const handleDeleteUser = async () => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `StudentDropOut/users/${deleteUser.id}`);
      await remove(userRef);
      showToastMessage('User deleted successfully!');
      fetchUsersData();
      setShowDeleteUserModal(false);
    } catch (error) {
      showToastMessage('Error deleting user');
    }
  };
  const handleGenerateCharts = () => {
    // Process data for various charts
    const analyses = {
      yearWise: {},
      classWise: {},
      reasonWise: {},
      occupationWise: {},
      schoolWise: {},
      familySizeWise: {
        '1-3': 0,
        '4-6': 0,
        '7+': 0
      }
    };
  
    studentData.forEach((student) => {
      // Year-wise analysis
      analyses.yearWise[student.year] = (analyses.yearWise[student.year] || 0) + 1;
      
      // Class-wise analysis
      analyses.classWise[student.class] = (analyses.classWise[student.class] || 0) + 1;
      
      // Dropout reason analysis
      analyses.reasonWise[student.reasonForDropout] = 
        (analyses.reasonWise[student.reasonForDropout] || 0) + 1;
      
      // Father's occupation analysis
      analyses.occupationWise[student.fatherOccupation] = 
        (analyses.occupationWise[student.fatherOccupation] || 0) + 1;
      
      // School-wise analysis
      analyses.schoolWise[student.schoolName] = 
        (analyses.schoolWise[student.schoolName] || 0) + 1;
      
      // Family size grouping
      const familySize = parseInt(student.familyMemberCount);
      if (familySize <= 3) analyses.familySizeWise['1-3']++;
      else if (familySize <= 6) analyses.familySizeWise['4-6']++;
      else analyses.familySizeWise['7+']++;
    });
  
    // Convert data for charts
    const chartData = {
      yearData: Object.entries(analyses.yearWise).map(([name, value]) => ({ name, value })),
      classData: Object.entries(analyses.classWise).map(([name, value]) => ({ name, value })),
      reasonData: Object.entries(analyses.reasonWise).map(([name, value]) => ({ name, value })),
      occupationData: Object.entries(analyses.occupationWise).map(([name, value]) => ({ name, value })),
      familySizeData: Object.entries(analyses.familySizeWise).map(([name, value]) => ({ name, value })),
      schoolData: Object.entries(analyses.schoolWise)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }))
    };
  
    setChartData(chartData);
  };
  

  const resetForm = () => {
    setFormData({
      phoneNumber: '',
      fullName: '',
      email: '',
      schoolName: '',
      course: '',
      year: '',
      class: '',
      address: '',
      familyMemberCount: '',
      reasonForDropout: '',
      fatherOccupation: '',
    });
    setEditingStudentId(null);
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

  // Chart data and functions for analysis
  

  // Function to get chart colors
  const getChartColors = (index) => {
    const colors = [
      '#8884d8',
      '#82ca9d',
      '#ffc658',
      '#FF8042',
      '#99B898',
      '#FECEA8',
      '#FF6F61',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="admin-dashboard min-vh-100 py-4" 
         style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)' }}>
      <Container fluid className="px-4">
        {/* Dashboard Header */}
        <div className="mb-4">
          <h2 className="fw-bold text-primary mb-1">Admin Dashboard</h2>
          <p className="text-muted">Manage students, users, and analyze dropout patterns</p>
        </div>

        {/* Quick Stats Cards */}
        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="border-0 shadow-sm hover-card">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <FaUsers className="text-primary" size={24} />
                </div>
                <div>
                  <h6 className="mb-1">Total Students</h6>
                  <h3 className="mb-0 fw-bold">{studentData.length}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm hover-card">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                  <FaGraduationCap className="text-success" size={24} />
                </div>
                <div>
                  <h6 className="mb-1">Total Users</h6>
                  <h3 className="mb-0 fw-bold">{usersData.length}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          {/* Add more stat cards as needed */}
        </Row>

        {/* Main Content */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Tabs
              id="admin-dashboard-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-4 nav-tabs-custom"
            >
              {/* Students Tab */}
              <Tab eventKey="students" title={
                <span><FaUsers className="me-2" />Students</span>
              }>
                <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div className="d-flex gap-2 flex-grow-1 me-2">
                    <Form.Control
                      type="search"
                      placeholder="Search students..."
                      className="w-auto flex-grow-1"
                      style={{ maxWidth: '300px' }}
                    />
                    <Button variant="outline-primary">
                      <FaSearch className="me-2" />Search
                    </Button>
                  </div>
                  
                </div>

                <div className="table-responsive">
                  <Table className="table-hover border-bottom">
                    <thead className="bg-light">
                      <tr>
                        <th className="py-3">Name</th>
                        <th className="py-3">Class</th>
                        <th className="py-3">Year</th>
                        <th className="py-3">Reason for Dropout</th>
                        <th className="py-3">Contact</th>
                        <th className="py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData.map((student) => (
                        <tr key={student.id}>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
                                {student.fullName.charAt(0).toUpperCase()}
                              </div>
                              {student.fullName}
                            </div>
                          </td>
                          <td className="py-3">{student.class}</td>
                          <td className="py-3">{student.year}</td>
                          <td className="py-3">
                            <Badge bg="warning" text="dark">
                              {student.reasonForDropout}
                            </Badge>
                          </td>
                          <td className="py-3">{student.phoneNumber}</td>
                          <td className="py-3">
                            <Button
                              variant="link"
                              className="text-danger p-0 me-3"
                              onClick={() => {
                                setDeleteStudentId(student.id);
                                setShowDeleteStudentModal(true);
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              {/* Users Tab */}
              <Tab eventKey="users" title={
                <span><FaUsers className="me-2" />Users</span>
              }>
                <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div className="d-flex gap-2 flex-grow-1 me-2">
                    <Form.Control
                      type="search"
                      placeholder="Search users..."
                      className="w-auto flex-grow-1"
                      style={{ maxWidth: '300px' }}
                    />
                    <Button variant="outline-primary">
                      <FaSearch className="me-2" />Search
                    </Button>
                  </div>
                  <Button variant="outline-success">
                    <FaDownload className="me-2" />Export Users
                  </Button>
                </div>

                <div className="table-responsive">
                  <Table className="table-hover border-bottom">
                    <thead className="bg-light">
                      <tr>
                        <th className="py-3">User</th>
                        <th className="py-3">Email</th>
                        <th className="py-3">Type</th>
                        <th className="py-3">Contact</th>
                        <th className="py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.map((user) => (
                        <tr key={user.id}>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              {user.name}
                            </div>
                          </td>
                          <td className="py-3">{user.email}</td>
                          <td className="py-3">
                            <Badge bg={user.userType === 'Admin' ? 'primary' : 'info'}>
                              {user.userType}
                            </Badge>
                          </td>
                          <td className="py-3">{user.phoneNumber}</td>
                          <td className="py-3">
                            <Button
                              variant="link"
                              className="text-danger p-0"
                              onClick={() => {
                                setDeleteUser(user);
                                setShowDeleteUserModal(true);
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              {/* Analytics Tab */}
              <Tab eventKey="analytics" title={
                <span><FaChartLine className="me-2" />Analytics</span>
              }>
                <div className="mb-4 d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Dropout Analysis</h4>
                  <Button variant="primary" onClick={handleGenerateCharts}>
                    <FaChartLine className="me-2" />Generate Charts
                  </Button>
                </div>
              
                <Row className="g-4">
                  {/* Year-wise Dropouts */}
                  <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body>
                        <h5 className="mb-4">Year-wise Dropouts</h5>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={chartData.yearData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" name="Students" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>
              
                  {/* Reasons for Dropout */}
                  <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body>
                        <h5 className="mb-4">Reasons for Dropout</h5>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={chartData.reasonData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              label
                            >
                              {chartData.reasonData?.map((entry, index) => (
                                <Cell key={index} fill={getChartColors(index)} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>
              
                  {/* Class-wise Distribution */}
                  <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body>
                        <h5 className="mb-4">Class-wise Distribution</h5>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={chartData.classData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#82ca9d" name="Students" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>
              
                  {/* Father's Occupation */}
                  <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body>
                        <h5 className="mb-4">Father's Occupation Distribution</h5>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={chartData.occupationData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              label
                            >
                              {chartData.occupationData?.map((entry, index) => (
                                <Cell key={index} fill={getChartColors(index)} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>
              
                  {/* Family Size Distribution */}
                  <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body>
                        <h5 className="mb-4">Family Size Distribution</h5>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={chartData.familySizeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#ffc658" name="Students" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>
              
                  {/* Top 5 Schools */}
                  <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body>
                        <h5 className="mb-4">Top 5 Schools with Dropouts</h5>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={chartData.schoolData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#FF8042" name="Students" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>

      {/* Modals */}
      <Modal
        show={showDeleteStudentModal}
        onHide={() => setShowDeleteStudentModal(false)}
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this student record? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowDeleteStudentModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteStudent}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteUserModal}
        onHide={() => setShowDeleteUserModal(false)}
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowDeleteUserModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete
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
          <Toast.Header closeButton={false} className="border-0">
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <style jsx>{`
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
        .table-hover tbody tr:hover {
          background-color: rgba(13, 110, 253, 0.05);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;