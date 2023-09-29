import { useContext } from 'react';
import { AuthContext } from '../../App';
import useFetchData from '../../useFetchData';
import Profile from './Profile';

const CurrentUserProfile = () => {
  const user = useContext(AuthContext);
  const apiUrl = 'http://localhost:8080/api/v1/users/currentlyLoggedIn';
  const { data, loading, error } = useFetchData(apiUrl, user.token);

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <Profile id={data?.id} isCurrentUser={true}/>
    </>
  );
};

export default CurrentUserProfile;
