import React, { memo, useState } from 'react';
import BackGround from '../BackGround';
import { useNavigate } from 'react-router-dom';
import "../../Styles/VerificationOfMail.css";
import { VerifyEmailConnection } from '../../../Connection/Authentication';
import Loading from '../Loading';
import Alert from '../Alert';

const VerificationOfMail = memo(({ darkMode }) => {
  const [Email, setEmail] = useState("");
  const [isEmptyEmail, setIsEmptyEmail] = useState(false);
  const [ShowAlert, setShowAlert] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleClick = async () => {
    setIsEmptyEmail(false);
    
    if (!Email.trim()) {
      setShowAlert({ status: "alert", message: "Email is empty!" });
      setIsEmptyEmail(true);
      setTimeout(() => setShowAlert(null), 5000);
      return;
    }

    setLoading(true);
    try {
      const response = await VerifyEmailConnection(Email); 

      if (response === "None") {
        setShowAlert({ status: "error", message: "Account not found!" });
        setTimeout(() => {
          setShowAlert(null);
          setLoading(false);
        }, 5000);
      } else {
        setShowAlert({ status: "success", message: "Verification Email Sent!" });
        setTimeout(() => {
          setLoading(false);
          navigate("/VerificationOfCode", { state: { Code: response } } );
        }, 1000);
      }
    } catch (error) {
      setShowAlert({ status: "error", message: "An error occurred. Please try again!" });
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
    <main className={`verificationofmail ${darkMode ? 'dark' : 'light'}`}>
      <BackGround darkMode={darkMode} />

      {ShowAlert && (
        <Alert 
          status={ShowAlert.status}
          message={ShowAlert.message}
          onClose={() => setShowAlert(null)} 
        />
      )}

      <div className="card">
        <h2 className="card-title">Email Verification</h2>

        <input
          type="email"
          placeholder="Email"
          className={`input ${isEmptyEmail ? 'error-input' : ''}`}
          id="email"
          autoComplete="email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="verificationofmail-btn" onClick={handleClick}>Verify</button>
      </div>
    </main>
  );
});

export default VerificationOfMail;
