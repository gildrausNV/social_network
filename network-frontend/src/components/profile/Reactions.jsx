const Reactions = ({ reactions }) => {
    function calculateTimeAgo(givenDate) {
        const currentDate = new Date();
        const givenDateTime = new Date(givenDate);
      
        // Check if the date is valid
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
        <div className="reactions">
            <h1>Reactions</h1>
            {reactions && reactions?.map((reaction) => (
                <div className="reactions" key={reaction.id}>
                    {reaction.reactionType === "LIKE" && '👍'} 
                    {reaction.reactionType === "ANGRY" && '😡'} 
                    {reaction.reactionType === "LOVE" && '😍'} 
                    {reaction.reactionType === "SAD" && '😭'} 
                    {reaction.likedByUser.username} {calculateTimeAgo(reaction.timestamp)}
                </div>
            ))}
        </div>
    );
}

export default Reactions;