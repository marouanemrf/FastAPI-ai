import React, { memo, useEffect, useState } from 'react';
import BackGround from '../BackGround';
import "../../Styles/CompletingInformation.css";
import { CompletingInfo } from '../../../Connection/Authentication';
import { useNavigate, useLocation } from 'react-router-dom';
import Loading from '../Loading';
import Alert from '../Alert';

const CompletingInformation = memo(({ darkMode }) => {
  const [nickname, setNickname] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [ShowAlert, setShowAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    if (location.state) {
      setUser(location.state.user);
      setToken(location.state.token);
    } else {
      setShowAlert({ status: 'alert', message: 'Something went wrong, please retry!' });
      setTimeout(() => navigate('/'), 3000);
    }
  }, [location, navigate]);

  // Generate a random nickname
  const generateNickname = () => {
    const randomNicknames = ['Traveler', 'Explorer', 'Nomad', 'Visionary', 'Pioneer'];
    const randomNickname = randomNicknames[Math.floor(Math.random() * randomNicknames.length)];
    setNickname(randomNickname);
  };

  // Handle the file change and convert the image to Base64
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // Set the Base64 string to profilePic state
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle the Save button logic
  const handleSave = async () => {
    console.log('Saved nickname:', nickname);
    console.log('Saved picture (base64):', profilePic);
    console.log('ID: ', user.id);

    setLoading(true);
    try {
      // Call the CompletingInfo function to save user data
      const data = await CompletingInfo(user.id, profilePic, nickname); 
      if (!data) {
        setShowAlert({ status: 'alert', message: 'Something went wrong, please retry!' });
        setTimeout(() => setShowAlert(null), 5000);
      } else {
        setTimeout(() => {
          setLoading(false);
          navigate("/HomeChat", { state: { user: data.user, token: token } });
        }, 1000);
      }
    } catch (error) {
      setLoading(false);
      setShowAlert({ status: 'alert', message: 'Something went wrong, please retry!' });
      setTimeout(() => setShowAlert(null), 5000);
    }
  };

  // Handle the Skip button logic
  const handleSkip = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/HomeChat", { state: { user: user, token: token } });
    }, 1000);
  };

  // If the page is loading, show the loading spinner
  if (loading) {
    return <Loading darkMode={darkMode} />;
  }

  return (
    <main className={`CompletingInformation ${darkMode ? 'dark' : 'light'}`}>
      <BackGround darkMode={darkMode} />

      {ShowAlert && (
        <Alert
          status={ShowAlert.status}
          message={ShowAlert.message}
          onClose={() => setShowAlert(null)}
        />
      )}

      <div className="form-container">
        <h2 className="title">Complete Your Information</h2>

        <div className="input-group">
          <label htmlFor="profile-pic">Profile Picture:</label>
          <div className="file-input-wrapper">
            {profilePic && (
              <img
                src={profilePic} // This is the Base64 string
                alt="Profile Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            )}
          </div>

          <input
            type="file"
            id="profile-pic"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="nickname-input"
          />
          <button className="generate-btn" onClick={generateNickname}>
            Generate Nickname
          </button>
        </div>

        <div className="actions">
          <button className="skip-btn" onClick={handleSkip}>Skip</button>
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </main>
  );
});

export default CompletingInformation;
