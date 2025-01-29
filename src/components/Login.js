import React, { useState } from 'react';
import './Login.css'; 


const Login = () => {
    const [empIdOrEmail, setEmpIdOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        // Validate email format
        if (!empIdOrEmail.endsWith('@evernorth.com') && !/^\d+$/.test(empIdOrEmail)) {
            setError('Please enter a valid Employee ID or Email ');
            // ending with @evernorth.com

            return;
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.');
            return;
        }

        console.log('Logging in with:', { empIdOrEmail, password });
        // Handle login logic here (e.g., API call)
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Employee ID / Email:</label>
                    <input
                        type="text"
                        value={empIdOrEmail}
                        onChange={(e) => setEmpIdOrEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                <br></br><br></br>
                
            </form>
        </div>
    );
};

export default Login;
