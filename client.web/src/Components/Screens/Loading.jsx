  import React, { memo } from 'react';
import "../Styles/Loading.css";
import Layer from './Layer';

const Loading = memo(({ darkMode }) => {
  return (
    <main className={`Loading ${darkMode ? 'dark' : 'light'}`}>
      <Layer />
      
      <div className="cube-loader">
        <div className="cube-top"></div>
        <div className="cube-wrapper">
          <span style={{ '--i': 0 }} className="cube-span"></span>
          <span style={{ '--i': 1 }} className="cube-span"></span>
          <span style={{ '--i': 2 }} className="cube-span"></span>
          <span style={{ '--i': 3 }} className="cube-span"></span>
        </div>
      </div>
    </main>
  )
})

export default Loading;
