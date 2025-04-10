import React, { useEffect } from 'react';
import './index.css';
import BirdLogo from './assets/bird-svgrepo-com.svg';
import RoseLogo from './assets/rose-svgrepo-com.svg';

function App() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const birdImage = document.querySelector('.bird-image');
      const titleText = document.querySelector('.title-text');
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress (0 to 1)
      const maxScroll = 400;
      const progress = Math.min(scrollPosition / maxScroll, 1);
      
      // Calculate the movement from center to top-left
      const viewportWidth = window.innerWidth;
      
      // Convert 1em to pixels (assuming 16px base font size)
      const emInPixels = 16;
      const finalSize = 60; // Final size of the bird
      const finalX = emInPixels + (finalSize / 2); // Account for half the bird's width
      const finalY = emInPixels + (finalSize / 2); // Account for half the bird's height
      
      const moveX = (viewportWidth / 2 - finalX) * progress;
      const moveY = (viewportHeight / 2 - finalY) * progress;
      
      // Calculate size to match rose (60px)
      const startWidth = 200; // Initial width in pixels
      const finalWidth = 60; // Match rose width
      const endSize = finalWidth / startWidth;
      const newSize = 1 + (endSize - 1) * progress;
      
      // Apply transformations while maintaining center point
      if (birdImage) {
        birdImage.style.transform = `translate(calc(-50% - ${moveX}px), calc(-50% - ${moveY}px)) scale(${newSize})`;
      }
      
      // Fade in text more slowly (starts at 90% progress instead of 95%)
      if (titleText) {
        if (progress > 0.9) {
          titleText.classList.add('fade-in');
        } else {
          titleText.classList.remove('fade-in');
        }
      }
    };

    // Initial call
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-rose">
          <img 
            src={RoseLogo} 
            alt="Rose decoration" 
            className="rose-image"
          />
        </div>
      </nav>
      <div className="title-text">
        <div>
          BIRDING
        </div>
        <div>
          SOCIETY
        </div>
      </div>
      <main className="main-content">
        <div className="bird-circle">
          <div className="bird-container">
            <img 
              src={BirdLogo}
              alt="Cardinal bird logo" 
              className="bird-image"
            />
          </div>
        </div>
      </main>
      <div style={{ height: '200vh' }}></div>
    </div>
  );
}

export default App;
