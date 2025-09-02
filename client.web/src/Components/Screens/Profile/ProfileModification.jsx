import React, { memo, useEffect, useRef, useState } from 'react';
import "../../Styles/ProfileModification.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useUserContext } from '../../UseContext';
import Layer from '../Layer';
import { MdDelete } from "react-icons/md";
import { DeleteProfile, DeleteRequest, UpdateProfile, updateRequest } from '../../../Connection/Authentication';
import Alert from '../Alert';
import Loading from '../Loading';
import { IoIosClose } from "react-icons/io";
import SignInCard from '../Authentication/SignInCard';



const ProfileModification = memo(({ darkMode }) => {
  const {user = {}, token, setUser, setToken} = useUserContext();

  const navigate = useNavigate();
  const location = useLocation();

  const [firstname, setFirstname] = useState(user?.firstname);
  const [lastname, setLastname] = useState(user?.lastname);
  const [nickname, setNickname] = useState(user?.nickname);
  const [profilePic, setProfilePic] = useState(user?.pic && user?.pic.startsWith('data:image/') ? user?.pic : null);
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationCard, setShowVerificationCard] = useState(false);
  const [showDeletProfile, setshowDeleteProfile] = useState(false);
  const [alert, setAlert] = useState(null);
  const [load, setLoad] = useState(false);
  const [code, setCode] = useState();
  const inputsRef = useRef([]);

  const [isFirstnameEmpty, setIsFirstnameEmpty] = useState(false);
  const [isLastnameEmpty, setIsLastnameEmpty] = useState(false);
  const [isEmailEmpty, setIsEmailEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [isConfirmPasswordEmpty, setIsConfirmPasswordEmpty] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (!user || !user.id || !token || token.trim() === "") {
      navigate("/SignInCard", { state: { from: location } });
    }
  }, [user, token, navigate, location]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const HandleDeleteProfileRequest = async () => {
    setLoad(true);
    const code = await DeleteRequest(token, user.id);
    
    console.log("code: " + code);
    if (!code) {
      setLoad(false);
      setAlert({ status: "Alert", message: "Something wrong, please retry!" });
      setTimeout(() => setAlert(null), 5000);
    } else {
      setCode(code);
      setAlert({ status: "success", message: "Check your email box a verification code sent!" });
      setTimeout(() => {
        setLoad(false); 
        setshowDeleteProfile(true);}, 
      500);
    }
  };

  const HandleDeleteProfile = async () => {
    setLoad(true);
    const isDelete = await DeleteProfile(token, code);

    if (isDelete) {
      setAlert({ status: "success", message: "Profile has Deleted successfuly!" });
      setTimeout(() => {
        localStorage.removeItem('user');
        sessionStorage.clear();
        setLoad(false);
        setAlert(null);
        navigate("/");
      }, 1000);
    } else {
      setLoad(false);
      setAlert({ status: "Alert", message: "Something wrong, please retry!" });
      setTimeout(() => setAlert(null), 5000);
    }
  }

  const HandleModifyRequest = async () => {

    setIsFirstnameEmpty(false);
    setIsLastnameEmpty(false);
    setIsEmailEmpty(false);
    setIsPasswordEmpty(false);
    setIsConfirmPasswordEmpty(false);
    setLoad(true);


    if (!firstname.trim()) {
      setLoad(false);
      setIsFirstnameEmpty(true);
      setAlert({ status: 'error', message: "Firstname feild is empty!" });
      setTimeout(() => setAlert(null), 5000);
      return;
    }

    if (!lastname.trim()) {
      setLoad(false);
      setIsLastnameEmpty(true);
      setAlert({ status: 'error', message: "Lastname feild is empty!" });
      setTimeout(() => setAlert(null), 5000);
      return;
    }

    if (!email.trim()) {
      setLoad(false);
      setIsEmailEmpty(true);
      setAlert({ status: 'error', message: "Email feild is empty!" });
      setTimeout(() => setAlert(null), 5000);
      return;
    }

    if (password && !(password || "").trim()) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@%^&*!?])[A-Za-z\d@%^&*!?]{8,}$/;
      if (!passwordRegex.test(password)) {
        setLoad(false);
        setIsPasswordEmpty(true);
        setAlert({ status: "error", message: "Password must be at least 8 characters long and include uppercase, lowercase, and a special character (@%^&*!?)." });
        setTimeout(() => setAlert(null), 5000);
        return;
      }

      if (password !== confirmPassword) {
        setLoad(false);
        setAlert({ status: "error", message: "Passwords do not match." });
        setIsConfirmPasswordEmpty(true);
        setIsPasswordEmpty(true);
        setTimeout(() => setAlert(null), 5000);
        return;
      }

    }

    const code = await updateRequest(token, user.id);
    console.log("code: " + code);
    if (!code) {
      setLoad(false);
      setAlert({ status: "Alert", message: "Something wrong, please retry!" });
      setTimeout(() => setAlert(null), 5000);
    } else {
      setCode(code);
      setAlert({ status: "success", message: "Check your email box a verification code sent!" });
      setTimeout(() => {
        setLoad(false); 
        setShowVerificationCard(true);}, 
      500);
    }
  };

  const HandleModify = async () => {
    setLoad(true);

    if (!code) {
        setLoad(false);
        return;
    }

    const updateUser = await UpdateProfile(profilePic, nickname, firstname, lastname, 
      email, password, code, token);
    console.log("user: ", updateUser);

    if (!updateUser) {
      setLoad(false);
      setAlert({ status: "Alert", message: "Something wrong, please retry!" });
      setTimeout(() => setAlert(null), 5000);
    } else {
      setUser(updateUser)
      setAlert({ status: "success", message: "Profile has moified successfuly!" });
      setTimeout(() => {
        setLoad(false);
        setAlert(null);
        navigate("/Profile");
      }, 1000);
    }
  }

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value && index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  if (load) {
    return <Loading darkMode={darkMode} />
  }

  return (
    <main className={`ProfileModification ${darkMode ? 'dark' : ''}`}>
      {alert && (
        <Alert
          status={alert.status}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="Card">
        {/* Input container with left and right sections */}
        <div className="input-container">
          {/* Left Side */}
          <div className="left-side">
            <div className="input-group">
              <label htmlFor="profile-pic">Profile Picture:</label>
              <div className="file-input-wrapper">
                <button className="closeBtn" onClick={() => setProfilePic(null)} style={{top: "10%", right: "100px", color: 'red', zIndex:1}}> <IoIosClose /> </button>
                {profilePic && <img src={profilePic} alt="Profile Preview" />}
              </div>
              <input
                type="file"
                id="profile-pic"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="firstname">Firstname:</label>
              <input
                type="text"
                id="firstname"
                className={`input ${isFirstnameEmpty ? 'errorinput' : ''}`}
                placeholder="Enter your firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="lastname">Lastname:</label>
              <input
                type="text"
                id="lastname"
                className={`input ${isLastnameEmpty ? 'errorinput' : ''}`}
                placeholder="Enter your lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="right-side">
            <div className="input-group">
              <label htmlFor="nickname">Nickname:</label>
              <input
                type="text"
                id="nickname"
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                className={`input ${isEmailEmpty ? 'errorinput' : ''}`}
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`input ${isPasswordEmpty ? 'errorinput' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="show-hide-btn-"
                onClick={togglePassword}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="input-group">
              <label htmlFor="password">Confirm Password:</label>
              <input
                type="password"
                className={`input ${isConfirmPasswordEmpty ? 'errorinput' : ''}`}
                id="Cpassword"
                placeholder="Enter your confirmed password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="delete-group">
              <button className="Delete-Btn" onClick={HandleDeleteProfileRequest}><MdDelete />Delete Profile</button>
            </div>
          </div>
        </div>

        {/* Modify & Cancel buttons */}
        <div className="buttons">
          <button className="Modify-Btn" onClick={HandleModifyRequest}>
            Modify
          </button>

          <button className="Cancel-Btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>

        {/* Verification Card (Initially hidden) */}
        {showVerificationCard && (
          <>
            <Layer />
            <div className="Verification-Card">
              <h2 className="card-title">Verification Code</h2>

              <div className="verification-code">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    maxLength="1"
                    type="text"
                    className={`input${i + 1}`}
                    name={`code${i + 1}`}
                    ref={(el) => (inputsRef.current[i] = el)}
                    onChange={(e) => handleInput(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                  />
                ))}
              </div>

              <div className="Card-Buttons">
                <button className="Modify-Btn" onClick={HandleModify}>
                    Modify
                </button>
              </div>
            </div>
          </>
        )}

        {showDeletProfile && (
          <>
            <Layer />
            <div className="Verification-Card">
              <h2 className="card-title">Verification Code</h2>

              <div className="verification-code">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    maxLength="1"
                    type="text"
                    className={`input${i + 1}`}
                    name={`code${i + 1}`}
                    ref={(el) => (inputsRef.current[i] = el)}
                    onChange={(e) => handleInput(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                  />
                ))}
              </div>

              <div className="Card-Buttons">
                <button className="Delete-Btn" onClick={HandleDeleteProfile}>
                    Delete Profile
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
});

export default ProfileModification;
