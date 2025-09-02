import React, { memo, useState, useEffect } from 'react';
import "../../Styles/RoomDetails.css";
import avatar from '../../../assets/AvatarDefault.png';
import { IoMdCreate } from "react-icons/io";
import { UpdateRoom } from '../../../Connection/RoomChat';
import Loading from '../Loading';
import Alert from '../Alert';
import { useLocation, useNavigate } from 'react-router-dom';
import SignInCard from '../Authentication/SignInCard';

const RoomDetails = memo(({ darkMode, room, id_user, token }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(room?.name || "New Chat");
  const [avatarSrc, setAvatarSrc] = useState(room?.avatar || avatar);
  const [load, setLoad] = useState(false);
  const [alert, setAlert] = useState(null);
  const [animatedProgress, setAnimatedProgress] = useState(Array(10).fill(0));
  const [r, setR] = useState(room);
  const navigation = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setR(room);
    setName(room?.name || "New Chat");
    setAvatarSrc(room?.avatar || avatar);
  }, [room]);  // update state whenever room prop changes

  const pic = avatarSrc || r?.avatar || avatar;

  const stats = [
    { title: 'Sociability', percent: 75 },
    { title: 'Humor', percent: 60 },
    { title: 'Seriousness', percent: 45 },
    { title: 'Emotional', percent: 55 },
    { title: 'Curiosity', percent: 81 },
    { title: 'Authority', percent: 35 },
    { title: 'Spirituality', percent: 65 },
    { title: 'Skepticism', percent: 25 },
    { title: 'Naivety', percent: 50 },
    { title: 'Darkness', percent: 40 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedProgress((prev) =>
        prev.map((value, index) =>
          value < stats[index].percent ? value + 1 : value
        )
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 12) {
      setName(value);
    } else {
      setAlert({ status: "error", message: "Max 12 characters allowed" });
    }
  };

  const handleSave = async () => {
    setLoad(true);

    try {
      const roomUpdate = await UpdateRoom(r.id, id_user, token, name, avatarSrc);

      if (!roomUpdate) {
        setLoad(false);
        setAlert({ status: "error", message: "Error modifying the room!" });
        setTimeout(() => setAlert(null), 5000);
      } else {
        setLoad(false);
        setAlert({ status: "success", message: "Chat room successfully modified" });
        setR(roomUpdate); // Update the room object after saving
        setShowModal(false); // Close the modal
        setTimeout(() => {
          setAlert(null);
          navigation("/HomeChat", { state: { Room: roomUpdate } });
        }, 5000);
      }
    } catch (error) {
      setLoad(false);
      setAlert({ status: "error", message: "Error modifying the room!" });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return 'Invalid date';
    }

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} at ${hours}:${minutes}:${seconds}`;
  };

  if (load) {
    return <Loading darkMode={darkMode} />;
  }

  if (!token || token.trim() === "") {
    navigate("/SignInCard", { state: { from: location } });
    return;
  }

  return (
    <main className={`Room_Details ${darkMode ? 'dark' : ''}`}>
      {alert && (
        <Alert
          status={alert.status}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="Ca_rd">
        <div className="BasicInfo">
          <button className="Apdate-Btn" onClick={() => setShowModal(true)}>
            <IoMdCreate />
          </button>
          <img src={pic} alt="Avatar" className="Avatar" />
          <div className="AvatarName">{r.name}</div>
          <div className="CreationDate">
            <h4>Created in:</h4>
            <p>{formatDate(r.creationdate)}</p>
          </div>
        </div>

        <div className="StatisticInfo">
          <h2>Statistics Information:</h2>
          {stats.map((stat, index) => (
            <div key={index} className={`Stat-${stat.title}`}>
              <div className="progress-container">
                <svg viewBox="0 0 120 120" className="progress-bar">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    pathLength="100"
                    style={{
                      fill: "none",
                      stroke: "rgba(255, 255, 255, 0.1)",
                      strokeWidth: 10,
                    }}
                  />
                  <circle
                    className="progress"
                    cx="60"
                    cy="60"
                    r="50"
                    style={{
                      fill: "none",
                      stroke: "#2e5bfc",
                      strokeWidth: 10,
                      strokeLinecap: "round",
                      strokeDasharray: 314,
                      strokeDashoffset: 314 - (314 * animatedProgress[index]) / 100,
                      transition: "stroke-dashoffset 0.5s ease",
                    }}
                  />
                </svg>
                <div className="progress-text">{animatedProgress[index]}%</div>
              </div>
              <div className="stat-title">{stat.title}</div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="ModalOverlay">
          <div className="ModalContent">
            <h3>Update Room Details</h3>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter new name"
            />
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            <button
              onClick={handleSave}
              disabled={name.length === 0 || name.length > 12}
              style={{marginTop:"10px", marginLeft:"10px"}}
            >
              Save
            </button>
            <button onClick={() => setShowModal(false)} style={{marginLeft:"10px"}}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
});

export default RoomDetails;
