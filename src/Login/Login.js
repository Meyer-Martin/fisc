import "firebase/auth";
import {useEffect, useRef, useState} from 'react';
import "rsuite/dist/rsuite.min.css";
import "./Login.css";
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {url} from "../environment";

function Login() {
    const [name, setName] = useState("Martin");
    const [forename, setForename] = useState("Meyer de 5ème6");
    const [email, setEmail] = useState("a.c@gmail.com");
    const [password, setPassword] = useState("azerty");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post(`${url}/user/login`, {
            email, password
        })
            .then((res) => {
               const token = res.data.data.token;
                localStorage.setItem('token', token);
                axios.get(`${url}/user`, {
                    headers: {
                        "Authorization": token
                    }
                })
                .then((res) => {
                    const userLogged = res.data.data.users.find((user) => email === user.email);
                    localStorage.setItem('id', JSON.stringify(userLogged.id));
                    redirectToDashboard(navigate);
                });
            })
            .catch(() => {
                setError('Une erreur s\'est produite');
            });
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        axios.post(`${url}/user`, {
            name,
            forename,
            email,
            password,
            isadmin: false,
            status: true
        })
            .then((res) => {
                const token = res.data.data.token;
                localStorage.setItem('token', token);
                localStorage.setItem('id', res.data.data.id);
                redirectToDashboard(navigate);
            })
            .catch(() => {
                setError('Une erreur s\'est produite');
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
                        <input type="text" className="input" value={forename} onChange={e => setForename(e.target.value)}/>
                        <input type="text" className="input" value={email} onChange={e => setEmail(e.target.value)}/>
                        <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)}/>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button onClick={handleSignUp} className="submit-btn">Sign up</button>
                </div>
                <div className="login slide-up">
                    <div className="center">
                        <h2 ref={loginBtn} className="form-title" id="login"><span>or</span>Log in</h2>
                        <div className="form-holder">
                            <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)}/>
                            <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button onClick={handleLogin} className="submit-btn">Log in</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function redirectToDashboard(navigate) {
    navigate('/dashboard');
}

export { Login };
