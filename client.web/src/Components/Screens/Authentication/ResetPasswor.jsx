import React, { memo, useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import BackGround from '../BackGround';
import "../../Styles/ResetPassword.css";
import { Reset_Password } from '../../../Connection/Authentication';
import Alert from '../Alert';
import Loading from '../Loading';

const ResetPassword = memo(({ darkMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);
  const [ShowAlert, setShowAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [isEmptyPassword, setIsEmptyPassword] = useState(false);
  const [isEmptyConfirmPassword, setIsEmptyConfirmPassword] = useState(false);
  const [Code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.Code) {
      console.log("frontend Code: ", location.state.Code);
      setCode(location.state.Code);
    } else {
      setShowAlert({ status: 'alert', message: 'Something went wrong, please retry!' });
      setTimeout(() => navigate('/'), 3000); 
    }
  }, [location, navigate]);

  const handleOnClick = async () => {
    setIsEmptyConfirmPassword(false);
    setIsEmptyPassword(false);
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@%^&*!?])[A-Za-z\d@%^&*!?]{8,}$/;

    if (!passwordRegex.test(Password)) {
      setShowAlert({ status: "error", message: "Password must be at least 8 characters long and include uppercase, lowercase, and a special character (@%^&*!?)." });
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

    if (Password !== ConfirmPassword) {
      setShowAlert({ status: "error", message: "Passwords do not match." });
      setIsEmptyConfirmPassword(true);
      setIsEmptyPassword(true);
      setTimeout(() => setShowAlert(null), 5000);
      return;
    }

    setLoading(true);

    const response = await Reset_Password(Code, Password);

    if (response) {
      setShowAlert({ status: "success", message: "Password reset successfully!" });
      setTimeout(() => {
        setLoading(false);
        navigate("/SignIn");
      }, 1000);
    } else {
      setShowAlert({ status: "alert", message: "Resetting password failed. Please try again." });
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
    <main className={`ResetPassword ${darkMode ? 'dark' : 'light'}`}>
      <BackGround darkMode={darkMode} />

      {ShowAlert && (
        <Alert 
          status={ShowAlert.status}
          message={ShowAlert.message}
          onClose={() => setShowAlert(null)} 
        />
      )}

      <div className="card">
        <h2 className="card-title">Reset Password</h2>

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`input ${isEmptyPassword ? 'error-input' : ''}`}
            id="password"
            autoComplete="new-password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
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
            id="confirm-password"
            autoComplete="new-password"
          />
        </div>

        <button className="ResetPassword-btn" onClick={handleOnClick}>Change password</button>
      </div>
    </main>
  );
});

export default ResetPassword;
