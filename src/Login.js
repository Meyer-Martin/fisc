import "firebase/auth";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from 'react';
import { auth } from './firebaseConfig';
import { Input, Button } from 'rsuite';
import "rsuite/dist/rsuite.min.css";
import { Logo } from "./Logo";
import "./Login.css";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);


    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                if (user) {
                    redirectToDashboard();
                }
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
            });
    };

    return (
        <div className="block">
            <form onSubmit={handleLogin}>
                <div className="logo">
                    <Logo></Logo>
                </div>
                <Input
                    size="md"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e)}
                />
                <Input
                    size="md"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e)}
                />
                <Button type="submit" appearance="default">Connexion</Button>
                <Button onClick={signInWithGoogle} appearance="primary">Connexion avec Google</Button>
                {error && <p className="error-message">{convertErrorMessage(error)}</p>}
            </form>
        </div>
    );
}

function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log(user);
            if (user) {
                redirectToDashboard();
            }
        }).catch((error) => {
            convertErrorMessage(error);
        });
}

// TODO Rediriger vers la page /dashboard
function redirectToDashboard() {

}

function convertErrorMessage(errorMessage) {
    switch (errorMessage) {
        case 'Firebase: Error (auth/user-not-found).':
            return 'Cet utilisateur n\'existe pas';
        case 'Firebase: Error (auth/wrong-password).':
            return 'Email ou mot de passe incorrect';
        default:
            return errorMessage;
    }

}

export { Login };