import { useContext, useState } from 'react';
import authContext from '../../AuthContext';
import Posts from '../posts/Posts';
import './Home.css';
import useFetchData from '../../customHooks/useFetch';
import { Button } from '@mui/material';

const Home = () => {
    const fetchPostsUrl = "http://localhost:8080/api/v1/posts";
    const user = useContext(authContext);
    const [currentPage, setCurrentPage] = useState(0);

    const { data: posts, updateParams, refetchData, totalPages } = useFetchData(fetchPostsUrl, user.token, { size: 3, page: currentPage });

    const nextPage = () => {
        setCurrentPage((currentPage) => currentPage + 1);
        updateParams({ size: 3, page: currentPage + 1 });
    };

    const previousPage = () => {
        setCurrentPage((currentPage) => currentPage - 1);
        updateParams({ size: 3, page: currentPage - 1 });
    };

    return (
        <div className="home">
            <div className="page-buttons-container">
                <div className="page-buttons">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={previousPage}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={nextPage}
                        disabled={currentPage === totalPages - 1}
                    >
                        Next
                    </Button>
                </div>
            </div>
            <div className="post-container">
                <Posts isLoggedInUser={false} posts={posts}/>
            </div>
        </div>
    );
}

export default Home;