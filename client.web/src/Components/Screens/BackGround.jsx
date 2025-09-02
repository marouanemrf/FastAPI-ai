import React from 'react';
import '../Styles/Home.css';
import HeroImage from '../../assets/Hero.png';


export default function BackGround({ darkMode }) {
  return (
    <main className={`home ${darkMode ? 'dark' : 'light'}`}> 

      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      <div className="blob blob-4"></div>
      <div className="blob blob-5"></div>

        <div className="hero-image">
            <img src={HeroImage} alt="Mirror Hero" />
        </div>


    </main>
  );
}
