import React, { useEffect, useState } from 'react';
import { TextField, Button, Link } from '@mui/material';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken, setId, setIsAdmin, setUserContext }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    useEffect(() => {
        localStorage.removeItem('token');
        setToken(null);
      }, [])

    const login = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8080/api/v1/auth/login',
                {
                    username,
                    password
                }
            );
            console.log(response);
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    const verify = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8080/api/v1/auth/verify',
                {
                    username,
                    verificationCode
                }
            );
            console.log(response)
            const { token, id, role } = response.data;

            localStorage.setItem('id', id);
            localStorage.setItem('token', token);
            localStorage.setItem('isAdmin', role === 'ADMIN');
            setToken(token);
            setId(id);
            setIsAdmin(role === 'ADMIN');
            setUserContext({
                id,
                token,
                isAdmin: role === 'ADMIN'
            });
            navigate('/home');
        } catch (error) {
            console.error('Login failed:', error);
            //   setMessage('Login failed');
        }
    }

    return (
        <div className="login">
            <TextField
                id="username"
                label="Username"
                variant="standard"
                fullWidth
                margin="normal"
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                id="password"
                label="Password"
                type="password"
                variant="standard"
                fullWidth
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => {
                    login()
                }}
            >
                Login
            </Button>
            <div className="register-link">
                <Link href="/register" variant="body2">
                    Don't have an account? Register here
                </Link>
            </div>
            <TextField
                id="code"
                label="Verification code"
                variant="standard"
                fullWidth
                margin="normal"
                onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => {
                    verify();
                }}
            >
                Verify
            </Button>
        </div>
    );
};

export default Login;
