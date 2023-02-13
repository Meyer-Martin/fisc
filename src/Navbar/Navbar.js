import '../Navbar/Navbar.css';
import { Logo } from '../img/Logo';
import { Button, } from 'rsuite';
import { Link } from "react-router-dom";
import "firebase/auth";

function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/dashboard"><Logo /></Link>
            <div className="links">
                <Link to="/Account"><Button className="my-account" appearance="default">Mon compte</Button></Link>
                <Link to="/">
                    <Button className="disconnect" appearance="default">Déconnexion</Button>
                </Link>
            </div>
        </nav>
    )
}

export { Navbar }