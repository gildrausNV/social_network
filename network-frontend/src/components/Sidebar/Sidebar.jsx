import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import myImage from './user.png';
import { AuthContext } from '../../App';
import Recommendations from '../profile/Recommendations';
import useFetchData2 from '../../useFetchData2';

function Sidebar() {
    const [isHovered, setIsHovered] = useState(false);
    const apiUrl = 'http://localhost:8080/api/v1/users/currentlyLoggedIn';
    const user = useContext(AuthContext);
    const token = user.token;
    const [activeButton, setActiveButton] = useState("");

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    }

    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

    const { data, loading, error } = useFetchData2(apiUrl, null, token);
    const navigate = useNavigate();


    return (
        <div className='Sidebar'>
            <div className="top-section">
                <img src={myImage} alt="" className='logo-image'/>
                <div className="details">
                    <p>{user.name} username</p>
                </div>
            </div>
            <div className="menu">
            <ul>
                        {!token ? (
                            <>
                                <li>
                                    <Link
                                        to="/login"
                                        className={`sidebar-button ${activeButton === "Login" ? "active" : ""
                                            }`}
                                        onClick={() => handleButtonClick("Login")}
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/register"
                                        className={`sidebar-button ${activeButton === "Register" ? "active" : ""
                                            }`}
                                        onClick={() => handleButtonClick("Register")}
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link
                                    to="/login"
                                    className={`sidebar-button ${activeButton === "Logout" ? "active" : ""
                                        }`}
                                    onClick={() => handleButtonClick("Logout")}
                                >
                                    Logout
                                </Link>
                            </li>
                        )}
                        {token && (
                            <li>
                                <Link
                                    to="/main"
                                    className={`sidebar-button ${activeButton === "Main page" ? "active" : ""
                                        }`}
                                    onClick={() => handleButtonClick("Main page")}
                                >
                                    Main page
                                </Link>
                            </li>
                        )}
                        {token && !isAdmin && (
                            <>
                                <li>
                                    <Link
                                        to="/profile"
                                        className={`sidebar-button ${activeButton === "Profile" ? "active" : ""
                                            }`}
                                        onClick={() => handleButtonClick("Profile")}
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/users"
                                        className={`sidebar-button ${activeButton === "Users" ? "active" : ""
                                            }`}
                                        onClick={() => handleButtonClick("Users")}
                                    >
                                        Users
                                    </Link>
                                </li>

                            </>
                        )}
                        {token && isAdmin && (
                            <li>
                                <Link
                                    to="/reports"
                                    className={`sidebar-button ${activeButton === "Reports" ? "active" : ""
                                        }`}
                                    onClick={() => handleButtonClick("Reports")}
                                >
                                    Reports
                                </Link>
                            </li>
                        )}
                    </ul>
            </div>
            <div className="bottom-section">

            </div>
        </div>
    );
}

export default Sidebar;
