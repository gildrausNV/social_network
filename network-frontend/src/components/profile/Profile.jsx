import Info from './Info';
import Posts from './Posts';
import './Profile.css'
import Recommendations from './Recommendations';

const Profile = ({id, isCurrentUser}) => {
    
      
        return ( 
            <div className="profile-container">
                <div className="left-container">
                    <div className="info-container">
                        <Info id={id} className="info" />
                    </div>
                    <div className="recommendations-container">
                        {isCurrentUser && <Recommendations id={id} />}
                    </div>
                </div>
                <div className="right-container">
                    <Posts id={id} isCurrentUser={isCurrentUser}/>
                </div>
            </div>
     );
      
    
}
 
export default Profile;