import React, { useState } from 'react';
import axios from 'axios'; // If you're using axios to send requests
import Header from '../component/header';

const ForgetPassword: React.FC = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Replace with your actual API URL for forgotten password
      const response = await axios.post('/forgot-password', { username });

      // If successful, show the success message
      setMessage(response.data.message);
    } catch (error) {
      // If there's an error, show the error message
      setMessage(error.response?.data?.detail || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        <Header />
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgetPassword;
