import React from "react";
import { Login } from "./Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;