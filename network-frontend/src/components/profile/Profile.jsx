import Info from './Info';
import Posts from './Posts';
import './Profile.css'
import Recommendations from './Recommendations';

const Profile = ({data}) => {
    
      const { id } = data;
      
        return ( 
            <div className="profile-container">
                <Info id={id} className="info" />
                <div className="recommendations">
                    <Recommendations id={id} />
                </div>
                <div className="posts">
                    <Posts id={id} />
                </div>
            </div>
     );
      
    
}
 
export default Profile;