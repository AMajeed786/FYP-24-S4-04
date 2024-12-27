import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import Picture from '../assets/logout.svg'; // Make sure the path to the logout image is correct

const UserHeader = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();
  const navigate = useNavigate(); // Use the navigate function

  useEffect(() => {
    // Set up the listener to track the authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Update the user state when authentication state changes
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleAuthAction = () => {
    if (user) {
      // Log out the user if they are logged in
      signOut(auth)
        .then(() => {
          console.log('User logged out');
          setUser(null); // Reset user state to null after logout

          // Clear Firebase authentication persistence manually (optional)
          // Firebase usually handles this automatically, but if you want to force clearing:
          auth.signOut().then(() => {
            // Clear any Firebase-related session storage
            localStorage.removeItem('firebaseAuthPersistence'); // Optional
            // Optionally clear other session-related items if necessary

            // Redirect to login page without allowing the user to go back
            navigate('/login', { replace: true }); // Use React Router navigate for proper history management
          });
        })
        .catch((error) => {
          console.error('Error logging out:', error.message);
        });
    } else {
      // Redirect to the login page if the user is not logged in
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link style={{ textDecoration: 'none' }} to="/dashboard" className="nav-item">Home</Link>
        <Link style={{ textDecoration: 'none' }} to="/planner" className="nav-item">Planner</Link>
      </div>
      <div className="profile">
        <button onClick={handleAuthAction} className="profile-icon-button">
          <img src={Picture} alt={user ? "Logout" : "Login"} className="profile-icon" />
        </button>
      </div>
    </nav>
  );
};

export default UserHeader;
