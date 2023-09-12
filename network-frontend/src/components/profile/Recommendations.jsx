import React, { useContext } from 'react';
import usePostData from '../../usePostData'; // Import the usePostData hook
import { AuthContext } from '../../App';
import useFetchData from '../../useFetchData';

const Recommendations = () => {
  const apiUrl = 'http://localhost:8080/api/v1/users';
  const token = useContext(AuthContext);
  const { data, loading, error } = useFetchData(apiUrl, token);
  const { postDataRequest } = usePostData(); // Use the custom hook

  // Function to handle the follow action
  const handleFollow = (userId) => {
    const followUrl = `http://localhost:8080/api/v1/users/follow/${userId}`;
    postDataRequest(followUrl, null, token);
  };

  return (
    <div className="recommendations">
      <h3>People you might know:</h3>
      {data?.content.map((user) => (
        <div className="recommended-user" key={user.id}>
          <div className="recommended-user-info">
            <p>{user.firstname} {user.lastname}</p>
          </div>
          <div className="follow-button-container">
            <button className='follow-btn' onClick={() => handleFollow(user.id)}>
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
