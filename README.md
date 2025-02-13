# Student Dropout Management System

A comprehensive web application for managing and analyzing student dropout data. This system provides interfaces for administrators, schools, and students to track, manage, and analyze dropout patterns.

## Features

### Admin Dashboard
- Comprehensive analytics and visualization of dropout patterns
- User management system
- Student records management
- Interactive charts and statistics
- Data export capabilities

### School Dashboard
- Student management interface
- Communication system with students
- Profile management
- Dropout documentation
- Student tracking

### Student Dashboard
- Profile management
- Communication with school administration
- Document submission
- Status tracking

## Tech Stack

- **Frontend**: React.js with Bootstrap
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Auth
- **Charts**: Recharts
- **Icons**: React Icons
- **Styling**: React Bootstrap & Custom CSS

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/student-dropout-management.git
```

2. Navigate to the project directory:
```bash
cd student-dropout-management
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory and add your Firebase configuration:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm start
```

## Project Structure

```
src/
├── components/          # Reusable components
├── pages/              # Main page components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── services/           # Firebase services
├── utils/              # Utility functions
├── styles/             # Global styles
└── App.js             # Main application component
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects the create-react-app configuration

## Database Structure

```
StudentDropOut/
├── studentDetails/     # Student information
├── users/             # User accounts
└── messages/          # Communication records
```

## Features in Detail

### Analytics Dashboard
- Year-wise dropout analysis
- Class-wise distribution
- Reason-wise analysis
- Father's occupation analysis
- Family size distribution
- School-wise analysis

### User Management
- Role-based access control
- User profile management
- Authentication and authorization

### Communication System
- Real-time messaging
- Message history
- Notification system

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Create React App team
- Firebase team
- React Bootstrap contributors
- Recharts contributors
