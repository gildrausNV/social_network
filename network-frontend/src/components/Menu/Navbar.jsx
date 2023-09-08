import { Link } from "react-router-dom";
import { AuthContext } from '../../App';
import { useContext } from "react";

const Navbar = () => {
    const token = useContext(AuthContext)

    return ( 
        <>
            {token ? 
            <>
                <div className="navbar">
                    <Link to={'/profile'}><button>Profile</button></Link>
                    <Link to={'/main'}><button>Main page</button></Link>
                    <Link to={'/users'}><button>Users</button></Link>
                    <Link to={'/login'}><button>Logout</button></Link>
                </div>
            </>:
            <>
                <div className="navbar">
                    <Link to={'/login'}><button>Login</button></Link>
                    <Link to={'/register'}><button>Register</button></Link>
                </div>
            </>}
        </>
     );
}
 
export default Navbar;