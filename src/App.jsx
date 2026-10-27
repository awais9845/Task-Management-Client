import React from "react";
import SignUp from "./pages/SingUp.jsx";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login.jsx";
import { AllTasks } from "./pages/AllTasks.jsx";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="dark"
        duration={3000}
      />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<AllTasks />} />
      </Routes>
    </>
  );
};

export default App;
