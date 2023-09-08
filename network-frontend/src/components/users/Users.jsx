import { useState, useEffect, useContext } from "react";
import "./Users.css";
import { AuthContext } from "../../App";
import axios from "axios";
import useFetchData from "../../useFetchData";
import usePostData from "../../usePostData";

const Users = () => {
  const apiUrlBase = "http://localhost:8080/api/v1/users";
  const token = useContext(AuthContext);
  const [selectedOption, setSelectedOption] = useState("followers");
  const apiUrl =
    selectedOption === "All" ? apiUrlBase : `${apiUrlBase}/${selectedOption}`;
  const [isFollowingData, setIsFollowingData] = useState([]);
  const { data, loading, error } = useFetchData(apiUrl, token);
  const { postDataRequest } = usePostData();

  useEffect(() => {
    const fetchIsFollowingData = async () => {
      const promises = data.map(async (user) => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/v1/users/isFollowing/${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return {
            user: user,
            isFollowing: response.data,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      });

      const updatedIsFollowingData = await Promise.all(promises);
      setIsFollowingData(
        updatedIsFollowingData.filter((item) => item !== null)
      );
    };

    if (data) {
      fetchIsFollowingData();
    }
  }, [data, token]);

  const handleButtonClick = (option) => {
    setSelectedOption(option);
  };

  const handleFollow = (userId) => {
    const followUrl = `http://localhost:8080/api/v1/users/follow/${userId}`;
    postDataRequest(followUrl, null, token);
  };

  const handleUnfollow = (userId) => {
    const unfollowUrl = `http://localhost:8080/api/v1/users/unfollow/${userId}`;
    postDataRequest(unfollowUrl, null, token);
  };

  return (
    <div className="users">
      <div className="button-container">
        <button
          onClick={() => handleButtonClick("followers")}
          className="users-btn"
        >
          Followers
        </button>
        <button
          onClick={() => handleButtonClick("following")}
          className="users-btn"
        >
          Following
        </button>
      </div>
      <div className="users-content">
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {data && (
          <ul>
            {data.map((user) => (
              <div key={user.id} className="user">
                <div className="user-name">{user.firstname}</div>
                <div className="user-btn">
                  <div className="user-btn-row">
                    {isFollowingData.find((item) => item.user.id === user.id)
                      ?.isFollowing ? (
                      <button onClick={() => handleFollow(user.id)}>
                        Follow
                      </button>
                    ) : (
                      <button onClick={() => handleUnfollow(user.id)}>
                        Unfollow
                      </button>
                    )}
                  </div>
                  <div className="user-btn-row">
                    <button>Chat</button>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Users;
