import '../Navbar/Navbar.css';
import {Logo} from '../img/Logo';
import {Button,} from 'rsuite';
import {Link, useNavigate} from "react-router-dom";
import "firebase/auth";
import {getAuth, signOut} from "firebase/auth";
import {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase/firebaseConfig";


function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    useEffect(() => {
        async function fetchData() {
            const uid = localStorage.getItem('uid');
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const user = docSnap.data();
                setUser(user);
            } else {
                console.log('Aucun document correspondant !');
            }
        }
        fetchData();
    }, []);
    return (
        <nav className="navbar">
            <Link to="/dashboard"><Logo/></Link>
            <div className="links">
                {
                    user.role === 'ADMIN' ? <Link to="/admin"><Button appearance="default">admin</Button></Link> : null
                }
                <Link to="/account"><Button className="my-account" appearance="default">Mon compte</Button></Link>
                <Link to="/">
                    <Button onClick={() => disconnect(navigate)} className="disconnect"
                            appearance="default">Déconnexion</Button>
                </Link>
            </div>
        </nav>
    )
}

function disconnect(navigate) {
    const auth = getAuth();
    signOut(auth)
        .then(() => {
            localStorage.removeItem('uid');
            redirectToLogin(navigate);
        })
        .catch((error) => {
            console.error(error);
        });
}

function redirectToLogin(navigate) {
    navigate('/');
}


export {Navbar}