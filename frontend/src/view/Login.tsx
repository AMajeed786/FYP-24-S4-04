import React, { useState } from 'react';
import Header from '../component/header';
import { userController } from '../controller/userController';
import { useNavigate } from 'react-router-dom';
import { Authorise } from '../model/Authorise';  // Import Authorise model


const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Step 1: Create a user object of type Authorise
        const user: Authorise = { email, password };

        try {
            // Step 2: Pass the user object to the controller for authentication
            const userUID = await userController.authenticateUser(user); // Pass the user object

            // Step 3: Send the idToken to the backend for verification
            const response = await userController.sendTokenToBackend(userUID);

            // Step 4: Store the userId and navigate
            sessionStorage.setItem('userId', response.data.user_id);
            navigate('/dashboard');
        } catch (error) {
            setError('Failed to log in. Please check your credentials and try again.');
            console.error('Login error', error);
        }
    };

    return (
        <main>
            <Header />
            <div className="form-container">
                <form action="/login" method="POST" onSubmit={handleSubmit}>
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
                    
                    <button type="submit">Login</button>
                </form>
                <p>Don’t have an account? <a href="/register">Register here</a></p>
            </div>
        </main>
    );
};

export default Login;
