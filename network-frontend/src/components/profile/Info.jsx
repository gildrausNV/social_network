import { useEffect, useState, useContext } from 'react';
import './Profile.css';
import axios from 'axios'
import { AuthContext } from '../../App';
import { Link } from 'react-router-dom';
import useFetchData from '../../useFetchData';

const Info = ({id}) => {
    const token = useContext(AuthContext)
    const apiUrl = 'http://localhost:8080/api/v1/users/'+id;
    const { data, loading, error } = useFetchData(apiUrl, token);

    return ( 
        <div className="info">
            {token ? <>
                Email: {data?.email}
                Name: {data?.firstname} {data?.lastname}
            </>:<>
                <Link to={'/login'}>Login</Link>
            </>}
        </div>
     );
}
 
export default Info;