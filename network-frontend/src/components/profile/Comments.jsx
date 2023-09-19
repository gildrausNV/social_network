const Comments = ({ comments }) => {

    function calculateTimeAgo(givenDate) {
        const currentDate = new Date();
        const givenDateTime = new Date(givenDate);
      
        if (isNaN(givenDateTime)) {
          return "Invalid date";
        }
        
        const timeDifference = currentDate - givenDateTime;
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
      
        if (days > 0) {
          return `${days} day${days !== 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
          return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
          return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else {
          return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
        }
      }
      

    return (
        <div className="comments-container">
            {comments && comments?.map((comment) => (
                <div className="comments" key={comment.id}>
                    {comment.creator.username} : {comment.content} {calculateTimeAgo(comment.timePosted)}
                </div>
            ))}
        </div>
    );
}

export default Comments;