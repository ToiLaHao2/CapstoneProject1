import React from 'react';
import './Forms.css';

const LoginForm = () => {
    return (
        <div className="form-container">
            <h2>Login</h2>
            <form>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;