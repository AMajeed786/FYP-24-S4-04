import React, { useState } from 'react';
import Header from '../component/header';
import { Authorise } from '../model/Authorise';
import { userController } from '../controller/userController';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
  
        const user: Authorise = {
            email,
            password,
        };

        try {
            const response = await userController.authenticateUser(user);
            const userId = response.data.user_id; 
            console.log(response.data.userId);

           
            sessionStorage.setItem('userId', userId);

            navigate('/dashboard');
        } catch (error) {
            console.error(error);
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
