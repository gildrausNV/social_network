import { useState, useEffect, useContext } from "react";
import "./Users.css";
import { AuthContext } from "../../App";
import axios from "axios";
import useFetchData from "../../useFetchData";
import usePostData from "../../usePostData";
import myImage from './user.png';
import magnifyingGlass from './glass3.png';
import { useNavigate } from "react-router-dom";

const Users = () => {
  const apiUrlBase = "http://localhost:8080/api/v1/users";
  const token = useContext(AuthContext);
  const [selectedOption, setSelectedOption] = useState("followers");
  const apiUrl =
    selectedOption === "All" ? apiUrlBase : `${apiUrlBase}/${selectedOption}`;
  const [isFollowingData, setIsFollowingData] = useState([]);
  const { data, loading, error } = useFetchData(apiUrl, token);
  const { postDataRequest } = usePostData();
  const [users, setUsers] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {

      try {
        const response = await axios.get(
          apiUrl,
          {
            params: {
              size: 5,
              page: 0,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    };
    getUsers();
  }, [apiUrl]);

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

  async function isFollowing(id, name) {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/users/isFollowing/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('Response from isFollowing:', response.data);
      console.log(typeof response.data);
      return response.data;
    } catch (error) {
      console.error("Error checking if following:", error);
      return false; // Return false in case of an error
    }
  }

  const getUsersByUsername = async (username) => {
    if (username != '') {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/users/username/' + username, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsers(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Failed to fetch users by username:', error);
        throw error;
      }
    }
  };


  return (
    <div className="users">
      <div className="users-button-container">
        <div class="search-container">
          <input type="text" className="search-input" placeholder="Search..." onChange={(event) => getUsersByUsername(event.target.value)} />
          <img src={magnifyingGlass} alt="" className="picture" style={{ width: '30px', height: '30px', marginTop: '6px' }} />
        </div>
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
        {users && users?.map((user) => (
          <div key={user.id} className="user">
            <img src={myImage} alt="" className="picture" />
            <div className="user-name">{user.firstname}</div>
            <div className="user-btn">
              <div className="user-btn-row">
                {/* {isFollowing(user.id, user.firstname) === true ? 
              <button onClick={() => handleFollow(user.id)} disabled={isFollowing(user.id, user.firstname)}>
              Follow
            </button>
            :
            <button onClick={() => handleUnfollow(user.id)} disabled={!isFollowing(user.id, user.firstname)}>
              Unfollow
            </button>
            } */}
                <button onClick={() => navigate('/profile/' + user.id)} className="user-btn">View profile</button>

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
