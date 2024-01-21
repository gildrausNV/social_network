import { useContext } from 'react';
import useDeleteData from '../../customHooks/useDelete';
import usePostData from '../../customHooks/usePost';
import Profile from './Profile';
import './Profile.css';
import authContext from '../../AuthContext';

const CurrentUserProfile = () => {
    const user = useContext(authContext);
    const fetchPostsUrl = "http://localhost:8080/api/v1/posts/users/" + user.id;

    const { deleteRequest } = useDeleteData();


    const deletePost = async (id) => {
        const url = "http://localhost:8080/api/v1/posts/" + id;
        deleteRequest(url, user.token);
    };

    const apiUrlPost = 'http://localhost:8080/api/v1/posts';
    const token = user.token;

    const { loading: postLoading, error: postError, response, postDataRequest } = usePostData();

    const handlePostSubmit = async (content) => {
        await postDataRequest(apiUrlPost, content, token);
    };

    return ( 
        <>
            <Profile id={user.id} isLoggedInUser={true} handlePostSubmit={handlePostSubmit} deletePost={deletePost}/>
        </>
     );
}
 
export default CurrentUserProfile;