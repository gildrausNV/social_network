import Info from './Info';
import Posts from './Posts';
import './Profile.css'
import Recommendations from './Recommendations';

const Profile = ({data}) => {
    
      const { id } = data;
      
        return ( 
            <div className="profile-container">
                <div className="left-container">
                    <div className="info-container">
                        <Info id={id} className="info" />
                    </div>
                    <div className="recommendations-container">
                        <Recommendations id={id} />
                    </div>
                </div>
                <div className="right-container">
                    <Posts id={id} />
                </div>
            </div>
     );
      
    
}
 
export default Profile;