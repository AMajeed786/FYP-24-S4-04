import { Navigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // For Firestore check
import { useNavigate } from 'react-router-dom';

// PrivateRoute component for protecting routes
const PrivateRoute = ({ element, adminOnly }: { element: JSX.Element, adminOnly: boolean }) => {
  const auth = getAuth();
  const [userRole, setUserRole] = useState<string | null>(null); // Store role state
  const [loading, setLoading] = useState<boolean>(true); // Loading state to wait for role fetch
  const location = useLocation(); // Get the current location
  const navigate = useNavigate();

  // Fetch user role from Firestore
  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid); // Assuming the users are stored in a collection named 'users'
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Fetched user role:", userData?.role); // Debugging line
            setUserRole(userData?.role || null); // Set user role
          } else {
            console.log("User document not found");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
      setLoading(false); // Stop loading after the role is fetched
    };

    fetchUserRole();
  }, [auth.currentUser]);

  console.log("User Role:", userRole); // Debugging line
  console.log("Loading State:", loading); // Debugging line

  // If the user is not authenticated, redirect to login page
  if (!auth.currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is still loading, don't render the route yet
  if (loading) {
    return <div>Loading...</div>; // or a loading spinner
  }

  // Check if the route is for admins only, and the user is not an admin
  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Render the requested element (protected route)
  return element;
};

export default PrivateRoute;
