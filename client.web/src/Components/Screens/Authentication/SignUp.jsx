import React, { memo, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi'; 
import { useNavigate } from 'react-router-dom';
import BackGround from '../BackGround';
import "../../Styles/SignUp.css";
import { SignUpConnection } from '../../../Connection/Authentication.js';
import Alert from '../Alert';
import Loading from '../Loading.jsx';

const SignUp = memo(({ darkMode }) => {
  const [ShowAlert, setShowAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const togglePassword = () => setShowPassword(!showPassword); 

  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const [isEmptyFirstName, setIsEmptyFirstName] = useState(false);
  const [isEmptyLastName, setIsEmptyLastName] = useState(false);
  const [isEmptyEmail, setIsEmptyEmail] = useState(false);
  const [isEmptyPassword, setIsEmptyPassword] = useState(false);
  const [isEmptyConfirmPassword, setIsEmptyConfirmPassword] = useState(false);


  const navigate = useNavigate();

  const HandleOnClick = async () => {
    setIsEmptyFirstName(false);
    setIsEmptyLastName(false);
    setIsEmptyEmail(false);
    setIsEmptyPassword(false);
    setIsEmptyConfirmPassword(false);

    if (!FirstName.trim()) {
      setShowAlert({ status: "alert", message: "Firstname is empty!" });
      setIsEmptyFirstName(true);
      setTimeout(() => setShowAlert(null), 5000);
      return;
    }

    if (!LastName.trim()) {
      setShowAlert({ status: "alert", message: "Lastname is empty!" });
      setIsEmptyLastName(true);
      setTimeout(() => setShowAlert(null), 5000);
      return;
    }

    if (!Email.trim()) {
      setShowAlert({ status: "alert", message: "Email is empty!" });
      setIsEmptyEmail(true);
      setTimeout(() => setShowAlert(null), 5000);
      return;
    }

    if (!Password.trim()) {
      setShowAlert({ status: "alert", message: "Password is empty!" });
      setIsEmptyPassword(true);
      setTimeout(() => setShowAlert(null), 5000);
      return;
    }

    if (!ConfirmPassword.trim()) {
      setShowAlert({ status: "alert", message: "Confirm password is empty!" });
      setIsEmptyConfirmPassword(true);
      setTimeout(() => setShowAlert(null), 5000);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@%^&*!?])[A-Za-z\d@%^&*!?]{8,}$/;

    if (!passwordRegex.test(Password)) {
      setShowAlert({ status: "error", message: "Password must be at least 8 characters long and include uppercase, lowercase, and a special character (@%^&*!?)." });
      setTimeout(() => setShowAlert(null), 5000);
      return;
    }

    if (Password !== ConfirmPassword) {
      setShowAlert({ status: "error", message: "Passwords do not match." });
      setIsEmptyConfirmPassword(true);
      setIsEmptyPassword(true);
      setTimeout(() => setShowAlert(null), 5000);
      return;
    }

    setLoading(true);
    const response = await SignUpConnection(FirstName, LastName, Email, Password);

    if (response) {
      setShowAlert({ status: "success", message: "Account created successfully!" });
      setTimeout(() => {
        navigate("/SignIn");
        setLoading(false);
      }, 1000);
    } else {
      setShowAlert({ status: "alert", message: "Sign up failed. Please try again." });
      setTimeout(() => {
        setShowAlert(null);
        setLoading(false);
      }, 5000);
    }
  };

  if (loading) {
    return <Loading darkMode={darkMode} />;
  }

  return (
    <main className={`signup ${darkMode ? 'dark' : 'light'}`}>
      <BackGround darkMode={darkMode} />

      {ShowAlert && (
        <Alert 
          status={ShowAlert.status}
          message={ShowAlert.message}
          onClose={() => setShowAlert(null)} />

      )}

      <div className="card">
        <h2 className="card-title">Sign Up</h2> 

        <div className="Name">
          <input
            type="text"
            placeholder="First Name"
            className={`input ${isEmptyFirstName ? 'error-input' : ''}`}
            value={FirstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className={`input ${isEmptyLastName ? 'error-input' : ''}`}
            value={LastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          className={`input ${isEmptyEmail ? 'error-input' : ''}`}
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`input ${isEmptyPassword ? 'error-input' : ''}`}
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="show-hide-btn"
            onClick={togglePassword}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <div className="password-container">
          <input
            type="password"
            placeholder="Confirm Password"
            className={`input ${isEmptyConfirmPassword ? 'error-input' : ''}`}
            value={ConfirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

        </div>

        <button className="signup-btn" onClick={HandleOnClick}>Sign Up</button>
      </div>
    </main>
  );
});

export default SignUp;
