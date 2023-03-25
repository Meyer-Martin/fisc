import React from "react";
import {Login} from "./Login/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Dashboard} from "./Dashboard/Dashboard";
import {Account} from "./Account/Account";
import {Admin} from "./Admin/Admin";

function App() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="account" element={<Account/>}/>
                    <Route path="admin" element={<Admin/>}/>

                </Routes>
            </BrowserRouter>
        )
}
export default App;