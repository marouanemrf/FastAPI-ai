import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Home from "./Components/Screens/About/Home";
import NavBar from "./Components/Screens/About/NavBar";
import "./index.css"
import SignIn from "./Components/Screens/Authentication/SignIn";
import SignUp from "./Components/Screens/Authentication/SignUp";
import VerificationOfMail from "./Components/Screens/Authentication/VerificationOfMail";
import VerificationOfCode from "./Components/Screens/Authentication/VerificationOfCode";
import ResetPassword from "./Components/Screens/Authentication/ResetPasswor";
import HomeChat from "./Components/Screens/Home/HomeChat";
import History from "./Components/Screens/History/History";
import CreateChat from "./Components/Screens/Home/CreateChat";
import Archive from "./Components/Screens/Archive/Archive";
import Profile from "./Components/Screens/Profile/ProfileHome";
import VerificationOfAccount from "./Components/Screens/FirstAuthentication/VerificationAccount";
import CompletingInformation from "./Components/Screens/FirstAuthentication/CompletingInformation";
import { UserProvider } from "./Components/UseContext";
import ProfileModification from "./Components/Screens/Profile/ProfileModification";
import SignInCard from "./Components/Screens/Authentication/SignInCard";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <UserProvider>
      <BrowserRouter> 
        <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="/SignIn" element={<SignIn darkMode={darkMode} />} />
          <Route path="/VerificationAccount" element={<VerificationOfAccount darkMode={darkMode} />} />
          <Route path="/CompletingInformation" element={<CompletingInformation darkMode={darkMode} />} />
          <Route path="/SignUp" element={<SignUp darkMode={darkMode} /> } /> 
          <Route path="/VerificationOfMail" element={<VerificationOfMail darkMode={darkMode} />} />
          <Route path="/VerificationOfCode" element={<VerificationOfCode darkMode={darkMode} />} />
          <Route path="/ResetPassword" element={<ResetPassword darkMode={darkMode} />} />
          <Route path="/HomeChat" element={<HomeChat darkMode={darkMode} />} />
          <Route path="/History" element={<History darkMode={darkMode} />} />
          <Route path="/NewRoom" element={<CreateChat darkMode={darkMode} /> } /> 
          <Route path="/Archive" element={<Archive darkMode={darkMode} /> } />
          <Route path="/Profile" element={<Profile darkMode={darkMode} />} />
          <Route path="/ProfileModification" element={<ProfileModification darkMode={darkMode} />} />
          <Route path="/SignInCard" element={<SignInCard darkMode={darkMode} /> } />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
