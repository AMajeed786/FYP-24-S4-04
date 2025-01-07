import React, { useEffect, useState } from 'react';
import UserHeader from '../../component/userHeader';
import { userController } from '../../controller/userController';
import { User } from '../../model/User';


const Profile = () => {
  const [user, setUser] = useState<User | null>(null);  // Initialize user state to null
  const [emailError, setEmailError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Function to fetch the user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const fetchedUser = await userController.fetchUserProfile();  // Use userController directly
      if (fetchedUser) {
        setUser(fetchedUser);  // Set the user data in the state
      } else {
        console.error('User data not found');
      }
    };

    fetchUserProfile();  // Fetch user profile when the component mounts
  }, []);  // Empty dependency array means it runs once after the initial render

  
  // Handle profile updates
  const handleFieldChange = async (field: keyof User, value: string) => {
    let updateSuccess = false;
  
    // Clear previous errors
    setEmailError(null);
    setUsernameError(null);
    setGeneralError(null);
    setSuccessMessage(null);
  
    try {
      switch (field) {
        case 'username':
          updateSuccess = await userController.updateUsername(value);
          break;
        case 'email':
          updateSuccess = await userController.updateEmail(value);
          break;
        case 'contact':
          updateSuccess = await userController.updateContact(value);
          break;
        case 'password':
          updateSuccess = await userController.updatePassword(value);
          break;
        default:
          console.error('Invalid field update');
          return;
      }
  
      if (updateSuccess) {
        setUser((prevUser) => prevUser ? { ...prevUser, [field]: value } : prevUser);
        setSuccessMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
      } else {
        setGeneralError(`Failed to update ${field}. Please try again.`);
      }
    } catch (error: any) {
      if (error.detail) {
        if (field === 'username' && error.detail.includes('already exist')) {
          setUsernameError(error.details);
        } else if ( field == 'email' && error.detail.includes('already exist')) {
          setEmailError(error.details);
        } else {
          setGeneralError(error.detail);
        }
      } else {
        setGeneralError('An unexpected error occurred.');
      }
    }
  };
  


    // Loading state
    if (!user) {
      return <div>Loading...</div>;  // Display loading text if user data is not yet loaded
    }

    // Common styles for text, buttons, and containers
    const containerStyles = {
      maxWidth: '500px',
      margin: '50px auto',
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
      borderTop: '5px solid #4285F4', // Google blue accent
    };

    const headerStyles = {
      textAlign: 'center',
      color: '#333333',
      marginBottom: '30px',
      fontWeight: '600',
      fontSize: '24px',
    };

    const labelStyles = {
      display: 'block',
      marginBottom: '8px',
      color: '#6c757d',
      fontSize: '15px',
    };

    const inputContainerStyles = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    const spanStyles = {
      color: '#495057',
      fontSize: '16px',
      fontWeight: '500',
      marginRight: '10px', // Add some spacing to the right of the text
    };

    const buttonStyles = {
      padding: '8px 18px',
      backgroundColor: '#4285F4', // Google blue color for buttons
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      fontSize: '14px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    };

    return (
      <main style={{ backgroundColor: '#F1F3F4', minHeight: '100vh', padding: '0', margin: '0', fontFamily: 'Roboto, sans-serif' }}>
        <UserHeader />

        <div style={containerStyles}>
          <h2 style={headerStyles}>My Profile</h2>

          {/* Username Field */}
          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyles}>Username:</label>
            <div style={inputContainerStyles}>
              <span style={spanStyles}>{user.username}</span>
              <button 
                onClick={() => handleFieldChange('username', prompt('Enter new username:', user.username) || user.username)} 
                style={buttonStyles} 
                onMouseEnter={(e) => e.target.style.backgroundColor = '#3367D6'} 
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4285F4'}
              >
                Edit
              </button>
            </div>
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyles}>Email:</label>
            <div style={inputContainerStyles}>
              <span style={spanStyles}>{user.email}</span>
              <button 
                onClick={() => handleFieldChange('email', prompt('Enter new email:', user.email) || user.email)} 
                style={buttonStyles} 
                onMouseEnter={(e) => e.target.style.backgroundColor = '#3367D6'} 
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4285F4'}
              >
                Edit
              </button>
            </div>
          </div>

          {/* Contact Field */}
          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyles}>Contact:</label>
            <div style={inputContainerStyles}>
              <span style={spanStyles}>{user.contact}</span>
              <button 
                onClick={() => handleFieldChange('contact', prompt('Enter new contact:', user.contact) || user.contact)} 
                style={buttonStyles} 
                onMouseEnter={(e) => e.target.style.backgroundColor = '#3367D6'} 
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4285F4'}
              >
                Edit
              </button>
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyles}>Password:</label>
            <div style={inputContainerStyles}>
              <span style={spanStyles}>******</span> {/* Show stars to indicate password */}
              <button 
                onClick={() => handleFieldChange('password', prompt('Enter new password:') || '')} 
                style={buttonStyles} 
                onMouseEnter={(e) => e.target.style.backgroundColor = '#3367D6'} 
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4285F4'}
              >
                Edit
              </button>
            </div>
          </div>

          {/* General Error */}
          {generalError && <div style={{ color: 'red', marginTop: '10px' }}>{generalError}</div>}

          {/* Email Error */}
          {emailError && <div style={{ color: 'red', marginTop: '10px' }}>{emailError}</div>}

          {/* Username Error */}
          {usernameError && <div style={{ color: 'red', marginTop: '10px' }}>{usernameError}</div>}

          {/* Success Message */}
          {successMessage && <div style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}
        </div>
      </main>
    );
};

export default Profile;
