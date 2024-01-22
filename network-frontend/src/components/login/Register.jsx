import React, { useState } from 'react';
import { TextField, Button, Link, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        gender: 'MALE',
        username: '',
        password: '',
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:8080/api/v1/auth/register', formData
            );
            console.log(response);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };



    return (
        <div className="register">
            <form onSubmit={handleSubmit}>
                <TextField
                    id="username"
                    label="Username"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    name='username'
                    value={formData.username}
                    onChange={handleChange}
                />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                />
                <TextField
                    id="firstName"
                    label="First Name"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    name='firstname'
                    value={formData.firstname}
                    onChange={handleChange}
                />
                <TextField
                    id="lastname"
                    label="Last Name"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    name='lastname'
                    value={formData.lastname}
                    onChange={handleChange}
                />
                <TextField
                    id="email"
                    label="Email"
                    type="email"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                        labelId="gender-label"
                        id="gender"
                        label="Gender"
                        name='gender'
                        onChange={handleChange}
                    >
                        <MenuItem value="MALE">Male</MenuItem>
                        <MenuItem value="FEMALE">Female</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    type='submit'
                >
                    Register
                </Button>
                <div className="login-link">
                    <Link href="/login" variant="body2">
                        Already have an account? Login here
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
