import React from "react";
import { Login } from "./Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;