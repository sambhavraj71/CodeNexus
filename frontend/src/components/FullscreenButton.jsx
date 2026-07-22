// src/components/FullscreenButton.jsx
import React from 'react';
import { useFullscreen } from '../contexts/FullscreenContext';
import { FaExpand, FaCompress } from 'react-icons/fa';
import '../styles/FullscreenButton.css';

const FullscreenButton = () => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <button 
      className="fullscreen-btn"
      onClick={toggleFullscreen}
      title={isFullscreen ? "Exit Fullscreen (F11)" : "Fullscreen (F11)"}
    >
      {isFullscreen ? <FaCompress /> : <FaExpand />}
      <span className="fullscreen-tooltip">
        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"} <span className="shortcut-hint">(F11)</span>
      </span>
    </button>
  );
};

export default FullscreenButton;