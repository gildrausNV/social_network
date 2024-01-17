import React, { useContext } from 'react';
import { Typography, Avatar, Paper, Grid, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import Profile from './Profile';
import authContext from '../../AuthContext';
import useFetchData2 from '../../customHooks/useFetchWithoutParams';
import userIcon from '../../icons/user (1).png';
import './Profile.css';
import useDeleteData from '../../customHooks/useDelete';
import usePostData from '../../customHooks/usePost';

const OtherUserProfile = () => {
    const { id } = useParams();
    const user = useContext(authContext);
    const token = user.token;
    const apiUrl = 'http://localhost:8080/api/v1/users/' + id;
    const { data, loading, error } = useFetchData2(apiUrl, null, token);

    const { response, postDataRequest } = usePostData();
    const { deleteRequest } = useDeleteData();

    const getIsFollowing = "http://localhost:8080/api/v1/users/isFollowing/" + id;
    const { data: isFollowingFetched, loading: isFollowingLoading, updateUrl: updateUrl, fetchDataNewUrl, refetchData } = useFetchData2(getIsFollowing, null, token);

    const handleFollowClick = () => {
        const url = "http://localhost:8080/api/v1/users/follow/" + id;
        postDataRequest(url, null, token);
        window.location.reload();
    };

    const handleUnfollowClick = () => {
        const url = "http://localhost:8080/api/v1/users/unfollow/" + id;
        deleteRequest(url, token);
        window.location.reload();
    };

    return (
        <>
            <div className="user-info">
                {data && (
                    <Paper elevation={3} className="user-info-paper">
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                {/* <Avatar alt="User Icon" src={data.icon || userIcon} /> */}
                                <img src={userIcon} alt="" className='user-icon' />
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" component="div">
                                    {`${data.firstname} ${data.lastname}`}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {`@${data.username}`}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {data.email}
                                </Typography>
                            </Grid>
                            <Grid item>
                                {isFollowingFetched ? <Button variant="outlined" color="primary" onClick={handleUnfollowClick}>
                                    Unfollow
                                </Button> : <Button variant="outlined" color="primary" onClick={handleFollowClick}>
                                    Follow
                                </Button>}

                            </Grid>
                        </Grid>
                    </Paper>
                )}
            </div>
            {isFollowingFetched ? <>
                <Profile id={id} isLoggedInUser={false} className="profile" />
            </>:<>
                <><h3>You have to follow this user to see posts</h3></>
            </>}
            
        </>
    );
};

export default OtherUserProfile;


