import React, { useState, useEffect } from 'react';
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
} from 'react-bootstrap';
import { getDatabase, ref, get, remove, update,push } from 'firebase/database';
import { Toast, ToastContainer } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
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
    const yearWiseDropouts = {};
    const classWiseDropouts = {};
    const reasonForDropoutCounts = {};
    const fatherOccupationCounts = {};

    studentData.forEach((student) => {
      // Year-wise dropouts
      if (yearWiseDropouts[student.year]) {
        yearWiseDropouts[student.year]++;
      } else {
        yearWiseDropouts[student.year] = 1;
      }

      // Class-wise dropouts
      if (classWiseDropouts[student.class]) {
        classWiseDropouts[student.class]++;
      } else {
        classWiseDropouts[student.class] = 1;
      }

      // Reason for dropout counts
      if (reasonForDropoutCounts[student.reasonForDropout]) {
        reasonForDropoutCounts[student.reasonForDropout]++;
      } else {
        reasonForDropoutCounts[student.reasonForDropout] = 1;
      }

      // Father's occupation counts
      if (fatherOccupationCounts[student.fatherOccupation]) {
        fatherOccupationCounts[student.fatherOccupation]++;
      } else {
        fatherOccupationCounts[student.fatherOccupation] = 1;
      }
    });

    const newChartData = [
      {
        category: 'Year',
        ...yearWiseDropouts,
      },
      {
        category: 'Class',
        ...classWiseDropouts,
      },
    ];

    // Add data for reasonForDropout and fatherOccupation to chartData
    newChartData.push({
      category: 'Reason for Dropout',
      ...reasonForDropoutCounts,
    });

    newChartData.push({
      category: 'Father Occupation',
      ...fatherOccupationCounts,
    });

    setChartData(newChartData);
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
    <Container>
      <Card className="shadow-sm">
        <Card.Body>
          <Tabs
            id="admin-dashboard-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-4"
          >
            <Tab eventKey="students" title="Students">
              <h4 className="mb-4">Manage Students</h4>
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
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              setDeleteStudentId(student.id);
                              setShowDeleteStudentModal(true);
                            }}
                          >
                            <FaTrash /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Add/Edit Student Modal */}
              <Modal
                show={!!editingStudentId}
                onHide={() => setEditingStudentId(null)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    {editingStudentId
                      ? 'Edit Student Details'
                      : 'Add Student Details'}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {/* ... (Your Add/Edit Student Form remains the same) ... */}
                </Modal.Body>
              </Modal>

              {/* Delete Student Confirmation Modal */}
              <Modal
                show={showDeleteStudentModal}
                onHide={() => setShowDeleteStudentModal(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Are you sure you want to delete this student record? This
                  action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteStudentModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleDeleteStudent}>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
            </Tab>

            {/* Users Tab */}
            <Tab eventKey="users" title="Users">
              <h4 className="mb-4">Manage Users</h4>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Phone Number</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>User Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData.map((user) => (
                      <tr key={user.id}>
                        <td>{user.phoneNumber}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.userType}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              setDeleteUser(user);
                              setShowDeleteUserModal(true);
                            }}
                          >
                            <FaTrash /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Delete User Confirmation Modal */}
              <Modal
                show={showDeleteUserModal}
                onHide={() => setShowDeleteUserModal(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Are you sure you want to delete this user? This action
                  cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteUserModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleDeleteUser}>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
            </Tab>

            <Tab eventKey="analytics" title="Analytics">
              <h4 className="mb-4">Student Dropout Analysis</h4>

              <Button
                variant="primary"
                onClick={handleGenerateCharts}
                className="mb-4"
              >
                Generate Charts
              </Button>

              <Row>
                {chartData.map((data, index) => (
                  <Col md={6} key={index}>
                    <Card className="mb-4">
                      <Card.Body>
                        <h5 className="text-center">
                          {data.category}
                        </h5>
                        {data.category === 'Year' ||
                        data.category === 'Class' ? (
                          <BarChart width={400} height={300} data={[{ ...data }]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {yearOptions.map((year) => (
                            <Bar key={year} dataKey={year} fill={getChartColors(year)} />
                          ))}
                        </BarChart>
                        
                        ) : (
                          <PieChart width={400} height={400}>
                            <Pie
                              data={Object.entries(data)
                                .filter(
                                  ([key]) => key !== 'category'
                                )
                                .map(([name, value]) => ({
                                  name,
                                  value,
                                }))}
                              cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            >
                              {data.category !== 'Year' &&
                                data.category !== 'Class' &&
                                Object.entries(data)
                                  .filter(([key]) => key !== 'category')
                                  .map(([name, value], index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={getChartColors(index)}
                                    />
                                  ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

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

export default AdminDashboard;
