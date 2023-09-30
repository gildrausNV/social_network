import React, { useContext, useState } from 'react';
import './Sidebar.css'; // Import your CSS file
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
    
    const { data, loading, error } = useFetchData2(apiUrl, null, token);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            className={`sidebar ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {token ? <>
                <img src={myImage} alt="" className="picture" onClick={() => navigate('/profile/' + data?.id)}/>
                <div className="info-row">
                    <p>Name: {data?.firstname} {data?.lastname}</p>
                    <p>Username: {data?.username}</p>
                    <p>Email: {data?.email}</p>
                </div>
                <div className="info-row">
                    <Recommendations />
                </div>
            </> : <>
                <Link to={'/login'}>Login</Link>
            </>}
        </div>
    );
}

export default Sidebar;
