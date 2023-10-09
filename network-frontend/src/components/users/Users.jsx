import { useState, useEffect, useContext } from "react";
import "./Users.css";
import { AuthContext } from "../../App";
import myImage from './user.png';
import magnifyingGlass from './glass3.png';
import { useNavigate } from "react-router-dom";
import useFetchData2 from "../../useFetchData2";

const Users = () => {
  const apiUrlBase = "http://localhost:8080/api/v1/users";
  const user = useContext(AuthContext);
  const token = user.token;
  const [selectedOption, setSelectedOption] = useState("followers");
  const apiUrl =
    selectedOption === "All" ? apiUrlBase : `${apiUrlBase}/${selectedOption}`;
  const navigate = useNavigate();

  const { data: users, error, loading, updateUrl, fetchDataNewUrl } = useFetchData2(apiUrl, null, token);

  useEffect(() => {
    fetchDataNewUrl(apiUrl);
  }, [apiUrl]);


  const handleButtonClick = (option) => {
    setSelectedOption(option);
  };



  const getUsersByUsername = async (username) => {
    if (username != '') {
      setSelectedOption('username/' + username);
    }
  };


  return (
    <div className="users">
      <div className="users-button-container">
        <div className="search-container">
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
        {users?.length !== 0 && users?.map((user) => (
          <div key={user.id} className="user">
            <img src={myImage} alt="" className="picture" />
            <div className="user-name">{user.firstname}</div>
            <div className="user-btn"> 
              <div className="user-btn-row">
                <button onClick={() => navigate('/profile/' + user.id)} className="user-btn">View profile</button>

              </div>
            </div>
          </div>
        ))}
        {users?.length === 0 && <div className="message1">No users found</div>}
      </div>
    </div>
  );
};

export default Users;
