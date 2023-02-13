import '../Navbar/Navbar.css';
import { Logo } from '../img/Logo';
import { Button, } from 'rsuite';
import { Link } from "react-router-dom";
import "firebase/auth";
import { getAuth, signOut} from "firebase/auth";
import { useNavigate } from "react-router-dom";



function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/dashboard"><Logo /></Link>
            <div className="links">
                <Link to="/Account"><Button className="my-account" appearance="default">Mon compte</Button></Link>
                <Button onClick={logout} className="disconnect" appearance="default">Déconnexion</Button>
            </div>
        </nav>
    )
}

function logout() {
    const auth = getAuth();
    signOut(auth).then(() => {

        // redirect to login page
        const navigate = useNavigate();
        navigate("/");

    }).catch((error) => {
      // An error happened.
      
    })
  }


export { Navbar }