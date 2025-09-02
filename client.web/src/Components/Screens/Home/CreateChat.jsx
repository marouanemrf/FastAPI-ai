import React, { memo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layer from '../Layer';
import "../../Styles/CreateRoomCard.css"
import { CreateRoom } from '../../../Connection/RoomChat';
import { useUserContext } from '../../UseContext';
import Loading from '../Loading';
import Alert from '../Alert';
import SignInCard from '../Authentication/SignInCard';

const CreateChat = memo(({ darkMode }) => {
  const [error, setError] = useState('');
  const [name, setName] = useState("New Chat");
  const [showModal, setShowModal] = useState(true);
  const [alert, setAlert] = useState(null);
  const [load, setLoad] = useState(false);
  const [emptyName, setEmptyName] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { user = {}, token, setUser, setToken } = useUserContext();

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 12) {
      setName(value);
      setError('');
    } else {
      setAlert({ status: "error", message: "Max 12 characters allowed!" });
      setEmptyName(true);
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleSave = async () => {
    setEmptyName(false);
    setLoad(true);

    if (!name.trim()) {
      setEmptyName(true);
      setLoad(false);
      setAlert({ status: "alert", message: "Name cannot be empty!" });
      setTimeout(() => setAlert(null), 5000);
      return;
    }

    const response = await CreateRoom(user.id, token, name);

    if (response === "SignIn") {
      setAlert({ status: "alert", message: "Please try signing in again!" });
      setLoad(false);
      setTimeout(() => setAlert(null), 5000);
    } else {
      setTimeout(() => {
        setLoad(false);
        console.log("Room name in creation: ", response.name);
        navigate("/HomeChat", { state: { Room: response } });
      }, 1000);
    }
  };

  useEffect(() => {
    if (!user || !user.id || !token || token.trim() === "") {
      navigate("/SignInCard", { state: { from: location } });
      return;
    }
  }, [user, token, navigate, location]);

  const handleCancel = () => {
    navigate(-1);
  };

  if (load) {
    return <Loading darkMode={darkMode} />
  }

  return (
    <main className={`CreateChat ${darkMode ? 'dark' : 'light'}`}>
      <Layer />
      
      {alert && (
        <Alert
          status={alert.status}
          message={alert.message}
          onClose={() => setAlert(null)} />
      )}

      {showModal && (
        <div className="ModalOverlay">
          <div className="ModalContent">
            <h3>Create Room</h3>
            <input
              type="text"
              value={name}
              className={`input ${emptyName ? 'error-input' : ''}`}
              placeholder="Enter new name"
              onChange={handleNameChange}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={handleSave}
                disabled={name.length === 0 || name.length > 12}
              >
                Save
              </button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
});

export default CreateChat;
