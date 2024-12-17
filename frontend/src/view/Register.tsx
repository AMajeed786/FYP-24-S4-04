import React, { useState } from 'react';
import Header from '../component/header';
import { User } from '../model/User';
import { userController } from '../controller/userController';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contact, setContact] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Clear previous errors
        setEmailError(null);
        setUsernameError(null);
        setGeneralError(null);
        setSuccessMessage(null);

        const user: User = {
            username,
            email,
            password,
            contact,
        };

        try {
            const response = await userController.createUser(user);
          
            if (response.status === 201) {
              setSuccessMessage('User created successfully!');
              setUsername('');
              setEmail('');
              setPassword('');
              setContact('');
            }
          } catch (error: any) {
            // Handle specific error details
            if (error.detail) {  // TypeScript now knows 'detail' exists
              if (error.detail.includes('email')) {
                setEmailError(error.detail);
              } else if (error.detail.includes('username')) {
                setUsernameError(error.detail);
              } else {
                setGeneralError('Failed to create user. Please try again.');
              }
            } else {
              setGeneralError('An unexpected error occurred.');
            }
          }
          
    };

    return (
        <main>
            <Header />
            <div className="form-container">
                <form action="/register" method="POST" onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    {usernameError && <p style={{ color: 'red', marginTop: '5px' }}>{usernameError}</p>}

                    {/* Email Field */}
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {emailError && <p style={{ color: 'red', marginTop: '5px' }}>{emailError}</p>}

                    {/* Password Field */}
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {/* Contact Field */}
                    <label htmlFor="contact">Contact:</label>
                    <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                    />

                    <button type="submit">Register</button>
                </form>

                {/* General Error */}
                {generalError && <div style={{ color: 'red', marginTop: '10px' }}>{generalError}</div>}

                {/* Success Message */}
                {successMessage && <div style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}

                <p>Already have an account? <a href="/login">Login here</a></p>
            </div>
        </main>
    );
};

export default Register;
