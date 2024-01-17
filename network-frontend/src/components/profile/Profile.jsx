import { useContext, useState } from 'react';
import './Profile.css';
import authContext from '../../AuthContext';
import useFetchData from '../../customHooks/useFetch';
import useDeleteData from '../../customHooks/useDelete';
import Post from '../posts/Post';
import { Button, TextField } from '@mui/material';
import usePostData from '../../customHooks/usePost';
import NewPost from './NewPost';
import Posts from '../posts/Posts';

const Profile = ({ id, isLoggedInUser, handlePostSubmit, deletePost }) => {
    const user = useContext(authContext);
    const apiUrl = "http://localhost:8080/api/v1/posts/users/" + id;
    const [currentPage, setCurrentPage] = useState(0);

    const { data: posts, updateParams, totalPages } = useFetchData(apiUrl, user.token, { size: 3, page: currentPage });

    const nextPage = () => {
        setCurrentPage((currentPage) => currentPage + 1);
        updateParams({ size: 3, page: currentPage + 1 });
    };

    const previousPage = () => {
        setCurrentPage((currentPage) => currentPage - 1);
        updateParams({ size: 3, page: currentPage - 1 });
    };

    return (
        <div className="profile">
            {isLoggedInUser && <NewPost handlePostSubmit={handlePostSubmit}/>}
             <div className="page-buttons-container">
                <div className="page-buttons">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={previousPage}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={nextPage}
                        disabled={currentPage === totalPages - 1}
                    >
                        Next
                    </Button>
                </div>
            </div>
            <Posts apiUrl={apiUrl} isLoggedInUser={isLoggedInUser} posts={posts}/>
        </div>
    );
}

export default Profile;