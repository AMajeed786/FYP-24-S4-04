import { Link } from 'react-router-dom';
import Picture from '../assets/logout.svg';
const UserHeader = () => {
  return (
    <>
    
      <nav className="navbar">
        <div className="nav-links">
          
            <Link style={{textDecoration:'none'}} to="/dashboard" className="nav-item">Home</Link>
            <Link style={{textDecoration:'none'}} to="/planner" className="nav-item">Planner</Link>
           
        </div>
        <div className="profile">
          
            <Link to="/login">
                <img src={Picture} alt="login" className="profile-icon" />
            </Link>
        </div>
    </nav>
    </>
  
  );
};

export default UserHeader;
