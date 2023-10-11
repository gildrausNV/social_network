import { useEffect, useState, useContext } from 'react';
import './Profile.css';
import axios from 'axios'
import { AuthContext } from '../../App';
import { Link } from 'react-router-dom';
import useFetchData from '../../useFetchData';
import myImage from '../users/user.png';
import useFetchData2 from '../../useFetchData2';

const Info = ({ id, isFollowing, follow, unfollow }) => {
    const user = useContext(AuthContext);
    const token = user.token;
    const apiUrl = 'http://localhost:8080/api/v1/users/' + id;
    const { data, loading, error, fetchDataNewUrl } = useFetchData2(apiUrl, null, token);

    useEffect(() => {
        fetchDataNewUrl('http://localhost:8080/api/v1/users/' + id);
    }, [id])

    return (
        <div className="info-card">
            <img src={myImage} alt="" className="picture-card" />
            <div className="info-card-row">
                <p>Name: {data?.firstname} {data?.lastname}</p>
                <p>Email: {data?.email}</p>
                {id !== user.id && (!isFollowing ? <button className='follow-btn' onClick={() => follow()}>Follow</button> : <button className='unfollow-btn' onClick={() => unfollow()}>Unfollow</button>)}
            </div>
        </div>
    );
}

export default Info;