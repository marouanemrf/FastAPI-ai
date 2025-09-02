import React, { memo, useState, useEffect, useRef } from 'react';
import BackGround from '../BackGround';
import Menu from '../About/Menu';
import { FaBoxArchive } from "react-icons/fa6";
import { SlOptionsVertical } from "react-icons/sl";
import { IoCaretDown, IoSend } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import '../../Styles/HomeChat.css';
import avatar from '../../../assets/AvatarDefault.png';
import Layer from '../Layer';
import RoomDetails from './RoomDetails';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArchiveRoom, CreateRoom, DeleteRoom, GetRoom, UnArchiveRoom } from '../../../Connection/RoomChat';
import { useUserContext } from '../../UseContext.jsx';
import Alert from '../Alert.jsx';
import Loading from '../Loading.jsx';
import SignInCard from '../Authentication/SignInCard.jsx';
import { GetMessages, requestChat, SaveMessage } from '../../../Connection/message.js';

const HomeChat = memo(({ darkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [alert, setAlert] = useState(null);
  const [load, setLoad] = useState(false);
  const [room, setRoom] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { user = {}, token, setUser, setToken } = useUserContext();

  const optionsRef = useRef(null);
  const conversationRef = useRef(null);
  const conversationEndRef = useRef(null);

  useEffect(() => {
    if (!token || !token.trim()) return;

    const fetchMessages = async () => {
      try {
        const fetchedMessages = await GetMessages(user.id, room.id, token);

        if (Array.isArray(fetchedMessages) && fetchedMessages.length > 0) {
          const formattedMessages = fetchedMessages.flatMap((msg) => {
            const time = new Date(msg.timedate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const timestamp = new Date(msg.timedate).getTime();
            return [
              { text: msg.sender, time, timestamp, type: 'user' },
              { text: msg.receiver, time, timestamp: timestamp + 1, type: 'bot' }
            ];
          });

          setMessages(formattedMessages);
        } else {
          setAlert({ status: "alert", message: "No messages found!" });
        }
      } catch (e) {
        console.error("Error fetching messages:", e);
        setAlert({ status: "error", message: "Error fetching messages" });
      } finally {
        setLoad(false);
      }
    };

    setLoad(true);
    if (user && room && token) {
      fetchMessages();
    }
  }, [user, room, token]);

  const toggleOptions = () => setShowOptions(prev => !prev);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const sendMessage = () => {
    if (!room || Object.keys(room).length === 0) {
      setLoad(false);
      setAlert({ status: "alert", message: "Create a room chat first!" });
      setTimeout(() => navigate("/NewRoom"), 5000);
      return;
    }

    if (inputValue.trim() === '') return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage = {
      text: inputValue,
      time,
      timestamp: now.getTime(),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    setTimeout( async () => {
      const bootResponse = await requestChat(room.id, inputValue, token);
      
      console.log("bootResponse: ", bootResponse);

      const botMessage = {
        text: bootResponse.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        type: 'bot'
      };

      if (!bootResponse) {
        setAlert({ status: "alert", message: "Something went wrong. Boot can't response!" });
        setTimeout(() => setAlert(null), 5000);
        return;
      }

      setMessages(prev => [...prev, botMessage]);

      const isSave = SaveMessage(user.id, room.id, token, userMessage.text, bootResponse.response, now);

      if (!isSave) {
        setAlert({ status: "alert", message: "Something went wrong. Message not saved!" });
        setTimeout(() => setAlert(null), 5000);
      }
    }, 500);
  };

  const handleScroll = () => {
    const el = conversationRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 10;
    setShowNotification(!isAtBottom);
  };

  const scrollToBottom = () => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setShowNotification(false);
    }
  };

  useEffect(() => {
    const el = conversationRef.current;
    if (!el) return;
    setTimeout(() => {
      scrollToBottom();
    }, 0);
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.state?.Room) {
      setRoom(location.state.Room);
      setIsArchived(location.state.Room.isarchive);
    }
  }, [location.state]);

  const HandelArchiveRoom = async () => {
    if (!room || Object.keys(room).length === 0) {
      setLoad(false);
      setAlert({ status: "alert", message: "Create a room chat first!" });
      setTimeout(() => navigate("/NewRoom"), 5000);
      return;
    }

    setLoad(true);
    try {
      const action = room.isarchive ? UnArchiveRoom : ArchiveRoom;
      const updated = await action(user.id, room.id, token);

      if (updated) {
        const updatedRoom = await GetRoom(room.id, token);
        setRoom(updatedRoom);
        setIsArchived(updatedRoom.isarchive);
        setAlert({ status: "success", message: `Chat room successfully ${room.isarchive ? 'archived' : 'unarchived'}!` });
      } else {
        setAlert({ status: "alert", message: "Chat room update failed, try again!" });
      }
    } catch (err) {
      console.error(err);
      setAlert({ status: "error", message: "An error occurred during the operation!" });
    } finally {
      setTimeout(() => setAlert(null), 5000);
      setLoad(false);
    }
  };

  const HandelDelete = async () => {
    if (!room || Object.keys(room).length === 0) {
      setLoad(false);
      setAlert({ status: "alert", message: "Create a room chat first!" });
      setTimeout(() => navigate("/NewRoom"), 5000);
      return;
    }

    setLoad(true);
    const isDelete = await DeleteRoom(room.id, user.id, token);

    if (isDelete) {
      setLoad(false);
      setAlert({ status: "success", message: "Chat room successfully deleted" });
      setTimeout(() => setAlert(null), 5000);
    } else {
      setLoad(false);
      setAlert({ status: "error", message: "An error occurred during the operation!" });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const HandelShowDetails = () => {
    if (!room || Object.keys(room).length === 0) {
      setAlert({ status: "alert", message: "Create a room chat first!" });
      setTimeout(() => navigate("/NewRoom"), 5000);
    } else {
      setShowDetails(true);
    }
  };

  useEffect(() => {
    if (!user || !user.id || !token || token.trim() === "") {
      navigate("/SignInCard", { state: { from: location } });
    }
  }, [user, token, navigate, location]);
    
  if (load) return <Loading />;

  const chatName = room.name || "New Chat";
  const pic = room?.avatar?.startsWith('data:image/') ? room.avatar : avatar;

  return (
    <main className={`HomeChat ${darkMode ? 'dark' : 'light'}`}>
      <BackGround darkMode={darkMode} />

      {alert && <Alert status={alert.status} message={alert.message} onClose={() => setAlert(null)} />}

      <Menu darkMode={darkMode} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="Room" style={{ left: isSidebarOpen ? '170px' : '50px' }}>
        <div className="head">
          <img src={pic} alt="avatar" className='Avatar_' />
          <h2 className="ChatRoomName">{chatName}</h2>
          <button className="ArchiveBtn" onClick={HandelArchiveRoom}>
            <FaBoxArchive className={`Icon ${isArchived ? 'active' : ''}`} />
          </button>
          <button className="OptionBtn" onClick={toggleOptions}><SlOptionsVertical /></button>
          {showOptions && (
            <div className="OptionsCard" ref={optionsRef}>
              <button className="OptionItem" onClick={HandelDelete}>Delete</button>
              <button className="OptionItem" onClick={HandelShowDetails}>More Details</button>
            </div>
          )}
        </div>

        <div className="body">
          <div className="Conversation" ref={conversationRef} onScroll={handleScroll}>
            {messages.map((msg, index) => {
              const prevMsg = messages[index - 1];
              let showTimeMarker = false;
              let markerText = '';

              if (index === 0) {
                showTimeMarker = true;
                markerText = `New Chapter at ${msg.time}`;
              } else if (prevMsg) {
                const diffMs = msg.timestamp - prevMsg.timestamp;
                const diffHours = diffMs / (1000 * 60 * 60);
                const diffDays = diffMs / (1000 * 60 * 60 * 24);

                if (diffDays >= 7) {
                  const dateObj = new Date(msg.timestamp);
                  markerText = `${dateObj.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })} at ${msg.time}`;
                  showTimeMarker = true;
                } else if (diffDays >= 1) {
                  markerText = `${Math.floor(diffDays)} day${Math.floor(diffDays) > 1 ? 's' : ''} ago`;
                  showTimeMarker = true;
                } else if (diffHours >= 3) {
                  markerText = `New Chapter at ${msg.time}`;
                  showTimeMarker = true;
                }
              }

              return (
                <React.Fragment key={index}>
                  {showTimeMarker && <div className="TimeMarker">--- {markerText} ---</div>}
                  <div className={`MessageWrapper ${msg.type}`}>
                    <div className={`MessageBubble ${msg.type}`}>
                      <span className="MessageText">{msg.text}</span>
                      <span className="MessageTime">{msg.time}</span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={conversationEndRef} />
          </div>

          {showNotification && (
            <div className="NewMessageNotification" onClick={scrollToBottom}>
              <IoCaretDown />
            </div>
          )}

          <div className="ChatInput">
            <input
              type="text"
              className="Input-mgs"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
            />
            <button className="SendBtn" onClick={sendMessage}>
              <IoSend className="IconSend" />
            </button>
          </div>
        </div>

        {showDetails && (
          <>
            <button className="closeBtn" onClick={() => setShowDetails(false)}><IoIosClose /></button>
            <Layer />
            <RoomDetails darkMode={darkMode} room={room} id_user={user.id} token={token} />
          </>
        )}
      </div>
    </main>
  );
});

export default HomeChat;