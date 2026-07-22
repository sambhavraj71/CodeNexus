// src/components/FullscreenShortcut.jsx
import { useEffect } from 'react';
import { useFullscreen } from '../contexts/FullscreenContext';

const FullscreenShortcut = () => {
  const { toggleFullscreen } = useFullscreen();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // F11 key
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  return null;
};

export default FullscreenShortcut;