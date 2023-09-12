import '../Navbar/Navbar.css';
import {Logo} from '../img/Logo';
import {Button,} from 'rsuite';
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {headers, url} from "../environment";
import axios from 'axios';


function Navbar() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState({});
    useEffect(() => {
        async function fetchData() {
            const id = localStorage.getItem('id');
            axios.get(`${url}/user/${id}`, {
                headers: headers
            })
                .then((res) => {
                    const user = res.data.data.user[0];
                    setIsAdmin(user.isadmin);
                });
        }
        fetchData();
    }, []);
    return (
        <nav className="navbar">
            <Link to="/dashboard"><Logo/></Link>
            <div className="links">
                {
                    isAdmin === 1 ? <Link to="/admin"><Button appearance="default">admin</Button></Link> : null
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
    localStorage.clear();
    redirectToLogin(navigate);
}

function redirectToLogin(navigate) {
    navigate('/');
}


export {Navbar}