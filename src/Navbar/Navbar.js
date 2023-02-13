import '../Navbar/Navbar.css';
import {Logo} from '../img/Logo';
import {Button,} from 'rsuite';
import {Link, useNavigate} from "react-router-dom";
import "firebase/auth";
import {getAuth, signOut} from "firebase/auth";


function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="navbar">
            <Link to="/dashboard"><Logo/></Link>
            <div className="links">
                <Link to="/Account"><Button className="my-account" appearance="default">Mon compte</Button></Link>
                <Link to="/">
                    <Button onClick={() => disconnect(navigate)} className="disconnect"
                            appearance="default">Déconnexion</Button>
                </Link>
            </div>
        </nav>
    )
}

function redirectToLogin(navigate) {
    navigate('/');
}

export {Navbar}