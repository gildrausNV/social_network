import { useEffect, useState } from 'react';
import Info from './Info';
import Posts from './Posts';
import './Profile.css'
import Recommendations from './Recommendations';
import axios from 'axios';
import usePostData from '../../usePostData';
import useFetchData from '../../useFetchData';

const Profile = ({ id, isCurrentUser }) => {

  const [isFollowing, setIsFollowing] = useState();
  const {response, postDataRequest } = usePostData();
  const { fetchData } = useFetchData();

  useEffect(() => {
    // const url = "http://localhost:8080/api/v1/users/isFollowing/" + id;
    // const response = fetchData(url, localStorage.getItem('token'));
    // console.log('fetch is Following' + JSON.stringify(response));
    const getIsFollowing = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/users/isFollowing/" + id,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsFollowing(response.data);
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    };
    getIsFollowing();
  }, [id])

  const follow = async () => {
    const url = "http://localhost:8080/api/v1/users/follow/" + id;
    postDataRequest(url, null, localStorage.getItem("token"));
    setIsFollowing(true);
  };

  const unfollow = async () => {
    // const url = "http://localhost:8080/api/v1/users/unfollow/" + id;
    // postDataRequest(url, null, localStorage.getItem("token"));
    // setIsFollowing(false);
  };

  return (
    <div className="profile-container">
      <div className="right-container">
        {!isCurrentUser && <div className="info-container">
          <Info id={id} isFollowing={isFollowing} follow={follow} unfollow={unfollow} className="info" />
        </div>}
        {isCurrentUser || isFollowing ? <><Posts id={id} isCurrentUser={isCurrentUser} isFollowing={isFollowing} /></> :
          <div className="info-container" style={{ paddingTop: '10%' }}>
            <h3>Follow to see posts</h3>
          </div>
        }

      </div>
    </div>
  );


}

export default Profile;