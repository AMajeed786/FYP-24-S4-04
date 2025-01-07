import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './view/Home';  // Assuming you have a Home component
import Profile from './view/user/Profile';
import About from './view/About';
import Login from './view/Login';
import Register from './view/Register';
import Dashboard from './view/user/Dashboard';
import PlannerData from './view/user/Planner';
import AdminDashboard from './view/admin/AdminDashboard';  // Import AdminDashboard
import PrivateRoute from './component/PrivateRoute';
import ForgetPassword from './view/ForgetPassword';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />  {/* This is the new route for '/home' */}
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />


          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/planner" element={<PrivateRoute element={<PlannerData />} />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />

          {/* Admin Protected Route */}
          <Route
            path="/admindashboard"
            element={<PrivateRoute element={<AdminDashboard />} adminOnly={true} />}  // Protect the AdminDashboard
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
