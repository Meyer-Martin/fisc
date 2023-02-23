import React, { useEffect, useState } from "react";
import { getAuth, updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { Navbar } from "../Navbar/Navbar";
import "./Account.css";

function Account() {
    const [userData, setUserData] = useState({});
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;
        let promises = [];

        if (displayName !== userData.displayName) {
            promises.push(updateProfile(user, { displayName }));
        }

        if (email !== userData.email) {
            promises.push(updateEmail(user, email));
        }

        if (password !== "") {
            promises.push(updatePassword(user, password));
        }

        Promise.all(promises)
            .then(() => {
                setError(null);
                alert("Modifications enregistrées avec succès !");
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        switch (name) {
            case "displayName":
                setDisplayName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <Navbar />
            <div className="account-page">
                {userData.uid !== undefined && (
                    <>
                        <div className="user-info">
                            <div className="displayName"> Nom d'affichage: {userData.displayName}</div>
                            <div className="userData">Email: {userData.email}</div>
                            <div className="emailVerified">Email vérifié: {userData.emailVerified ? "Oui" : "Non"}</div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="displayName">Nom d'affichage:</label>
                                <input type="text" id="displayName" name="displayName" value={displayName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input type="email" id="email" name="email" value={email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Mot de passe:</label>
                                <input type="password" id="password" name="password" value={password} onChange={handleChange} />
                            </div>
                            <button type="submit">Enregistrer les modifications</button>
                            {error && <div className="error">{error}</div>}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export { Account };
