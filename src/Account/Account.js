import React, {useEffect, useState} from "react";
import {getAuth, updateEmail, updatePassword, updateProfile} from "firebase/auth";
import {Navbar} from "../Navbar/Navbar";
import "./Account.css"
import {Button, Input} from 'rsuite';

function Account() {
    const [userData, setUserData] = useState({});
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user !== null) {
            setUserData({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                uid: user.uid,
            });
            setDisplayName(user.displayName);
            setEmail(user.email);
        }
    }, []);

    const handleUpdateDisplayName = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            await updateProfile(user, {displayName});
            setUserData({...userData, displayName});
            setDisplayName("");
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

                {userData.uid !== undefined && (
                    <>
                        <div className="user-info">
                            <div className="displayName"> Nom d'affichage: {userData.displayName}</div>
                            <div className="userData">Email: {userData.email}</div>
                            <div className="emailVerified">Email vérifié: {userData.emailVerified ? "Oui" : "Non"}</div>
                        </div>
                        <div className="user-actions">
                            <button onClick={() => setShowForm(!showForm)}>Modifier</button>
                        </div>
                        {showForm && (
                            <form className="update-form" onSubmit={(e) => {
                                handleUpdateDisplayName(e);
                                handleUpdateEmail(e);
                                handleUpdatePassword(e);
                                setShowForm(false);
                            }}>
                                <div className="form-group">
                                    <label>Nom d'affichage:</label>
                                    <Input type="text" value={displayName}
                                           onChange={(e) => setDisplayName(e)}/>
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
                                <Button type="submit">Enregistrer les modifications</Button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
export {Account};