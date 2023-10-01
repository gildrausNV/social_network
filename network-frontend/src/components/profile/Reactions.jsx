import useTimeCalculator from "../../useTimeCalculator";

const Reactions = ({ reactions }) => {
    const { calculateTime } = useTimeCalculator();
      
    return (
        <div className="reactions-container">
            {reactions && reactions?.map((reaction) => (
                <div className="reactions" key={reaction.id}>
                    {reaction.reactionType === "LIKE" && '👍'} 
                    {reaction.reactionType === "ANGRY" && '😡'} 
                    {reaction.reactionType === "LOVE" && '😍'} 
                    {reaction.reactionType === "SAD" && '😭'} 
                    {reaction.likedByUser.username} {calculateTime(reaction.timestamp)}
                </div>
            ))}
        </div>
    );
}

export default Reactions;