import React, { useState } from 'react';
import Header from '../component/header';
import { userController } from '../controller/userController';
import { useNavigate } from 'react-router-dom';
import { Authorise } from '../model/Authorise';  // Import Authorise model


const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [generalError, setGeneralError] = useState<string | null>(null);
    const navigate = useNavigate();

    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        const user: Authorise = { email, password };
    
        try {
          // Step 1: Call the controller to handle authentication and token verification
          const response = await userController.loginUser(user);
    
          // Step 2: Extract userId and sessionId from response
          const { user_id, session_id } = response.data;
    
          // Step 3: Store userId and sessionId in sessionStorage
          sessionStorage.setItem('userId', user_id);
          sessionStorage.setItem('sessionId', session_id);
    
          // Step 4: Navigate to the dashboard on success
          navigate('/dashboard');
        } catch (error) {
          setGeneralError('');
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
                <p>Forget Password? <a href="/forgetpassword">Reset here</a></p>
            </div>
            {/* General Error */}
            {generalError && <div style={{ color: 'red', marginTop: '10px'}}>{generalError}</div>}

        </main>
    );
};

export default Login;
