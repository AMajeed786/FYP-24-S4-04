import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './view/Home';  // Assuming you have a Home component
import Profile from './view/Profile';
import About from './view/About';
import Login from './view/Login';
import Register from './view/Register';
import Dashboard from './view/user/Dashboard';
import PlannerData from './view/user/Planner';
import PrivateRoute from './component/PrivateRoute';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />  {/* This is the new route for '/home' */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/planner" element={<PrivateRoute element={<PlannerData />} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


