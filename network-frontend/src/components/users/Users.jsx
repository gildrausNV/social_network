import { useState, useEffect, useContext } from "react";
import "./Users.css";
import { AuthContext } from "../../App";
import axios from "axios";
import useFetchData from "../../useFetchData";
import usePostData from "../../usePostData";
import myImage from './user.png';

const Users = () => {
  const apiUrlBase = "http://localhost:8080/api/v1/users";
  const token = useContext(AuthContext);
  const [selectedOption, setSelectedOption] = useState("followers");
  const apiUrl =
    selectedOption === "All" ? apiUrlBase : `${apiUrlBase}/${selectedOption}`;
  const [isFollowingData, setIsFollowingData] = useState([]);
  const { data, loading, error } = useFetchData(apiUrl, token);
  const { postDataRequest } = usePostData();

  // useEffect(() => {
  //   const fetchIsFollowingData = async () => {
  //     const promises = data.map(async (user) => {
  //       try {
  //         const response = await axios.get(
  //           `http://localhost:8080/api/v1/users/isFollowing/${user.id}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );
  //         return {
  //           user: user,
  //           isFollowing: response.data,
  //         };
  //       } catch (error) {
  //         console.log(error);
  //         return null;
  //       }
  //     });

  //     const updatedIsFollowingData = await Promise.all(promises);
  //     setIsFollowingData(
  //       updatedIsFollowingData.filter((item) => item !== null)
  //     );
  //   };

  //   if (data) {
  //     fetchIsFollowingData();
  //   }
  // }, [data, token]);
  const [users, setUsers] = useState();

  useEffect(() => {
    const getUsers = async () => {

      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/users",
          {
            params: {
              size: 1,
              page: 0,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(response.data);

      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    };
    getUsers();
  }, []);

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

  async function isFollowing(id) {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/users/isFollowing/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error checking if following:", error);
      return false; // Return false in case of an error
    }
  }

  return (
    <div className="users">
      <div className="users-button-container">

        <button
          onClick={() => handleButtonClick("followers")}
          className={`user-button ${selectedOption === 'followers' ? 'active' : ''}`}
        >
          Followers
        </button>
        <button
          onClick={() => handleButtonClick("following")}
          className={`user-button ${selectedOption === 'following' ? 'active' : ''}`}
        >
          Following
        </button>
      </div>
      <div className="users-content">
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {data && data.map((user) => (
          <div key={user.id} className="user">
            <img src={myImage} alt="" className="picture" />
            <div className="user-name">{user.firstname}</div>
            <div className="user-btn">
              <div className="user-btn-row">
                {isFollowing(user.id)===true ? (
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
      </div>
    </div>
  );
};

export default Users;
