import React, { memo, useRef, useState, useEffect } from 'react';
import BackGround from '../BackGround';
import { useNavigate, useLocation } from 'react-router-dom';
import "../../Styles/VerificationOfCode.css";
import Loading from '../Loading';
import Alert from '../Alert';

const VerificationOfCode = memo(({ darkMode }) => {
  const inputsRef = useRef([]);
  const [userCode, setUserCode] = useState('');
  const [ShowAlert, setShowAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  const [expectedCode, setExpectedCode] = useState(null);

  useEffect(() => {
    if (location.state && location.state.Code) {
      console.log("frontend Code: ", location.state.Code)
      setExpectedCode(location.state.Code);
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
    if (!expectedCode) return; 

    setLoading(true);

    console.log("user Code: ", userCode, " exeptedCode: ", expectedCode);

    if (userCode.trim() === String(expectedCode).trim()) {
      setShowAlert({ status: 'success', message: 'Correct verification code' });
      setTimeout(() => {
        setLoading(false);
        navigate("/ResetPassword", { state: { Code: userCode } });
      }, 1000);
    } else {
      
      setShowAlert({ status: 'error', message: 'Verification code not correct!' });
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
        <h2 className="card-title">Code Verification</h2>

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

export default VerificationOfCode;
