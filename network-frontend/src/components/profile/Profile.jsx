import { useEffect, useState } from 'react';
import Info from './Info';
import Posts from './Posts';
import './Profile.css'
import Recommendations from './Recommendations';
import axios from 'axios';

const Profile = ({ id, isCurrentUser }) => {

    const [isFollowing, setIsFollowing] = useState();

    useEffect(() => {
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
        try {
          const response = await axios.post(
            "http://localhost:8080/api/v1/users/follow/" + id,
            null,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setIsFollowing(true);
        } catch (error) {
          console.error("Failed to follow user:", error);
          throw error;
        }
      };
    
      const unfollow = async () => {
        try {
          const response = await axios.delete(
            "http://localhost:8080/api/v1/users/unfollow/" + id,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setIsFollowing(false);
        } catch (error) {
          console.error("Post failed:", error);
          throw error;
        }
      };

    return (
        <div className="profile-container">
            <div className="right-container">
                {!isCurrentUser && <div className="info-container">
                    <Info id={id} isFollowing={isFollowing} follow={follow} unfollow={unfollow} className="info" />
                </div>}
                {isCurrentUser || isFollowing ? <><Posts id={id} isCurrentUser={isCurrentUser} isFollowing={isFollowing}/></>:
                <div className="info-container" style={{ paddingTop: '10%'}}>
                    <h3>Follow to see posts</h3>
                </div>
                }
                
            </div>
        </div>
    );


}

export default Profile;