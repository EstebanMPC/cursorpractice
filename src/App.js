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

      // Add fadeout class after scrolling additional 20vh from when text is fully visible
      const fadeoutElements = document.querySelectorAll('.fadeout');
      const textFullyVisiblePosition = viewportHeight * 0.9; // Position where text becomes fully visible
      const fadeoutStartPosition = textFullyVisiblePosition + (viewportHeight * 0.2); // e.g., 110vh

      if (scrollPosition > fadeoutStartPosition) {
        fadeoutElements.forEach(element => {
          element.classList.add('fadeout-active');
        });
      } else {
        fadeoutElements.forEach(element => {
          element.classList.remove('fadeout-active');
        });
      }

      // Calculate the scroll position where changeorder should START
      const changeOrderStartPosition = fadeoutStartPosition + (viewportHeight * 0.5); // Changed 0.1 to 0.5

      // Check if scroll position is past the change order start point
      const oSpan = document.getElementById('o-span');
      const cSpan = document.getElementById('c-span');
      let isChangeOrderActive = false;

      if (scrollPosition > changeOrderStartPosition) {
        // Add the 'changeorder' class
        if (oSpan && !oSpan.classList.contains('changeorder')) {
          oSpan.classList.add('changeorder');
        }
        if (cSpan && !cSpan.classList.contains('changeorder')) {
          cSpan.classList.add('changeorder');
        }
		isChangeOrderActive = true;
      } else {
        // Remove the 'changeorder' class
        if (oSpan && oSpan.classList.contains('changeorder')) {
          oSpan.classList.remove('changeorder');
        }
        if (cSpan && cSpan.classList.contains('changeorder')) {
          cSpan.classList.remove('changeorder');
        }
		isChangeOrderActive = false;
      }

      // Calculate the scroll position where shift-out should START (20vh AFTER changeorder is active)
      const shiftOutStartPosition = changeOrderStartPosition + (viewportHeight * 0.2);

      // Check if scroll position is past the shift-out start point AND changeorder is active
      if (isChangeOrderActive && scrollPosition > shiftOutStartPosition) {
        // Add the 'shift-out' class - ADD TO TITLE TEXT
        if (titleText) titleText.classList.add('shift-out');
      } else {
        // Remove the 'shift-out' class - REMOVE FROM TITLE TEXT
        if (titleText) titleText.classList.remove('shift-out');
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
          <span className="fadeout">B</span>
          <span className="fadeout">I</span>
          <span className="fadeout">R</span>
          <span className="fadeout">D</span>
          <span >I</span>
          <span>N</span>
          <span className="fadeout">G</span>
        </div>
          <div className="society-container">
            <span className="fadeout">S</span>
            <div className="changedirection">
              <span id="o-span">O</span>
              <span id="c-span">C</span>
            </div>
            <span className="fadeout">I</span>
            <span className="fadeout">E</span>
            <span className="fadeout">T</span>
            <span className="fadeout">Y</span>
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
