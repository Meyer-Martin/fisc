import React from "react";
import {Login} from "./Login/Login";
import {BrowserRouter, Route, Routes, useNavigate, redirect} from "react-router-dom";
import {Dashboard} from "./Dashboard/Dashboard";
import {Account} from "./Account/Account";
import {getAuth} from "firebase/auth";

function App() {
    const auth = getAuth();
    const user = auth.currentUser;




 /*   if (user) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="account" element={<Account/>}/>
                </Routes>
            </BrowserRouter>
        )
    } else {

        return <redirect to="/" />

        // <RedirectToLogin2 />
    }
}
*/
function RedirectToLogin() {
    const navigate = useNavigate();
    navigate('/');
}

export default App;