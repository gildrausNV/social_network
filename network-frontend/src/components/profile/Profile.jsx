import { useContext, useEffect, useState } from 'react';
import Info from './Info';
import Posts from './Posts';
import './Profile.css'
import Recommendations from './Recommendations';
import axios from 'axios';
import usePostData from '../../usePostData';
import useFetchData from '../../useFetchData';
import useDeleteData from '../../useDeleteData';
import useFetchData2 from '../../useFetchData2';
import { AuthContext } from '../../App';

const Profile = ({ id, isCurrentUser }) => {
  const user = useContext(AuthContext);
  const token = user.token;
  const [isFollowing, setIsFollowing] = useState();
  const {response, postDataRequest } = usePostData();
  const { deleteRequest } = useDeleteData();

  const getIsFollowing = "http://localhost:8080/api/v1/users/isFollowing/" + id;
  const { data: isFollowingFetched, loading: isFollowingLoading, updateUrl: updateUrl, fetchDataNewUrl } = useFetchData2(getIsFollowing, null, token);

  

  const follow = async () => {
    const url = "http://localhost:8080/api/v1/users/follow/" + id;
    postDataRequest(url, null, token);
  };

  const unfollow = async () => {
    const url = "http://localhost:8080/api/v1/users/unfollow/" + id;
    deleteRequest(url, token);
  };
  
  useEffect(() => {
    setIsFollowing(isFollowingFetched);
  }, [follow, unfollow, id])

  return (
    <div className="profile-container">
      <div className="right-container">
        {!isCurrentUser && <div className="info-container">
          <Info id={id} isFollowing={isFollowingFetched} follow={follow} unfollow={unfollow} className="info" />
        </div>}
        {(isCurrentUser || isFollowing) ? <><Posts id={id} isCurrentUser={isCurrentUser} isFollowing={isFollowing} /></> :
          <div className="info-container" style={{ paddingTop: '10%' }}>
            <h3>Follow to see posts</h3>
          </div>
        }
      </div>
    </div>
  );


}

export default Profile;