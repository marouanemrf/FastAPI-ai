import React, { memo, useState, useRef, useEffect } from 'react';
import BackGround from '../BackGround';
import Menu from '../About/Menu';
import "../../Styles/History.css";
import avatar from '../../../assets/AvatarDefault.png';
import { IoCaretDown, IoCaretUpOutline } from "react-icons/io5";
import { HiOutlineViewList } from "react-icons/hi";
import { PiCardsThreeFill } from "react-icons/pi";
import { useUserContext } from '../../UseContext';
import { GetRooms } from '../../../Connection/RoomChat';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../Loading';
import SignInCard from '../Authentication/SignInCard';

const History = memo(({ darkMode }) => {
  const { user = {}, token, setUser, setToken } = useUserContext();

  if (!token) {
    return <SignInCard darkMode={darkMode} />
  }
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState('list');
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [load, setLoad] = useState(false); 
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();


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

  useEffect(() => {

    if (!user || !user.id || !token || token.trim() === "") {
      navigate("/SignInCard", { state: { from: location } });
      return;
    }

    const fetchRooms = async () => {
      setLoad(true);
      if (!token) {
        setLoad(false);
        console.log("Token is missing");
        return;
      }

      try {
        const fetchedRooms = await GetRooms(user.id, token);
        console.log("Rooms Data: ", fetchedRooms);
        setRooms(fetchedRooms || []);

        setTimeout(() => setLoad(false), 10000);
      } catch (e) {
        console.error("Error fetching rooms:", e);
      } finally {
        setLoad(false);
      }
    };

    fetchRooms();
  }, [user.id, token, navigate, location]);

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

  const handleCreateRoom = () => {
    navigate("/NewRoom");
  };

  const handleRoomClick = (room) => {
    navigate("/HomeChat", { state: { Room: room } });
  };


  if (load) {
    return <Loading darkMode={darkMode} />
  }

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
            <div className="no-rooms-message">
              <p>No Room Chat Selected !</p>
              <button onClick={handleCreateRoom} className="create-room-btn">
                Create your Room
              </button>
            </div>
          ) : (
            rooms.map((room, index) => (
              <div className="Room-Chat" key={index} onClick={() => handleRoomClick(room)}>
                <img src={room.avatar || avatar} alt="room" className="room-image" />
                <div className="room-info" >
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

export default History;
