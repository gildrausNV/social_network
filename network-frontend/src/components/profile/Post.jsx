import { useContext, useState } from 'react';
import usePostData from '../../usePostData';
import './Profile.css';
import { AuthContext } from '../../App';

const Post = ({ post }) => {

    const token = useContext(AuthContext);

    const [comment, setComment] = useState();

    const { loading, error, postDataRequest } = usePostData();
    
    const apiUrl = "http://localhost:8080/api/v1/posts/" + post.id + "/comment";

    const handleNewPostChange = (event) => {
        setComment(event.target.value);
      };
    
      const handlePostSubmit = () => {
        postDataRequest(apiUrl, { content: comment }, token);
        setComment('');
      };
      
    return ( 
        <div className="post">
            <div className="row">
                <div className="header">
                    {post?.creator.firstname} {post?.creator.lastname}
                </div>
                <div className="report-delete">
                    <button className="delete">Delete</button>
                </div>
            </div>
            <div className="row">
                {post?.content}
                <button>Like({})</button>
            </div>
            <div className="row">
                <textarea name="comment" id="" cols="30" rows="10" onChange={handleNewPostChange}/>
                <button onClick={handlePostSubmit}>Comment</button>
            </div>
            <div className="row">
                
            </div>
        </div>
     );
}
 
export default Post;