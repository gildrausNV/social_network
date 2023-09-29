import React, { useContext } from 'react';
import { AuthContext } from '../../App';
import useFetchData from '../../useFetchData';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
  const apiUrl = 'http://localhost:8080/api/v1/users';
  const user = useContext(AuthContext);
  const token = user.token;
  const { data, loading, error } = useFetchData(apiUrl, token);
  const navigate = useNavigate();

  return (
    <div className="recommendations">
      <h3>People you might know:</h3>
      {data?.content.map((user) => (
        <div className="recommended-user"  onClick={() => navigate('/profile/' + user.id)} key={user.id}>
          <div className="recommended-user-info">
            <p>{user.firstname} {user.lastname}</p>
          </div>
          <div className="follow-button-container">
            <button className='follow-btn' onClick={() => navigate('/profile/' + user.id)}>
              View profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
