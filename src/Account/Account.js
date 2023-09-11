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
        const user =  JSON.parse(localStorage.getItem('user'));
        setId(user.id);
        setName(user.name);
        setForename(user.forename);
        setEmail(user.email);
        setPassword(user.password);
    }, []);

    function updateUser() {
        const headers = {
            "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF6ZXJ0LmF6ZXJjQGdtYWlsLmNvbSIsImlhdCI6MTY5NDQzMzk5NywiZXhwIjoxNjk0NDQ0Nzk3fQ.bLb-8llqFb_sFyrtVe4V1uOQZ3TF_gHJFmMmdhfIiRM"
        };

        axios.put(`http://localhost:3000/user/${id}`, {
            name, forename, email, password
        }, {
            headers: headers
        })
            .then((res) => {
                console.log(res);
                const updatedUser = { name, forename, email, password };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setName(name);
                setForename(forename);
                setEmail(email);
                setPassword(password);
            })
            .catch((error) => {
                console.error(error);
                setError('Une erreur s\'est produite');
            });
    }

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