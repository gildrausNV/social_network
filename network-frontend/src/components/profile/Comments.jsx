import useTimeCalculator from "../../useTimeCalculator";

const Comments = ({ comments }) => {
    const { calculateTime } = useTimeCalculator();

    return (
        <div className="comments-container">
            {comments && comments?.map((comment) => (
                <div className="comments" key={comment.id}>
                    {comment.creator.username} : {comment.content} {calculateTime(comment.timePosted)}
                </div>
            ))}
        </div>
    );
}

export default Comments;