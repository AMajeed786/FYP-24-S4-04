import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut, User } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';  // Import Firebase Firestore functions
import React, { useEffect, useState } from 'react';
import Picture from '../assets/logout.svg'; // Make sure the path to the logout image is correct

const UserHeader = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null); // State to store the user's role
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getFirestore();  // Initialize Firestore

  // Fetch user's role from Firestore
  useEffect(() => {
    const fetchUserRole = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Fetch the user's role from the Firestore database
        const userRef = doc(db, 'users', currentUser.uid); // Assuming users are stored in 'users' collection
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setRole(userDoc.data()?.role);  // Set the role from the Firestore document
        }
      }
    };

    // Check session and authenticate user
    const sessionId = sessionStorage.getItem('sessionId');
    if (sessionId) {
      console.log('Session active:', sessionId);
    } else {
      console.log('No active session');
      navigate('/login'); // Redirect if no session is found
    }

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserRole(); // Fetch role if user is logged in
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

  const handleAuthAction = () => {
    if (user) {
      // If the user is logged in, log them out
      signOut(auth)
        .then(() => {
          console.log('User logged out');
          setUser(null);
          setRole(null);  // Clear role on logout

          // Clear session data
          sessionStorage.clear();

          // Redirect to login page
          navigate('/login');
        })
        .catch((error) => {
          console.error('Error logging out:', error.message);
        });
    } else {
      // Redirect to login page if the user is not logged in
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link style={{ textDecoration: 'none' }} to="/dashboard" className="nav-item">Home</Link>
        <Link style={{ textDecoration: 'none' }} to="/planner" className="nav-item">Planner</Link>
        <Link style={{ textDecoration: 'none' }} to="/profile" className="nav-item">Profile</Link>

        {/* Conditionally render Admin Dashboard link based on role */}
        {role === 'admin' && (
          <Link style={{ textDecoration: 'none' }} to="/admindashboard" className="nav-item">Admin Dashboard</Link>
        )}
      </div>

      {/* Login/Logout button */}
      <div className="profile">
        <button onClick={handleAuthAction} className="profile-icon-button">
          <img src={Picture} alt={user ? "Logout" : "Login"} className="profile-icon" />
        </button>
      </div>
    </nav>
  );
};

export default UserHeader;
