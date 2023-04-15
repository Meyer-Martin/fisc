import "firebase/auth";
import {
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    createUserWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import {useEffect, useRef, useState} from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import "rsuite/dist/rsuite.min.css";
import "./Login.css";
import { useNavigate } from 'react-router-dom';
import {doc, setDoc, updateDoc} from "firebase/firestore";

function Login() {
    const [email, setEmail] = useState("martin@gmail.com");
    const [name, setName] = useState("Martin");
    const [password, setPassword] = useState("test123");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                if (user) {
                    storeUidLocalStorage(user);
                    updateLastConnection(user);
                    redirectToDashboard(navigate);
                }
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
            });
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                storeEmailAndRole(user);
                await updateProfile(user, {
                    displayName: name,
                });

                if (user) {
                    storeUidLocalStorage(user);
                    updateLastConnection(user);
                    redirectToDashboard(navigate);
                }
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
            });
    };

    const loginBtn = useRef();
    const signupBtn = useRef();

    useEffect(() => {
        const handleLoginClick = (e) => {
            let parent = e.target.parentNode.parentNode;
            Array.from(e.target.parentNode.parentNode.classList).find((element) => {
                if (element !== 'slide-up') {
                    parent.classList.add('slide-up');
                } else {
                    signupBtn.current.parentNode.classList.add('slide-up');
                    parent.classList.remove('slide-up');
                }
            });
        };

        const handleSignupClick = (e) => {
            let parent = e.target.parentNode;
            Array.from(e.target.parentNode.classList).find((element) => {
                if (element !== 'slide-up') {
                    parent.classList.add('slide-up');
                } else {
                    loginBtn.current.parentNode.parentNode.classList.add('slide-up');
                    parent.classList.remove('slide-up');
                }
            });
        };

        loginBtn?.current.addEventListener('click', handleLoginClick);
        signupBtn?.current.addEventListener('click', handleSignupClick);

        return () => {
            if (loginBtn.current) {
                loginBtn.current.removeEventListener('click', handleLoginClick);
            }
            if (signupBtn.current) {
                signupBtn.current.removeEventListener('click', handleSignupClick);
            }
        };
    }, []);

    return (
        <div className="loginAll loginPage">
            <div className="form-structor">
                <div className="signup">
                    <h2 ref={signupBtn} className="form-title" id="signup"><span>or</span>Sign up</h2>
                    <div className="form-holder">
                        <input type="text" className="input" value={name} onChange={e => setName(e.target.value)}/>
                        <input type="text" className="input" value={email} onChange={e => setEmail(e.target.value)}/>
                        <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)}/>
                    </div>
                    {error && <p className="error-message">{convertErrorMessage(error)}</p>}
                    <button onClick={handleSignUp} className="submit-btn">Sign up</button>
                </div>
                <div className="login slide-up">
                    <div className="center">
                        <h2 ref={loginBtn} className="form-title" id="login"><span>or</span>Log in</h2>
                        <div className="form-holder">
                            <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)}/>
                            <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        {error && <p className="error-message">{convertErrorMessage(error)}</p>}
                        <button onClick={handleLogin} className="submit-btn">Log in</button>
                        <button onClick={() => signInWithGoogle(navigate)} className="submit-btn">Connexion avec Google</button>
                        <button onClick={() => signInWithGithub(navigate)} className="submit-btn">Connexion avec Github</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function signInWithGoogle(navigate) {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            storeEmailAndRole(user);

            if (user) {
                storeUidLocalStorage(user);
                updateLastConnection(user);
                redirectToDashboard(navigate);
            }
        })
        .catch((error) => {
            convertErrorMessage(error);
        });
}
function signInWithGithub(navigate) {
    const provider = new GithubAuthProvider();

    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            storeEmailAndRole(user);
            if (user) {
                storeUidLocalStorage(user);
                updateLastConnection(user);
                redirectToDashboard(navigate);
            }
        })
        .catch((error) => {
            convertErrorMessage(error);
        });
}

function redirectToDashboard(navigate) {
    navigate('/dashboard');
}

function storeEmailAndRole(user) {
    const userRef = doc(db, "users", user.uid);
    setDoc(userRef, {
        role: "USER",
        email: user.email,
        dateCreationAccount: new Date(),
        status: true
    });
}

function convertErrorMessage(errorMessage) {
    switch (errorMessage) {
        case 'Firebase: Error (auth/user-not-found).':
            return 'Cet utilisateur n\'existe pas';
        case 'Firebase: Error (auth/wrong-password).':
            return 'Email ou mot de passe incorrect';
        case 'Firebase: Error (auth/email-already-in-use).':
            return "L'email est déjà utilisé par un autre compte";
        case 'Firebase: Error (auth/weak-password).':
            return 'Le mot de passe doit avoir au moins 6 caractères';
        default:
            return errorMessage;
    }
}

function updateLastConnection(user) {
    const userRef = doc(db, "users", user.uid);
    updateDoc(userRef, {
        lastConnection: new Date()
    });
}

function storeUidLocalStorage(user) {
    localStorage.setItem('uid', user.uid);
}
export { Login };
