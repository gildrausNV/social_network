import { useEffect, useState, useContext } from 'react';
import './Profile.css';
import axios from 'axios'
import { AuthContext } from '../../App';
import { Link } from 'react-router-dom';
import useFetchData from '../../useFetchData';
import myImage from '../users/user.png';

const Info = ({id}) => {
    const token = useContext(AuthContext)
    const apiUrl = 'http://localhost:8080/api/v1/users/'+id;
    const { data, loading, error } = useFetchData(apiUrl, token);

    return ( 
        <div className="info">
            {token ? <>
                <img src={myImage} alt=""  className="picture"/>
                <div className="info-row">
                    <p>Name: {data?.firstname} {data?.lastname}</p>
                    <p>Email: {data?.email}</p>
                </div>
            </>:<>
                <Link to={'/login'}>Login</Link>
            </>}
        </div>
     );
}
 
export default Info;