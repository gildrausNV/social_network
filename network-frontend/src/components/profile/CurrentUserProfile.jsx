import { useContext } from 'react';
import { AuthContext } from '../../App';
import useFetchData from '../../useFetchData';
import Profile from './Profile';
import useFetchData2 from '../../useFetchData2';

const CurrentUserProfile = () => {
  const user = useContext(AuthContext);
  const apiUrl = 'http://localhost:8080/api/v1/users/currentlyLoggedIn';
  const { data, loading, error } = useFetchData2(apiUrl, null, user.token);

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
