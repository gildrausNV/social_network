import { Link } from "react-router-dom";
import { AuthContext } from '../../App';
import { useContext, useEffect, useState } from "react";

const Navbar = ({ newNotification }) => {
    const user = useContext(AuthContext);
    const [activeButton, setActiveButton] = useState("");

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    }

    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
    const token = localStorage.getItem('token');

    return (
        <>
            {token ?
                <>
                    <div className="navbar">
                        <div className="left-buttons">
                            {isAdmin === false && (
                                <Link to={'/profile'}>
                                    <button
                                        className={`navbar-button ${activeButton === 'Profile' ? 'active' : ''}`}
                                        onClick={() => handleButtonClick('Profile')}
                                    >
                                        Profile
                                    </button>
                                </Link>
                            )}
                            <Link to={'/main'}>
                                <button
                                    className={`navbar-button ${activeButton === 'Main page' ? 'active' : ''}`}
                                    onClick={() => handleButtonClick('Main page')}
                                >
                                    Main page
                                </button>
                            </Link>
                            {isAdmin === false && (
                                <Link to={'/users'}>
                                    <button
                                        className={`navbar-button ${activeButton === 'Users' ? 'active' : ''}`}
                                        onClick={() => handleButtonClick('Users')}
                                    >
                                        Users
                                    </button>
                                </Link>
                            )}
                            {isAdmin === true && (
                                <Link to={'/reports'}>
                                    <button
                                        className={`navbar-button ${activeButton === 'Reports' ? 'active' : ''}`}
                                        onClick={() => handleButtonClick('Reports')}
                                    >
                                        Reports
                                    </button>
                                </Link>
                            )}
                            {isAdmin === false && (
                                <Link to={'/chat'}>
                                    <button
                                        className={`navbar-button ${activeButton === 'Chat' ? 'active' : ''}`}
                                        onClick={() => handleButtonClick('Chat')}
                                    >
                                        Chat
                                    </button>
                                </Link>
                            )}
                            {isAdmin === false && (
                                <Link to={'/notifications'}>
                                    <button
                                        className={`navbar-button ${activeButton === 'Notifications' ? 'active' : ''}`}
                                        onClick={() => handleButtonClick('Notifications')}
                                    >
                                        Notifications {newNotification ? <span className="red-dot"></span> : null} {newNotification}
                                    </button>
                                </Link>
                            )}
                        </div>
                        <div className="auth-buttons">
                            <Link to={'/login'}>
                                <button
                                    className={`navbar-button ${activeButton === 'Login' ? 'active' : ''}`}
                                    onClick={() => handleButtonClick('Login')}
                                >
                                    Logout
                                </button>
                            </Link>
                        </div>
                    </div>
                </> :
                <>
                    <div className="navbar">
                        <div className="auth-buttons">
                            <Link to={'/login'}>
                                <button
                                    className={`navbar-button ${activeButton === 'Login' ? 'active' : ''}`}
                                    onClick={() => handleButtonClick('Login')}
                                >
                                    Login
                                </button>
                            </Link>
                            <Link to={'/register'}>
                                <button
                                    className={`navbar-button ${activeButton === 'Register' ? 'active' : ''}`}
                                    onClick={() => handleButtonClick('Register')}
                                >
                                    Register
                                </button>
                            </Link>
                        </div>
                    </div>
                </>
            }
        </>
    );
}

export default Navbar;
