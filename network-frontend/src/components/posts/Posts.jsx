import { useContext, useState } from "react";
import authContext from "../../AuthContext";
import Post from "./Post";
import './Posts.css';
import useFetchData from "../../customHooks/useFetch";
import { Button } from "@mui/material";
import useDeleteData from "../../customHooks/useDelete";

const Posts = ({ isLoggedInUser, posts }) => {
    const user = useContext(authContext);

    const { deleteRequest } = useDeleteData();

    const deletePost = async (id) => {
        const url = "http://localhost:8080/api/v1/posts/" + id;
        deleteRequest(url, user.token);
    };

    return (
        <>
            <div className="posts">
                {posts && posts.map((post) => (
                    <Post post={post} deletePost={deletePost} isLoggedInUser={isLoggedInUser} key={post.id} />
                ))}
            </div>
        </>
    );
}

export default Posts;