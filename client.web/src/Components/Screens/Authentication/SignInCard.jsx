import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import BackGround from '../BackGround';
import { SignInConnection, ValidationAccountMail } from '../../../Connection/Authentication.js';
import '../../Styles/SignInCard.css';
import Loading from '../Loading.jsx';
import Alert from '../Alert.jsx';
import { useUserContext } from '../../UseContext.jsx';
import Layer from '../Layer.jsx';

const SignInCard = ({ darkMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState('');
  const [password, setPassword] = useState('');
  const [ShowAlert, setShowAlert] = useState(null);
  const [isEmptyProfile, setIsEmptyProfile] = useState(false);
  const [isEmptyPassword, setIsEmptyPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { setUser, setToken } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const sessionExpiryTime = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  const togglePassword = () => setShowPassword(prev => !prev);

  // Effect for handling saved user session
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      const currentTime = new Date().getTime();
      const sessionStartTime = savedUser.loginTime || 0;

      setLoading(true);
      if (currentTime - sessionStartTime > sessionExpiryTime) {
        localStorage.removeItem('user');
        setTimeout(() => {
          navigate('/SignIn');
          setLoading(false);
        }, 1000);
      } else {
        if (savedUser.user.isverified) {
          if (savedUser.user.iscompleted) {
            setTimeout(() => {
              navigate('/HomeChat', { state: { user: savedUser.user, token: savedUser.token } });
              setLoading(false);
            }, 1000);
          } else {
            console.log("Il faut compléter le profil.");
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          }
        } else {
          console.log("Veuillez vérifier votre compte.");
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      }
    }
  }, [navigate]);

  const HandleOnClick = async () => {
    setIsEmptyProfile(false);
    setIsEmptyPassword(false);

    // Check if profile or password is empty
    if (!profile.trim()) {
      setShowAlert({ status: "alert", message: "Profile is empty!" });
      setIsEmptyProfile(true);
      setTimeout(() => setShowAlert(null), 5000);
      return;
    }

    if (!password.trim()) {
      setShowAlert({ status: "alert", message: "Password is empty!" });
      setIsEmptyPassword(true);
      setTimeout(() => setShowAlert(null), 5000);
      return;
    }

    setLoading(true);
    try {
      const data = await SignInConnection(profile, password);
      if (!data) {
        setLoading(false);
        setShowAlert({ status: "error", message: "Profile or Password is incorrect!" });
        setTimeout(() => {
          setShowAlert(null);
        }, 5000);
      } else {
        setUser(data.user);
        setToken(data.token);
        navigate(location.state?.from || 1);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error: ", error.message);
    }
  };

  if (loading) {
    return <Loading darkMode={darkMode} />;
  }

  return (
    <main className={`signinCard ${darkMode ? 'dark' : 'light'}`}>
      <Layer darkMode={darkMode} />

      {ShowAlert && (
        <Alert
          status={ShowAlert.status}
          message={ShowAlert.message}
          onClose={() => setShowAlert(null)}
        />
      )}

      <div className="card_">
        <h2 className="card-title">Sign In</h2>

        <input
          placeholder="Profile"
          className={`input ${isEmptyProfile ? 'error-input' : ''}`}
          id="Profile"
          autoComplete="username"
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          disabled={loading}
        />

        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className={`input ${isEmptyPassword ? 'error-input' : ''}`}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="show-hide-btn"
            onClick={togglePassword}
            disabled={loading}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <div className="card-options">
          <label className="checkbox-container" htmlFor="remember">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <span>Remember me</span>
          </label>

          <Link to="/VerificationOfMail" className="forgot-password">
            Forget password?
          </Link>
        </div>

        <button
          className="signin-btn"
          onClick={HandleOnClick}
        >
          Sign In
        </button>
      </div>
    </main>
  );
};

export default SignInCard;
