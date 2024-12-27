import { Navigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

// PrivateRoute component for protecting routes
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const auth = getAuth();
  const user = auth.currentUser; // Get the currently authenticated user

  const location = useLocation(); // Get the current location

  // If the user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is logged in, render the passed component
  return element;
};

export default PrivateRoute;
