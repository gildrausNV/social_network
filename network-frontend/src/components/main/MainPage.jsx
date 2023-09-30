import { useContext, useEffect, useState } from 'react';
import './MainPage.css';
import useFetchData from '../../useFetchData';
import { AuthContext } from '../../App';
import Post from '../profile/Post';

const MainPage = () => {
  const apiUrl = 'http://localhost:8080/api/v1/posts';
  const user = useContext(AuthContext);
  const [posts, setPosts] = useState();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const { data, loading, error, fetchWithParams } = useFetchData(apiUrl, user.token);

  useEffect(() => {
    fetchWithParams({
      size: 4,
      page: currentPage,
    });
  }, [currentPage, fetchWithParams]);

  useEffect(() => {
    if (data) {
      setPosts(data.content);
      setTotalPages(data.totalPages);
    }
  }, [data]);


  const nextPage = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  const previousPage = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };

  return (
    <div className="main-page">
      <div className="pagination">
        <button
          onClick={previousPage}
          disabled={currentPage === 0}
          className="pagination-button"
        >
          Previous
        </button>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          className="pagination-button"
        >
          Next
        </button>
      </div>
      {posts?.map((post, index) => (
        <Post post={post} key={index} />
      ))}
    </div>
  );
}

export default MainPage;