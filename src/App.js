import React from "react";
import {Login} from "./Login/Login";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import {Dashboard} from "./Dashboard/Dashboard";
import {Account} from "./Account/Account";
import {getAuth} from "firebase/auth";

function App() {
    const auth = getAuth();
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log(user);
    const navigate = useNavigate();

    return (
        <BrowserRouter>
            <Routes>
                {user === null ? (
                    <Route path="/" element={<Login/>}/>
                ) : (
                    <>
                        <Route path="/" element={<Dashboard/>} />
                        <Route path="account" element={<Account/>} />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    )
}
function RedirectToLogin(navigate) {
    navigate('/');
}

function RedirectToDashboard(navigate) {
    navigate('/dashboard');
}
export default App;