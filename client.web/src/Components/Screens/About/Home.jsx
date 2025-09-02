import React from 'react';
import '../../Styles/Home.css';
import HeroImage from '../../../assets/Hero.png';
import BackGround from '../BackGround';



export default function Home({ darkMode }) {
  return (
    <main className={`home ${darkMode ? 'dark' : 'light'}`}> 
      <BackGround darkMode={darkMode} />

      {/* HERO SECTION */}
      <section className="hero">
        <h1 className="hero-title">
            <span style={{ color: "#646cffaa", fontWeight: "bold", fontSize: "65px" }}>W</span>
            elcome to  
            <span style={{ color: "#61dafbaa", fontWeight: "bold", fontSize: "65px" }}> M</span>
            irror
        </h1>

        <p className="hero-subtitle">
          Your personal AI mirror — reflect, learn, and grow with your own thoughts.
        </p>

      </section>

      {/* DESCRIPTION SECTION */}
      <section className="description">
        <h2>What is Mirror?</h2>
        <p>
          Mirror is an AI-powered chatbot that acts as your psychological mirror.
          It listens to you, reflects your personality, highlights your strengths and weaknesses,
          and helps you better understand yourself.
        </p>
        <p>
          Use it as your friend, your teacher, or your silent guide to unlock
          your full potential.
        </p>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <h2>How Mirror Helps You</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🧘 Self Reflection</h3>
            <p>Analyze your thoughts and emotions with honest conversations.</p>
          </div>
          <div className="feature-card">
            <h3>💬 Friend & Listener</h3>
            <p>Mirror is always here to chat, listen and support you 24/7.</p>
          </div>
          <div className="feature-card">
            <h3>📚 Learn & Grow</h3>
            <p>Get personalized tips to grow emotionally and mentally.</p>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="gallery">
        <h2>Gallery</h2>
        <div className="gallery-grid">
          {/* <img src="/images/screenshot1.jpg" alt="App Screenshot 1" />
          <img src="/images/screenshot2.jpg" alt="App Screenshot 2" />
          <img src="/images/screenshot3.jpg" alt="App Screenshot 3" /> */}
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="footer">
        <p>Created by <strong>Ouiam Kamili && Marouane Morfi</strong> — © {new Date().getFullYear()} Mirror</p>
      </footer>
    </main>
  );
}
