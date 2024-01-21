import './Sidebar.css';
import { Link } from 'react-router-dom';
import loginIcon from '../../icons/enter.png';
import registerIcon from '../../icons/user.png';
import menuIcon from '../../icons/menu.png';
import menuIconShort from '../../icons/menu (1).png';
import homeIcon from '../../icons/home.png';
import notificationIcon from '../../icons/bell (1).png';
import chatIcon from '../../icons/chat.png';
import logoutIcon from '../../icons/logout.png';
import usersIcon from '../../icons/group.png';
import reportIcon from '../../icons/danger.png';
import profileIcon from '../../icons/user (2).png';
import { useContext, useState } from 'react';
import authContext from '../../AuthContext';

const Sidebar = () => {
    const [expandSidebar, setExpandSidebar] = useState(false);
    const user = useContext(authContext);
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
    const token = localStorage.getItem('token');

    return (
        <div className={`sidebar ${expandSidebar ? "wide" : "narrow"}`}>
            <div className="top-section">
                {expandSidebar && <div className="icon-text">
                    <h3>Social Network</h3>
                </div>}
                <div className={`menu-icon-container ${expandSidebar ? "wide" : "narrow"}`} onClick={() => setExpandSidebar(!expandSidebar)} >
                    {expandSidebar ? <img src={menuIcon} alt="" className='menu-icon' /> : <img src={menuIconShort} alt="" className='menu-icon' />}
                </div>
            </div>
            <div className="middle-section">
                <ul>
                    {token ?
                        <>
                            <Link to={'/home'}>
                                <li className={`link ${expandSidebar ? "wide" : "narrow"}`}>
                                    <div className="icon-container">
                                        <img src={homeIcon} alt="" className='icon' />
                                    </div>
                                    {expandSidebar && <div className="icon-text">
                                        <button>Home</button>
                                    </div>}
                                </li>
                            </Link>
                            {!isAdmin && <Link to={'/notifications'}>
                                <li className={`link ${expandSidebar ? "wide" : "narrow"}`}>
                                    <div className="icon-container">
                                        <img src={notificationIcon} alt="" className='icon' />
                                    </div>
                                    {expandSidebar && <div className="icon-text">
                                        <button>Notifications</button>
                                    </div>}
                                </li>
                            </Link>}
                            {/* {!isAdmin && <Link to={'/chat'}>
                                <li className={`link ${expand ? "wide" : "narrow"}`}>
                                    <div className="icon-container">
                                        <img src={chatIcon} alt="" className='icon' />
                                    </div>
                                    {expand && <div className="icon-text">
                                        <button>Chat</button>
                                    </div>}
                                </li>
                            </Link>} */}
                            <Link to={'/users'}>
                                <li className={`link ${expandSidebar ? "wide" : "narrow"}`}>
                                    <div className="icon-container">
                                        <img src={usersIcon} alt="" className='icon' />
                                    </div>
                                    {expandSidebar && <div className="icon-text">
                                        <button>Users</button>
                                    </div>}
                                </li>
                            </Link>
                            {isAdmin && <Link to={'/reports'}>
                                <li className={`link ${expandSidebar ? "wide" : "narrow"}`}>
                                    <div className="icon-container">
                                        <img src={reportIcon} alt="" className='icon' />
                                    </div>
                                    {expandSidebar && <div className="icon-text">
                                        <button>Reports</button>
                                    </div>}
                                </li>
                            </Link>}
                            {!isAdmin && <Link to={'/profile'}>
                                <li className={`link ${expandSidebar ? "wide" : "narrow"}`}>
                                    <div className="icon-container">
                                        <img src={profileIcon} alt="" className='icon' />
                                    </div>
                                    {expandSidebar && <div className="icon-text">
                                        <button>Profile</button>
                                    </div>}
                                </li>
                            </Link>}
                        </>
                        :
                        <>
                            <Link to={'/login'}>
                                <li className={`link ${expandSidebar ? "wide" : "narrow"}`}>
                                    <div className="icon-container">
                                        <img src={loginIcon} alt="" className='icon' />
                                    </div>
                                    {expandSidebar && <div className="icon-text">
                                        <button>Login</button>
                                    </div>}
                                </li>
                            </Link>
                            <Link to={'/register'}><li className={`link ${expandSidebar ? "wide" : "narrow"}`}>
                                <div className="icon-container">
                                    <img src={registerIcon} alt="" className='icon' />
                                </div>
                                {expandSidebar && <div className="icon-text">
                                    <button>Register</button>
                                </div>}
                            </li>
                            </Link>
                        </>
                    }
                </ul>
            </div>
            <div className="bottom-section">
                <ul>
                    <Link to={'/login'}>
                        <li className={`link ${expandSidebar ? "wide" : "narrow"}`}>
                            <div className="icon-container">
                                <img src={logoutIcon} alt="" className='icon' />
                            </div>
                            {expandSidebar && <div className="icon-text">
                                <button>Logout</button>
                            </div>}
                        </li>
                    </Link>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;