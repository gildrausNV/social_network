import { useContext, useEffect, useState } from 'react';
import './MainPage.css';
import useFetchData from '../../useFetchData';
import { AuthContext } from '../../App';
import Post from '../profile/Post';
import axios from 'axios';

const MainPage = () => {

    // const [data, setData] = useState();
    // const [currentPage, setCurrentPage] = useState(0);
    // const [totalPages, setTotalPages] = useState(0);
    const apiUrl = 'http://localhost:8080/api/v1/posts';
    const token = useContext(AuthContext);
    // const { data, loading, error} = useFetchData(apiUrl, token);
    // console.log(data.content)
    const [posts, setPosts] = useState();
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const getPosts = async () => {
          
          try {
            const response = await axios.get(
              "http://localhost:8080/api/v1/posts",
              {
                params: {
                  size: 2,
                  page: currentPage,
                },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages);
          } catch (error) {
            console.error("Login failed:", error);
            throw error;
          }
        };
        getPosts();
      }, [currentPage]);

      console.log(posts);

    
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(apiUrl, {
    //                 params: {
    //                     size: 5,
    //                     page: currentPage,
    //                 },
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });
    //             setTotalPages(response.data.totalPages);
    //             setData(response.data.content);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     fetchData();
    // }, [currentPage]);

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
                <Post post = {post} key={index}/>
            ))}
        </div>
     );
}
 
export default MainPage;