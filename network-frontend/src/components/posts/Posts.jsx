import { useContext, useState } from "react";
import authContext from "../../AuthContext";
import Post from "./Post";
import './Posts.css';
import useFetchData from "../../customHooks/useFetch";
import { Button } from "@mui/material";
import useDeleteData from "../../customHooks/useDelete";

const Posts = ({ isLoggedInUser, posts }) => {
    const user = useContext(authContext);
    // const [currentPage, setCurrentPage] = useState(0);

    // const { data: posts, updateParams, refetchData, totalPages } = useFetchData(apiUrl, user.token, { size: 3, page: currentPage });

    const { deleteRequest } = useDeleteData();

    // const nextPage = () => {
    //     setCurrentPage((currentPage) => currentPage + 1);
    //     updateParams({ size: 3, page: currentPage + 1 });
    // };

    // const previousPage = () => {
    //     setCurrentPage((currentPage) => currentPage - 1);
    //     updateParams({ size: 3, page: currentPage - 1 });
    // };

    const deletePost = async (id) => {
        const url = "http://localhost:8080/api/v1/posts/" + id;
        deleteRequest(url, user.token);
    };

    return (
        <>
            {/* <div className="page-buttons-container">
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
            </div> */}
            <div className="posts">
                {posts && posts.map((post) => (
                    <Post post={post} deletePost={deletePost} isLoggedInUser={isLoggedInUser} key={post.id} />
                ))}
            </div>
        </>
    );
}

export default Posts;