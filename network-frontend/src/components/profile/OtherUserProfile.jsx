import { useParams } from "react-router-dom";
import Profile from "./Profile";

const OtherUserProfile = () => {
    const { id } = useParams();

    return ( 
        <>
            <Profile id={id} isCurrentUser={false}/>
        </>
     );
}
 
export default OtherUserProfile;