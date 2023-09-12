import { Link } from "react-router-dom";
import { AuthContext } from '../../App';
import { useContext, useState } from "react";

const Navbar = () => {
    const token = useContext(AuthContext);
    const [activeButton, setActiveButton] = useState("Profile");

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    }

    return (
        <>
            {token ?
                <>
                    <div className="navbar">
                        <div className="left-buttons">
                            <Link to={'/profile'}>
                                <button
                                    className={`navbar-button ${activeButton === 'Profile' ? 'active' : ''}`}
                                    onClick={() => handleButtonClick('Profile')}
                                >
                                    Profile
                                </button>
                            </Link>
                            <Link to={'/main'}>
                                <button
                                    className={`navbar-button ${activeButton === 'Main page' ? 'active' : ''}`}
                                    onClick={() => handleButtonClick('Main page')}
                                >
                                    Main page
                                </button>
                            </Link>
                            <Link to={'/users'}>
                                <button
                                    className={`navbar-button ${activeButton === 'Users' ? 'active' : ''}`}
                                    onClick={() => handleButtonClick('Users')}
                                >
                                    Users
                                </button>
                            </Link>
                        </div>
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
