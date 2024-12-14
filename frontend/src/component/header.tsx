import { Link } from 'react-router-dom';
import Picture from '../assets/Picture1.svg';
const Header = () => {
  return (
    <>
    
      <nav className="navbar">
        <div className="nav-links">
          
            <Link style={{textDecoration:'none'}} to="/" className="nav-item">Home</Link>
            <Link style={{textDecoration:'none'}}  to="/about" className="nav-item">About Us</Link>
          
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

export default Header;
