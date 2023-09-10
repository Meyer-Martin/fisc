import React, {useEffect, useState} from "react";
import {Navbar} from "../Navbar/Navbar";
import "./Account.css"
import {Button, Input} from 'rsuite';
import axios from 'axios';


function Account() {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [forename, setForename] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get('http://localhost:3000/user', {
            headers: {
                "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImEuY0BnbWFpbC5jb20iLCJpYXQiOjE2OTQzNjI5MzEsImV4cCI6MTY5NDM3MzczMX0.ZWWH6gNYu_k_kBQ6v5LC2gZySEQknihAR3n7a4mecvg"
            },
            email, password
        })
            .then((res) => {
                const userLogged = res.data.data.users.find((user) => email === user.email);
                localStorage.setItem('user', JSON.stringify(userLogged));
            })
            .catch(() => {
            });
    }, []);

    const handleUpdateDisplayName = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            await updateProfile(user, {displayName: name});
            setUserData({...userData, displayName: name});
            setName("");
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            await updateEmail(user, email);
            setUserData({...userData, email});
            setEmail("");
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            await updatePassword(user, password);
            setPassword("");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Navbar/>
            <div className="account-page">

                {id !== undefined && (
                    <>
                        <div className="user-info">
                            <div className="displayName"> Nom : { name } { forename }</div>
                            <div className="userData">Email: {email}</div>
                        </div>
                        <div className="user-actions">
                            <button onClick={() => setShowForm(!showForm)}>Modifier</button>
                        </div>
                        {showForm && (
                            <form className="update-form" onSubmit={() => {
                                setShowForm(false);
                            }}>
                                <div className="form-group">
                                    <label>Prénom :</label>
                                    <Input type="text" value={name}
                                           onChange={(e) => setName(e)}/>
                                </div>
                                <div className="form-group">
                                    <label>Nom de famille :</label>
                                    <Input type="text" value={forename}
                                           onChange={(e) => setForename(e)}/>
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <Input type="email" value={email} onChange={(e) => setEmail(e)}/>
                                </div>
                                <div className="form-group">
                                    <label>Mot de passe:</label>
                                    <Input type="password" value={password}
                                           onChange={(e) => setPassword(e)}/>
                                </div>
                                <Button type="button" onClick={updateUser}>Enregistrer les modifications</Button>
                                {error && <p className="error-message">{error}</p>}
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
export {Account};