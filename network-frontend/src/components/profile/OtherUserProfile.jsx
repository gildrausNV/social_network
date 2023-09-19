import { useParams } from "react-router-dom";
import Profile from "./Profile";
import { useEffect, useState } from "react";
import axios from "axios";

const OtherUserProfile = () => {
    const { id } = useParams();

    return ( 
        <>
            <Profile id={id} isCurrentUser={false}/>
        </>
     );
}
 
export default OtherUserProfile;