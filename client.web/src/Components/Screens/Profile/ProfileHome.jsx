import React, { memo, useState, useEffect } from 'react';
import { IoMdCreate, IoIosClose } from "react-icons/io";
import { useLocation, useNavigate } from 'react-router-dom';
import "../../Styles/Profile.css";
import { useUserContext } from '../../UseContext';
import pic from '../../../assets/user.png';
import SignInCard from '../Authentication/SignInCard';

const Profile = memo(({ darkMode }) => {
  const [animatedProgress, setAnimatedProgress] = useState(
    Array(10).fill(0)
  );
  const {user = {}, token, setUser, setToken} = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const HandleProfileModification = () => {
    navigate("/ProfileModification");
  }

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

  const calcStrokeOffset = (percent) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    return circumference * (1 - percent / 100);
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

  useEffect(() => {
    if (!user || !user.id || !token || token.trim() === "") {
      navigate("/SignInCard", { state: { from: location } });
    }
  }, [user, token, navigate, location]);

  return (
    <main className={`RoomDetails ${darkMode ? 'dark' : ''}`}>
      <button className="closeBtn" onClick={() => navigate(-1)} style={{top: "10%", right: "10px"}}> <IoIosClose /> </button>
      <div className="ProfileCard">
        <div className="StatisticSection">
          <h2>Personality Statistics</h2>
          {stats.map((stat, index) => (
            <div key={index} className="StatCard">
              <div className="progress-container">
                <svg viewBox="0 0 120 120" className="progress-circle">
                  <circle
                    className="bg"
                    cx="60"
                    cy="60"
                    r="50"
                  />
                  <circle
                    className="progress"
                    cx="60"
                    cy="60"
                    r="50"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 50}`,
                      strokeDashoffset: calcStrokeOffset(animatedProgress[index]),
                    }}
                  />
                </svg>
                <div className="progress-text">{animatedProgress[index]}%</div>
              </div>
              <div className="stat-title">{stat.title}</div>
            </div>
          ))}
        </div>

        <div className="PersonalSection">
          {user && user.pic ? (
            <img
              src={user.pic.startsWith('data:image/') ? user.pic : pic}
              alt="Profile"
            />
          ) : (
            <img src={pic} alt="Profile" />
          )}
          <button className="ApdateBtn" onClick={HandleProfileModification}>
                <IoMdCreate />
          </button>
          <h2>{user?.firstname || "Misrro"} {user?.lastname || "user"}</h2>
          <h3 style={{marginTop: "-20px"}}>{user?.nickname || "User"}</h3>
          <p>Email: </p><h3>{user?.email || "None"}</h3> 
          <p>Account Created: </p><h3>{formatDate(user?.datetime) || "None"}</h3>
        </div>
      </div>
    </main>
  );
});

export default Profile;
