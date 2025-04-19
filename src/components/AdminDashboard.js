import React, { useState, useEffect } from 'react';
import {
  Tab, Tabs, Form, Button, Table, Container, Row, Col, Card, Modal,
  Toast, ToastContainer, Badge, ProgressBar, Dropdown
} from 'react-bootstrap';
import { getDatabase, ref, get, remove, update, push } from 'firebase/database';
import { 
  FaEdit, FaTrash, FaChartLine, FaUsers, FaGraduationCap, 
  FaSearch, FaDownload, FaSync, FaFilter, FaMapMarkerAlt,
  FaCalendarAlt, FaUserFriends, FaInfoCircle, FaSchool
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  ScatterChart, Scatter, ZAxis, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area,
  ComposedChart, Treemap
} from 'recharts';

const AdminDashboard = (props) => {
  const [key, setKey] = useState('students'); // Default tab
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');


  // Function to add dummy student data
const addDummyStudentData = async () => {


  const userEmail = props.user?.email || 'system@example.com';
    // Define dummy student records
  const dummyStudents = [
    {
      fullName: 'John Smith',
      phoneNumber: '9876543210',
      email: 'john.smith@example.com',
      schoolName: 'Central High School',
      course: 'Science',
      year: '2023',
      class: '10th',
      address: '123 Main St, Central City',
      familyMemberCount: '4',
      reasonForDropout: 'Financial difficulties',
      fatherOccupation: 'Factory worker',
      gender: 'Male',
      addedDate: '2023-07-15',
      district: 'Central'
    }
  ];

  try {
    const db = getDatabase();
    const studentsRef = ref(db, 'StudentDropOut/studentDetails');
    
    // Display loading toast
    showToastMessage('Adding dummy student data...', 'info');
    
    // Add each student record to Firebase
    const promises = dummyStudents.map(student => {
      // Add the addedBy field to each student record
      const studentWithAddedBy = {
        ...student,
        addedBy: userEmail
      };
      return push(studentsRef, studentWithAddedBy);
    });
    
    // Wait for all records to be added
    await Promise.all(promises);
    
    
    // Show success message
    showToastMessage(`Successfully added ${dummyStudents.length} dummy student records`, 'success');
    
    // Refresh the student data
    fetchStudentData();
  } catch (error) {
    console.error("Error adding dummy data:", error);
    showToastMessage('Error adding dummy student data', 'error');
  }
};

  // Students Data
  const [studentData, setStudentData] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false);
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
    gender: '', // Added gender field
    addedDate: '', // For trend analysis
    district: '', // For geographical analysis
  });

  // Users Data
  const [usersData, setUsersData] = useState([]);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);

  // Chart Data
  const [chartData, setChartData] = useState({});
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('yearly');
  const [selectedChartType, setSelectedChartType] = useState('all');

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
          const student = { id: childSnapshot.key, ...childSnapshot.val() };
          // Add default addedDate if it doesn't exist (for existing data)
          if (!student.addedDate) {
            student.addedDate = new Date().toISOString().split('T')[0];
          }
          // Add default gender if it doesn't exist
          if (!student.gender) {
            student.gender = 'Not Specified';
          }
          data.push(student);
        });
        setStudentData(data.reverse());
      } else {
        setStudentData([]);
      }
    } catch (error) {
      showToastMessage('Error fetching student data', 'error');
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
      showToastMessage('Error fetching users data', 'error');
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
      // Add current date if not provided
      const submissionData = {
        ...formData,
        addedDate: formData.addedDate || new Date().toISOString().split('T')[0]
      };
      
      if (editingStudentId) {
        const studentRef = ref(
          db,
          `StudentDropOut/studentDetails/${editingStudentId}`
        );
        await update(studentRef, submissionData);
        showToastMessage('Student details updated successfully!', 'success');
        setEditingStudentId(null);
      } else {
        const studentsRef = ref(db, 'StudentDropOut/studentDetails');
        await push(studentsRef, submissionData);
        showToastMessage('Student details added successfully!', 'success');
      }
      resetForm();
      fetchStudentData();
    } catch (error) {
      showToastMessage('Error saving student details', 'error');
    }
  };

  const handleStudentEdit = (student) => {
    setFormData({
      phoneNumber: student.phoneNumber || '',
      fullName: student.fullName || '',
      email: student.email || '',
      schoolName: student.schoolName || '',
      course: student.course || '',
      year: student.year || '',
      class: student.class || '',
      address: student.address || '',
      familyMemberCount: student.familyMemberCount || '',
      reasonForDropout: student.reasonForDropout || '',
      fatherOccupation: student.fatherOccupation || '',
      gender: student.gender || 'Not Specified',
      addedDate: student.addedDate || '',
      district: student.district || '',
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
      showToastMessage('Student details deleted successfully!', 'success');
      fetchStudentData();
      setShowDeleteStudentModal(false);
    } catch (error) {
      showToastMessage('Error deleting student details', 'error');
    }
  };

  const handleDeleteUser = async () => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `StudentDropOut/users/${deleteUser.id}`);
      await remove(userRef);
      showToastMessage('User deleted successfully!', 'success');
      fetchUsersData();
      setShowDeleteUserModal(false);
    } catch (error) {
      showToastMessage('Error deleting user', 'error');
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
      },
      genderWise: {},
      districtWise: {},
      reasonByClass: {},
      reasonByFamilySize: {},
      monthlyTrend: {},
      quarterlyTrend: {},
      yearlyTrend: {},
      genderByReason: {}
    };
  
    studentData.forEach((student) => {
      // Basic analyses
      analyses.yearWise[student.year] = (analyses.yearWise[student.year] || 0) + 1;
      analyses.classWise[student.class] = (analyses.classWise[student.class] || 0) + 1;
      analyses.reasonWise[student.reasonForDropout] = (analyses.reasonWise[student.reasonForDropout] || 0) + 1;
      analyses.occupationWise[student.fatherOccupation] = (analyses.occupationWise[student.fatherOccupation] || 0) + 1;
      analyses.schoolWise[student.schoolName] = (analyses.schoolWise[student.schoolName] || 0) + 1;
      
      // Gender analysis
      analyses.genderWise[student.gender || 'Not Specified'] = 
        (analyses.genderWise[student.gender || 'Not Specified'] || 0) + 1;
      
      // District analysis
      if (student.district) {
        analyses.districtWise[student.district] = 
          (analyses.districtWise[student.district] || 0) + 1;
      }
      
      // Family size grouping
      const familySize = parseInt(student.familyMemberCount);
      let familySizeGroup = 'Not Specified';
      if (!isNaN(familySize)) {
        if (familySize <= 3) familySizeGroup = '1-3';
        else if (familySize <= 6) familySizeGroup = '4-6';
        else familySizeGroup = '7+';
        
        analyses.familySizeWise[familySizeGroup]++;
      }
      
      // Combined analyses
      // Class and Reason
      const classReason = `${student.class}-${student.reasonForDropout}`;
      analyses.reasonByClass[classReason] = (analyses.reasonByClass[classReason] || 0) + 1;
      
      // Family Size and Reason
      const sizeReason = `${familySizeGroup}-${student.reasonForDropout}`;
      analyses.reasonByFamilySize[sizeReason] = (analyses.reasonByFamilySize[sizeReason] || 0) + 1;
      
      // Gender and Reason
      const genderReason = `${student.gender || 'Not Specified'}-${student.reasonForDropout}`;
      analyses.genderByReason[genderReason] = (analyses.genderByReason[genderReason] || 0) + 1;
      
      // Time-based analyses
      if (student.addedDate) {
        const date = new Date(student.addedDate);
        if (!isNaN(date.getTime())) {
          // Monthly trend
          const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          analyses.monthlyTrend[monthYear] = (analyses.monthlyTrend[monthYear] || 0) + 1;
          
          // Quarterly trend
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          const quarterYear = `${date.getFullYear()}-Q${quarter}`;
          analyses.quarterlyTrend[quarterYear] = (analyses.quarterlyTrend[quarterYear] || 0) + 1;
          
          // Yearly trend
          const year = date.getFullYear().toString();
          analyses.yearlyTrend[year] = (analyses.yearlyTrend[year] || 0) + 1;
        }
      }
    });
    
    // Prepare correlation data for scatter plots
    const reasonFamilySizeCorrelation = [];
    Object.keys(analyses.reasonByFamilySize).forEach(key => {
      const [familySize, reason] = key.split('-');
      reasonFamilySizeCorrelation.push({
        familySize,
        reason,
        count: analyses.reasonByFamilySize[key]
      });
    });
    
    // Class by Reason Matrix
    const classReasonMatrix = [];
    const uniqueClasses = Object.keys(analyses.classWise);
    const uniqueReasons = Object.keys(analyses.reasonWise);
    
    uniqueClasses.forEach(classValue => {
      const entry = { class: classValue };
      uniqueReasons.forEach(reason => {
        const key = `${classValue}-${reason}`;
        entry[reason] = analyses.reasonByClass[key] || 0;
      });
      classReasonMatrix.push(entry);
    });
    
    // Time trend data
    const sortTimeData = (data) => {
      return Object.entries(data)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => a.name.localeCompare(b.name));
    };
    
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
        .map(([name, value]) => ({ name, value })),
      genderData: Object.entries(analyses.genderWise).map(([name, value]) => ({ name, value })),
      districtData: Object.entries(analyses.districtWise)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, value]) => ({ name, value })),
      classReasonMatrix,
      reasonFamilySizeCorrelation,
      monthlyTrendData: sortTimeData(analyses.monthlyTrend),
      quarterlyTrendData: sortTimeData(analyses.quarterlyTrend),
      yearlyTrendData: sortTimeData(analyses.yearlyTrend),
      // Prepare data for the radar chart comparing gender and reasons
      radarData: uniqueReasons.map(reason => {
        const dataPoint = { reason };
        Object.keys(analyses.genderWise).forEach(gender => {
          dataPoint[gender] = analyses.genderByReason[`${gender}-${reason}`] || 0;
        });
        return dataPoint;
      })
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
      gender: '',
      addedDate: '',
      district: '',
    });
    setEditingStudentId(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Function to get chart colors
  const getChartColors = (index) => {
    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#99B898',
      '#FECEA8', '#FF6F61', '#6A65D8', '#5AA7A7', '#FFB400',
      '#F87171', '#60A5FA', '#34D399', '#A78BFA', '#F472B6'
    ];
    return colors[index % colors.length];
  };

  const getTrendData = () => {
    switch(selectedTimeFrame) {
      case 'monthly':
        return chartData.monthlyTrendData || [];
      case 'quarterly':
        return chartData.quarterlyTrendData || [];
      case 'yearly':
      default:
        return chartData.yearlyTrendData || [];
    }
  };

  const filterChartsByType = () => {
    if (selectedChartType === 'all') return true;
    return chartType => chartType === selectedChartType;
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
          
          <Col md={3}>
            <Card className="border-0 shadow-sm hover-card">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                  <FaSchool className="text-warning" size={24} />
                </div>
                <div>
                  <h6 className="mb-1">Unique Schools</h6>
                  <h3 className="mb-0 fw-bold">
                    {new Set(studentData.map(s => s.schoolName)).size}
                  </h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="border-0 shadow-sm hover-card">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                  <FaInfoCircle className="text-info" size={24} />
                </div>
                <div>
                  <h6 className="mb-1">Dropout Reasons</h6>
                  <h3 className="mb-0 fw-bold">
                    {new Set(studentData.map(s => s.reasonForDropout)).size}
                  </h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
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
                  
                  <Button variant="primary" onClick={() => {
                    resetForm();
                    setKey('add');
                  }}>
                    Add Student
                  </Button>
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
                              className="text-primary p-0 me-3"
                              onClick={() => {
                                handleStudentEdit(student);
                                setKey('add');
                              }}
                            >
                              <FaEdit />
                            </Button>
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

              {/* Add/Edit Student Tab */}
              <Tab eventKey="add" title={
                <span><FaEdit className="me-2" />{editingStudentId ? 'Edit Student' : 'Add Student'}</span>
              }>
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">{editingStudentId ? 'Edit Student Details' : 'Add New Student'}</h5>
                    <Form onSubmit={handleStudentSubmit}>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
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
                          <Form.Group>
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="text"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                              <option value="Not Specified">Not Specified</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
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
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>District</Form.Label>
                            <Form.Control
                              type="text"
                              name="district"
                              value={formData.district}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Course</Form.Label>
                            <Form.Control
                              type="text"
                              name="course"
                              value={formData.course}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
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
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Class</Form.Label>
                            <Form.Control
                              type="text"
                              name="class"
                              value={formData.class}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Family Member Count</Form.Label>
                            <Form.Control
                              type="number"
                              name="familyMemberCount"
                              value={formData.familyMemberCount}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Father's Occupation</Form.Label>
                            <Form.Control
                              type="text"
                              name="fatherOccupation"
                              value={formData.fatherOccupation}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Added Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="addedDate"
                              value={formData.addedDate}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label>Reason for Dropout</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="reasonForDropout"
                              value={formData.reasonForDropout}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={12} className="mt-4">
                          <div className="d-flex gap-2">
                            <Button variant="primary" type="submit">
                              {editingStudentId ? 'Update Student' : 'Add Student'}
                            </Button>
                            <Button variant="outline-secondary" onClick={resetForm}>
                              Reset Form
                            </Button>
                            
                            <Button 
                            variant="outline-primary" 
                            type="button" 
                            onClick={addDummyStudentData}
                          >
                            <FaUsers className="me-2" />Add Dummy Data
                          </Button>
                          
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
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
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              {user.name || 'Unknown'}
                            </div>
                          </td>
                          <td className="py-3">{user.email}</td>
                          <td className="py-3">
                            <Badge bg={user.userType === 'Admin' ? 'primary' : 'info'}>
                              {user.userType || 'User'}
                            </Badge>
                          </td>
                          <td className="py-3">{user.phoneNumber || 'N/A'}</td>
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
                <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <h4 className="mb-0">Dropout Analysis</h4>
                  <div className="d-flex gap-2">
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-primary" id="chart-type-dropdown">
                        <FaFilter className="me-2" />Chart Type
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setSelectedChartType('all')}>All Charts</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedChartType('basic')}>Basic Demographics</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedChartType('trends')}>Trends Over Time</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedChartType('correlations')}>Correlations</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Button variant="primary" onClick={handleGenerateCharts}>
                      <FaChartLine className="me-2" />Generate Charts
                    </Button>
                  </div>
                </div>
              
                <Row className="g-4">
                  {/* Basic Demographics Section */}
                  {(selectedChartType === 'all' || selectedChartType === 'basic') && (
                    <>
                      {/* Year-wise Dropouts */}
                      <Col lg={6}>
                        <Card className="border-0 shadow-sm h-100">
                          <Card.Body>
                            <h5 className="mb-4">Year-wise Dropouts</h5>
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={chartData.yearData || []}>
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
                                  data={chartData.reasonData || []}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={100}
                                  label
                                >
                                  {(chartData.reasonData || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getChartColors(index)} />
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
                              <BarChart data={chartData.classData || []}>
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
                  
                      {/* Gender Distribution */}
                      <Col lg={6}>
                        <Card className="border-0 shadow-sm h-100">
                          <Card.Body>
                            <h5 className="mb-4">Gender Distribution</h5>
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={chartData.genderData || []}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={100}
                                  label
                                >
                                  {(chartData.genderData || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getChartColors(index)} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </Card.Body>
                        </Card>
                      </Col>
                    </>
                  )}

                  {/* Trends Section */}
                  {(selectedChartType === 'all' || selectedChartType === 'trends') && (
                    <>
                      {/* Dropouts Over Time */}
                      <Col lg={12}>
                        <Card className="border-0 shadow-sm h-100">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                              <h5 className="mb-0">Dropouts Over Time</h5>
                              <div className="btn-group">
                                <Button 
                                  variant={selectedTimeFrame === 'yearly' ? 'primary' : 'outline-primary'} 
                                  size="sm"
                                  onClick={() => setSelectedTimeFrame('yearly')}
                                >
                                  Yearly
                                </Button>
                                <Button 
                                  variant={selectedTimeFrame === 'quarterly' ? 'primary' : 'outline-primary'} 
                                  size="sm"
                                  onClick={() => setSelectedTimeFrame('quarterly')}
                                >
                                  Quarterly
                                </Button>
                                <Button 
                                  variant={selectedTimeFrame === 'monthly' ? 'primary' : 'outline-primary'} 
                                  size="sm"
                                  onClick={() => setSelectedTimeFrame('monthly')}
                                >
                                  Monthly
                                </Button>
                              </div>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                              <ComposedChart data={getTrendData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" name="Dropouts" />
                                <Line type="monotone" dataKey="value" stroke="#ff7300" name="Trend" />
                              </ComposedChart>
                            </ResponsiveContainer>
                          </Card.Body>
                        </Card>
                      </Col>

                      {/* Top 5 Schools with Dropouts */}
                      <Col lg={6}>
                        <Card className="border-0 shadow-sm h-100">
                          <Card.Body>
                            <h5 className="mb-4">Top 5 Schools with Dropouts</h5>
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart layout="vertical" data={chartData.schoolData || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={150} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#FF8042" name="Students" />
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
                                  data={chartData.occupationData || []}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={100}
                                  label
                                >
                                  {(chartData.occupationData || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getChartColors(index)} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </Card.Body>
                        </Card>
                      </Col>
                    </>
                  )}

                  {/* Correlations Section */}
                  {(selectedChartType === 'all' || selectedChartType === 'correlations') && (
                    <>
                      {/* Family Size and Dropout Correlation */}
                      <Col lg={6}>
                        <Card className="border-0 shadow-sm h-100">
                          <Card.Body>
                            <h5 className="mb-4">Family Size Distribution</h5>
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={chartData.familySizeData || []}>
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

                      {/* Gender by Reason - Radar Chart */}
                      <Col lg={6}>
                        <Card className="border-0 shadow-sm h-100">
                          <Card.Body>
                            <h5 className="mb-4">Dropout Reasons by Gender</h5>
                            <ResponsiveContainer width="100%" height={300}>
                              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData.radarData || []}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="reason" />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                                {Object.keys(chartData.genderWise || {}).map((gender, index) => (
                                  <Radar 
                                    key={`radar-${index}`}
                                    name={gender} 
                                    dataKey={gender} 
                                    stroke={getChartColors(index)} 
                                    fill={getChartColors(index)} 
                                    fillOpacity={0.6} 
                                  />
                                ))}
                                <Legend />
                                <Tooltip />
                              </RadarChart>
                            </ResponsiveContainer>
                          </Card.Body>
                        </Card>
                      </Col>

                      {/* Geographical Distribution */}
                      <Col lg={12}>
                        <Card className="border-0 shadow-sm h-100">
                          <Card.Body>
                            <h5 className="mb-4">District-wise Distribution</h5>
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart layout="vertical" data={chartData.districtData || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={150} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#A78BFA" name="Students" />
                              </BarChart>
                            </ResponsiveContainer>
                          </Card.Body>
                        </Card>
                      </Col>

                      {/* Class and Reason Correlation - Stacked Bar Chart */}
                      <Col lg={12}>
                        <Card className="border-0 shadow-sm h-100">
                          <Card.Body>
                            <h5 className="mb-4">Dropout Reasons by Class</h5>
                            <ResponsiveContainer width="100%" height={400}>
                              <BarChart data={chartData.classReasonMatrix || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="class" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {Object.keys(chartData.reasonWise || {}).map((reason, index) => (
                                  <Bar 
                                    key={`reason-${index}`}
                                    dataKey={reason} 
                                    stackId="a" 
                                    fill={getChartColors(index)}
                                    name={reason} 
                                  />
                                ))}
                              </BarChart>
                            </ResponsiveContainer>
                          </Card.Body>
                        </Card>
                      </Col>

                            <Col lg={12}>
                        <Card className="border-0 shadow-sm h-100">
                          <Card.Body>
                            <h5 className="mb-4">Dropout Reasons by Class</h5>
                            <ResponsiveContainer width="100%" height={400}>
                              <BarChart data={chartData.address || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="class" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {Object.keys(chartData.address || {}).map((reason, index) => (
                                  <Bar 
                                    key={`reason-${index}`}
                                    dataKey={reason} 
                                    stackId="a" 
                                    fill={getChartColors(index)}
                                    name={reason} 
                                  />
                                ))}
                              </BarChart>
                            </ResponsiveContainer>
                          </Card.Body>
                        </Card>
                      </Col>

                      
                    </>
                  )}
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
          className={`border-0 shadow-sm bg-${toastType === 'error' ? 'danger' : 'success'} text-white`}
        >
          <Toast.Header closeButton={false} className={`border-0 bg-${toastType === 'error' ? 'danger' : 'success'} text-white`}>
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

export default AdminDashboard