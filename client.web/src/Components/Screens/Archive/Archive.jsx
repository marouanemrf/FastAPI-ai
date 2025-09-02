import React, { memo, useState, useRef, useEffect } from 'react';
import BackGround from '../BackGround';
import Menu from '../About/Menu';
import "../../Styles/History.css";
import avatar from '../../../assets/AvatarDefault.png';
import { IoCaretDown, IoCaretUpOutline } from "react-icons/io5";
import { HiOutlineViewList } from "react-icons/hi";
import { PiCardsThreeFill } from "react-icons/pi";
import { FaBoxArchive } from 'react-icons/fa6';
import { useUserContext } from '../../UseContext';
import Loading from '../Loading';
import { GetArchivedRoom } from '../../../Connection/RoomChat';
import { useLocation, useNavigate } from 'react-router-dom';
import SignInCard from '../Authentication/SignInCard';

const Archive = memo(({ darkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState('list');
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const containerRef = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [load, setLoad] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  const { user, token, setUser, setToken } = useUserContext();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const toggleDisplayMode = () => {
    setDisplayMode(prev => (prev === 'list' ? 'cards' : 'list'));
  };

  const checkScroll = () => {
    const container = containerRef.current;
    if (container) {
      setCanScrollUp(container.scrollTop > 0);
      setCanScrollDown(container.scrollTop + container.clientHeight < container.scrollHeight);
    }
  };

  // Utilisation du useEffect pour vérifier le token et user avant de lancer le fetch des rooms
  useEffect(() => {
    // Si `user` ou `token` est manquant, rediriger vers la page de connexion
    if (!user || !user.id || !token || token.trim() === "") {
      navigate("/SignInCard", { state: { from: location } });
      return;
    }

    const fetchRooms = async () => {
      setLoad(true);
      try {
        const fetchedRooms = await GetArchivedRoom(user.id, token);
        console.log("Archived Rooms Data: ", fetchedRooms);
        setRooms(fetchedRooms || []);
      } catch (e) {
        console.error("Error fetching rooms:", e);
      } finally {
        setLoad(false);
      }
    };

    fetchRooms();
  }, [user, token, navigate, location]);  // Ajout de `navigate` comme dépendance

  useEffect(() => {
    checkScroll();
  }, [rooms, displayMode]);

  const handleScroll = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = 100;
      container.scrollBy({ top: direction === 'up' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleRoomClick = (room) => {
    navigate("/HomeChat", { state: { Room: room } });
  };

  if (load) {
    return <Loading darkMode={darkMode} />;
  }

  // Si le token est manquant ou vide, afficher la page de connexion
  if (!token || !token.trim()) return <SignInCard darkMode={darkMode} />;

  return (
    <main className={`History ${darkMode ? 'dark' : 'light'}`}>
      <BackGround darkMode={darkMode} />
      <Menu
        darkMode={darkMode}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div
        className="body_"
        style={{ left: isSidebarOpen ? '170px' : '50px' }}
      >
        <div className="display-toggle">
          <button onClick={toggleDisplayMode}>
            {displayMode === 'list' ? <PiCardsThreeFill /> : <HiOutlineViewList />}
          </button>
        </div>

        {canScrollUp && (
          <button className="scroll-btn up" onClick={() => handleScroll('up')}><IoCaretUpOutline /></button>
        )}

        <div
          className={`rooms-container ${displayMode}`}
          ref={containerRef}
          onScroll={checkScroll}
        >
          {rooms.length === 0 ? (
            <p className="no-archived-rooms">No Archived Rooms</p>
          ) : (
            rooms.map((room, index) => (
              <div className="Room-Chat" key={index} onClick={() => handleRoomClick(room)}>
                <button className="Archive_Btn">
                  <FaBoxArchive />
                </button>
                <img src={room.avatar || avatar} alt="room" className="room-image" />
                <div className="room-info">
                  <h3>{room.name}</h3>
                  <p>{room.lastMsg}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {canScrollDown && (
          <button className="scroll-btn down" onClick={() => handleScroll('down')}><IoCaretDown /></button>
        )}
      </div>
    </main>
  );
});

export default Archive;
