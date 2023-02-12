import React from "react";
import { Login } from "../src/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "../src/Dashboard/Dashboard";
import { Account } from "../src/Account/Account";
import { getAuth } from "firebase/auth";

function App() {
   const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="account" element={<Account />} />
          </Routes>
        </BrowserRouter>
       )
    } else {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
      )
    }
  };

export default App;