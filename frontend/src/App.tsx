import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './view/Home';
import Profile from './view/Profile';
import About from './view/About';
import Login from './view/Login';
import Register from './view/Register';
import Dashboard from './view/user/Dashboard';
import PlannerData from './view/user/Planner';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planner" element={<PlannerData />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
