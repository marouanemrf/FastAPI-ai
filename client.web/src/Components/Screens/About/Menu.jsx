import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiArrowLeft, FiAlignJustify } from "react-icons/fi";
import { IoIosCreate } from "react-icons/io";
import { FaBoxArchive } from "react-icons/fa6";
import "../../Styles/Menu.css";

const Menu = memo(({ darkMode, isOpen, toggleSidebar }) => {
    const navigate = useNavigate();

  const HandleOnHistory = () => {
    navigate("/History");
  }

  const HandleOnCreateRoom = () => {
    navigate("/NewRoom");
  }

  const HandleOnArchive = () => {
    navigate("/Archive");
  }

  return (
    <div className={`Sidebar-container ${darkMode ? "dark" : "light"} ${isOpen ? "open" : ""}`}>
      <button className="Show-Hide" onClick={toggleSidebar}>
        {isOpen ? <FiArrowLeft className="Fiarrow" /> : <FiArrowRight className="Fiarrow" />}
      </button>

      {isOpen ? (
        <button className="Menu-Button" onClick={HandleOnHistory}>
          <FiAlignJustify className="Fialighjustify" />
          <p>History</p>
        </button>
      ) : (
        <button className="Menu-Button" onClick={HandleOnHistory}>
          <FiAlignJustify className="Fialighjustify" />
        </button>
      )}

      {isOpen ? (
        <button className="Create-Button" onClick={HandleOnCreateRoom}>
          <IoIosCreate className="CreateIO" />
          <p>Create Chat</p>
        </button>
      ) : (
        <button className="Create-Button" onClick={HandleOnCreateRoom}>
          <IoIosCreate className="CreateIO" />
        </button>
      )}

      {isOpen ? (
        <button className="Archive-Button" onClick={HandleOnArchive}>
          <FaBoxArchive className="Archive" />
          <p>Archive Box</p>
        </button>
      ) : (
        <button className="Archive-Button" onClick={HandleOnArchive}>
          <FaBoxArchive className="Archive" />
        </button>
      )}
    </div>
  );
});

export default Menu;
