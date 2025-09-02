import React, { memo, useRef, useState, useEffect } from 'react';
import BackGround from '../BackGround';
import { useNavigate, useLocation } from 'react-router-dom';
import "../../Styles/VerificationOfCode.css";
import Loading from '../Loading';
import Alert from '../Alert';
import { ValidationAccount } from '../../../Connection/Authentication';

const VerificationOfAccount = memo(({ darkMode }) => {
  const inputsRef = useRef([]);
  const [userCode, setUserCode] = useState('');
  const [ShowAlert, setShowAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [code, setCode] = useState();


  useEffect(() => {
    if (location.state ) {
      setUser(location.state.user);
      setToken(location.state.token);
      setCode(location.state.code);
      console.log("code fil verification: " + location.state.code);
    } else {
      setShowAlert({ status: 'alert', message: 'Somting wrong please retry!' });
      setTimeout(() => navigate('/'), 3000); 
    }
  }, [location, navigate]);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value && index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
    const updatedCode = [...inputsRef.current].map((input) => input.value).join('');
    setUserCode(updatedCode);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleOnClick = () => {
    setLoading(true);
    console.log("usercode: " + userCode + " code: " + code);
    if (userCode.trim() === String(code).trim()) {
      setShowAlert({ status: 'success', message: 'Correct verification code' });
      const isValidate = ValidationAccount(String(code));

      console.log("hna");
      if (isValidate) {
        console.log("valid: ", isValidate);
        setTimeout(() => {
          setLoading(false);
          navigate("/CompletingInformation", { state: { user: user, token: token} });
        }, 1000);
      } else {
        setShowAlert({ status: 'alter', message: 'Something wrong, please try again!' });
        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 1000);
      }

    } else {
      setLoading(false);
      console.log("user");
      setShowAlert({ status: 'error', message: 'Verification code not correct!' });
      setTimeout(() => {
        setShowAlert(null);
      }, 5000);
    }
  };

  if (loading) {
    return <Loading darkMode={darkMode} />;
  }

  return (
    <main className={`verificationofCode ${darkMode ? 'dark' : 'light'}`}>
      <BackGround darkMode={darkMode} />

      {ShowAlert && (
        <Alert 
          status={ShowAlert.status}
          message={ShowAlert.message}
          onClose={() => setShowAlert(null)} 
        />
      )}

      <div className="card">
        <h2 className="card-title">Account Verification</h2>

        <div className="password">
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

        <button className="verificationofCode-btn" onClick={handleOnClick}>Verify</button>
      </div>
    </main>
  );
});

export default VerificationOfAccount;
