import React from "react";
import { Login } from "../src/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "../src/Dashboard/Dashboard";
import {Account} from "../src/Account/Account"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="Account" element={<Account/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;