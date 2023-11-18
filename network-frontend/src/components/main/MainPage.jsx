import { useContext, useEffect, useState } from 'react';
import './MainPage.css';
import useFetchData from '../../useFetchData';
import { AuthContext } from '../../App';
import Post from '../profile/Post';
import useFetchData2 from '../../useFetchData2';
import Posts from '../profile/Posts';
import Trends from '../Trends/Trends';
import NewTrends from '../Trends/NewTrends';

const MainPage = () => {

  return (
    <div className="main-page">
      <Posts id={null} isCurrentUser={false} isFollowing={true} isMainPage={true}/>
      <div className="trends-container">
              <Trends />
              {/* <NewTrends /> */}
        </div>
    </div>
  );
}

export default MainPage;