import React from "react";
import {Login} from "./Login/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Dashboard} from "./Dashboard/Dashboard";
import {Account} from "./Account/Account";

function App() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="account" element={<Account/>}/>
                </Routes>
            </BrowserRouter>
        )
}
export default App;