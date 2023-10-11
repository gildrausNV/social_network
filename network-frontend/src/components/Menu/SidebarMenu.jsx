import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import './SidebarMenu.css';
import myImage from '../users/user.png';
import useFetchData2 from "../../useFetchData2";

const SidebarMenu = ({ newNotification, newMessage }) => {
    const user = useContext(AuthContext);
    const id = user.id;
    const [activeButton, setActiveButton] = useState("");
    const navigate = useNavigate();

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    }

    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
    const token = localStorage.getItem('token');

    const apiUrl = 'http://localhost:8080/api/v1/users/' + id;
    const { data, loading, error, fetchDataNewUrl } = useFetchData2(apiUrl, null, token);

    useEffect(() => {
        fetchDataNewUrl('http://localhost:8080/api/v1/users/' + id);
    }, [id])



    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <div className="sidebar-logo">Social Network</div>
                <nav className="sidebar-nav">
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
                                <li>
                                    <Link
                                        to="/chat"
                                        className={`sidebar-button ${activeButton === "Chat" ? "active" : ""
                                            }`}
                                        onClick={() => handleButtonClick("Chat")}
                                    >
                                        Chat
                                        {newMessage && (
                                            <span className="notification-badge">
                                                <span className="red-dot">●</span>
                                                <span className="tooltip">{newMessage}</span>
                                            </span>
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/notifications"
                                        className={`sidebar-button ${activeButton === "Notifications" ? "active" : ""}`}
                                        onClick={() => handleButtonClick("Notifications")}
                                    >
                                        Notifications
                                        {newNotification && (
                                            <span className="notification-badge">
                                                <span className="red-dot">●</span>
                                                <span className="tooltip">{newNotification}</span>
                                            </span>
                                        )}
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
                </nav>
            </div>
            {token && 
            <div className="sidebar-bottom">
            <div className="info" onClick={() => navigate('/profile')}>
                <img src={myImage} alt="" className="picture" />
                <div className="info-row">
                    <p>{data?.firstname} {data?.lastname}</p>
                </div>
            </div>
        </div>}
        </div>
    );
};

export default SidebarMenu;
