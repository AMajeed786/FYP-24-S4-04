import React, { useState } from 'react';
import Header from '../component/header';
import { User } from '../model/User';
import { userController } from '../controller/userController';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contact, setContact] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

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
              
            } else {
                setError('Failed to create user. Please try again.');
            }
        } catch (error) {
            setError('An error occurred while creating the user. Please try again.');
            console.error(error);
        }
    };

    return (
        <main>
            <Header />
            <div className="form-container">
                <form action="/register" method="POST" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

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

                {error && <div style={{ color: 'red' }}>{error}</div>}
                {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
                <p>Already have an account? <a href="/login">Login here</a></p>
            </div>
        </main>
    );
};

export default Register;
