import '../Navbar/Navbar.css';
import { Logo } from '../img/Logo';
import { Button,  } from 'rsuite';

function Navbar() {
    return (
        <nav className="navbar">
            <Logo />
            <div className="links">
                <Button className="my-account" appearance="default">Mon compte</Button>
                <Button className="disconnect" appearance="default">Déconnexion</Button>
            </div>
        </nav>
    )
}

export { Navbar }