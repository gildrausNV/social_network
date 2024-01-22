import { memo, useContext, useEffect, useState } from 'react';
import authContext from '../../AuthContext';
import UserDetails from './UserDetails';
import './Users.css';
import useFetchData from '../../customHooks/useFetch';
import { Button } from '@mui/material';

const MemoizedUserDetails = memo(UserDetails);

const Users = () => {
    const fetchUsersUrl = "http://localhost:8080/api/v1/users";
    const currentUser = useContext(authContext);
    const [option, setOption] = useState('');
    const { data: users, updateUrl } = useFetchData(fetchUsersUrl, currentUser.token);

    useEffect(() => {
        updateUrl("http://localhost:8080/api/v1/users" + option);
    }, [option])

    return (
        <div className='users'>
            <div className="buttons-container">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOption('')}
                >
                    All
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOption('/followers')}
                >
                    Followers
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOption('/following')}
                >
                    Following
                </Button>
            </div>
            <div className="users-list">
                {users && users.map((user) => (
                    <>
                        {/* <UserDetails user={user} key={user.id} /> */}
                        <MemoizedUserDetails user={user} key={user.id} />
                    </>
                ))}
            </div>
        </div>

    );
}

export default Users;