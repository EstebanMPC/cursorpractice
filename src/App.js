import React, { useEffect, useState } from 'react';
import './index.css';
import BirdLogo from './assets/bird-svgrepo-com.svg';
import RoseLogo from './assets/rose-svgrepo-com.svg';
import CardinalImage from './assets/cardinal.jpg';

function App() {
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    // Store references to elements to avoid repeated querying
    const birdImage = document.querySelector('.bird-image');
    const titleText = document.querySelector('.title-text');
    const horizontalLine = document.querySelector('.horizontal-line');
    const fractureSections = [
      document.getElementById('fracture-1'),
      document.getElementById('fracture-2'),
      document.getElementById('fracture-3'),
      document.getElementById('fracture-4'),
    ];

    // Define vertical offset for the line below the title center (adjust as needed)
    const lineVerticalOffsetRem = 8; // e.g., 8rem below title's center
    const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const lineVerticalOffsetPx = lineVerticalOffsetRem * remInPixels;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const vhInPixels = viewportHeight / 100;

      // --- Bird Animation ---
      const maxScrollBird = 400;
      const progressBird = Math.min(scrollPosition / maxScrollBird, 1);
      const emInPixels = 16;
      const finalSize = 60;
      const finalX = emInPixels + (finalSize / 2);
      const finalY = emInPixels + (finalSize / 2);
      const moveX = (viewportWidth / 2 - finalX) * progressBird;
      const moveY = (viewportHeight / 2 - finalY) * progressBird;
      const startWidth = 200;
      const finalWidth = 60;
      const endSize = finalWidth / startWidth;
      const newSize = 1 + (endSize - 1) * progressBird;

      if (birdImage) {
        birdImage.style.transform = `translate(calc(-50% - ${moveX}px), calc(-50% - ${moveY}px)) scale(${newSize})`;
      }

      // --- Title Text Animation ---
      const fadeInStartScroll = maxScrollBird * 0.9;
      const titleExitStartScroll = fadeInStartScroll + 20 * vhInPixels;
      const titleExitUpStartScroll = titleExitStartScroll + 30 * vhInPixels;

      let titleTranslateY = '-50%'; // Default initial state
      let upwardShift = 0; // Initialize upward shift

      if (titleText) {
        if (scrollPosition > titleExitUpStartScroll) {
          upwardShift = scrollPosition - titleExitUpStartScroll;
          // Apply upward shift combined with fade-in's vertical position
          titleTranslateY = `calc(-60% - ${upwardShift}px)`;
          titleText.style.transform = `translate(-50%, ${titleTranslateY})`;
          titleText.classList.add('fade-in'); // Ensure it's faded in while moving
        } else if (scrollPosition > fadeInStartScroll) {
          // Faded in but not moving up yet
          titleTranslateY = '-60%';
          titleText.style.transform = `translate(-50%, ${titleTranslateY})`;
          titleText.classList.add('fade-in');
        } else {
          // Before fade-in
          titleText.style.transform = `translate(-50%, -50%)`;
          titleText.classList.remove('fade-in');
        }
      }

      // --- Horizontal Line Animation ---
      const welcomeText = document.querySelector('.welcome-text');
      const horizontalLineBottom = document.querySelector('.horizontal-line-bottom');

      if (horizontalLine) {
        // Calculate line's vertical position, adding 300px offset
        let lineTranslateY = `calc(-50% + 50vh + 300px)`; // Added + 300px
        // Adjust for scroll position to keep constant distance, maintaining the offset
        if (scrollPosition > titleExitUpStartScroll) {
          let upwardShift = scrollPosition - titleExitUpStartScroll;
          lineTranslateY = `calc(-50% + 50vh + 300px - ${upwardShift}px)`; // Added + 300px
        }

        // Apply centering transform (translateX) and the fixed vertical transform (translateY)
        horizontalLine.style.transform = `translate(-50%, ${lineTranslateY})`;

        // Calculate the trigger point based on the position of the horizontal line element
        // This calculation might need adjustment if the line's new position affects timing
        let lineTriggerScroll = viewportHeight * 0.5 + 300; // Adjust trigger based on new position
        if (horizontalLine) {
          const rect = horizontalLine.getBoundingClientRect();
          // Recalculate trigger based on the actual element position relative to viewport center/bottom
          // Let's trigger when the line is about 30% from the bottom instead of 30% from the top
          lineTriggerScroll = rect.top + window.scrollY - viewportHeight * 0.7; 
        }

        // Apply fade-in effect when the line is near the middle/bottom of the viewport
        if (scrollPosition > lineTriggerScroll) {
          horizontalLine.classList.add('visible');
          if (horizontalLineBottom) {
            horizontalLineBottom.classList.add('visible');
          }
        } else {
          horizontalLine.classList.remove('visible');
          if (horizontalLineBottom) {
            horizontalLineBottom.classList.remove('visible');
          }
        }
      }

      // --- Welcome Text Animation ---
      // Trigger when the welcome text container is near the middle of the viewport
      // Calculate the trigger point based on the position of the welcome text element
      const welcomeTextElement = document.querySelector('.welcome-text');
      let welcomeTextTriggerScroll = viewportHeight * 0.5;
      let backgroundFadeOutTriggerScroll = viewportHeight * 1.5; // Default fallback
      if (welcomeTextElement) {
        const rect = welcomeTextElement.getBoundingClientRect();
        welcomeTextTriggerScroll = rect.top + window.scrollY - viewportHeight * 0.3;
        backgroundFadeOutTriggerScroll = window.scrollY + rect.top + (rect.height * 0.5);
        console.log('Trigger Scroll:', backgroundFadeOutTriggerScroll, 'Current Scroll:', scrollPosition); // Debug log
      }
      if (welcomeText) {
        if (scrollPosition > welcomeTextTriggerScroll) {
          welcomeText.classList.add('visible');
        } else {
          welcomeText.classList.remove('visible');
        }
      }

      // --- Background Fade Out and Image Reveal ---
      const appElement = document.querySelector('.App');
      const backgroundImage = document.querySelector('.background-image');
      const borderDiv = document.querySelector('.centered-border-div');
      const everythingText = document.querySelector('.everything-text');
      const isText = document.querySelector('.is-text');
      const computerText = document.querySelector('.computer-text');
      const backgroundOverlay = document.querySelector('.background-overlay');
      if (appElement && backgroundImage && borderDiv) {
        if (scrollPosition > backgroundFadeOutTriggerScroll) {
          appElement.classList.add('fade-out');
          backgroundImage.classList.add('visible');
          borderDiv.classList.add('visible');
          // Calculate scaling based on scroll distance past the trigger, adjusted for longer scroll height
          const scrollPastTrigger = scrollPosition - backgroundFadeOutTriggerScroll;
          // Slow down the scaling reduction to account for longer scrollable area (500vh)
          const scaleFactor = Math.max(1.2, 1.8 - (scrollPastTrigger / (viewportHeight * 2)));
          borderDiv.style.transform = `translate(-50%, -50%) scale(${scaleFactor})`;
          // Show 'EVERYTHING' first after the box has scaled down some
          if (scaleFactor < 1.8 && everythingText) {
            everythingText.classList.add('visible');
          }
          // Show 'IS' much sooner (e.g., when scaleFactor is below 1.7)
          if (scaleFactor < 1.7 && isText) {
            isText.classList.add('visible');
          }
          // Show 'COMPUTER' after 'IS' (e.g., when scaleFactor is below 1.6)
          if (scaleFactor < 1.6 && computerText) {
            computerText.classList.add('visible');
          }
          // Blur out all text elements when border box reaches smallest size (scaleFactor <= 1.2)
          if (scaleFactor <= 1.2) {
            if (everythingText) everythingText.classList.add('blur-out');
            if (isText) isText.classList.add('blur-out');
            if (computerText) computerText.classList.add('blur-out');
            // Increase opacity of centered-border-div-outline as user scrolls further
            const outlineDiv = document.querySelector('.centered-border-div-outline');
            if (outlineDiv) {
              // Calculate scroll position when blur starts (scaleFactor hits 1.2)
              const blurStartScrollOffset = 1.2 * viewportHeight; // Scroll distance past backgroundFadeOutTriggerScroll when scaleFactor = 1.2
              const blurStartScrollPosition = backgroundFadeOutTriggerScroll + blurStartScrollOffset;

              // Define how much further to scroll for full opacity (e.g., 1 viewport height)
              const opacityDurationScroll = viewportHeight * 1;

              // Calculate progress towards full opacity
              const scrollSinceBlurStart = Math.max(0, scrollPosition - blurStartScrollPosition);
              const opacityProgress = Math.min(scrollSinceBlurStart / opacityDurationScroll, 1);

              outlineDiv.style.opacity = opacityProgress;
              console.log('Outline opacity:', opacityProgress); // Debug log

              // Trigger Paywall when opacity reaches 1
              if (opacityProgress >= 1 && !showPaywall) {
                  setShowPaywall(true);
              } else if (opacityProgress < 1 && showPaywall) { // Hide if scrolling back up before full opacity
                  setShowPaywall(false);
              }
            }
          } else {
             // If scaleFactor > 1.2, ensure text is not blurred out
             if (everythingText) everythingText.classList.remove('blur-out');
             if (isText) isText.classList.remove('blur-out');
             if (computerText) computerText.classList.remove('blur-out');
             // Also hide paywall if scrolling back up before blur starts
             if (showPaywall) {
                 setShowPaywall(false);
             }
             // Reset outline opacity if needed
             const outlineDiv = document.querySelector('.centered-border-div-outline');
             if (outlineDiv) {
                 outlineDiv.style.opacity = 0;
             }
          }
          // Show background overlay much later (e.g., when scaleFactor is below 0.6, adjusted for longer scroll)
          if (scaleFactor < 0.6 && backgroundOverlay) {
            backgroundOverlay.classList.add('visible');
          }
          console.log('Fade out triggered', 'Scale:', scaleFactor); // Debug log
        } else {
          appElement.classList.remove('fade-out');
          backgroundImage.classList.remove('visible');
          borderDiv.classList.remove('visible');
          borderDiv.style.transform = 'translate(-50%, -50%) scale(2.2)';
          if (everythingText) everythingText.classList.remove('visible', 'blur-out'); // Remove blur-out class here too
          if (isText) isText.classList.remove('visible', 'blur-out');
          if (computerText) computerText.classList.remove('visible', 'blur-out');
          if (backgroundOverlay) backgroundOverlay.classList.remove('visible');
          // Ensure paywall is hidden if scrolling back up before the trigger point
          if (showPaywall) {
              setShowPaywall(false);
          }
           // Reset outline opacity if needed when scrolling back up fully
           const outlineDiv = document.querySelector('.centered-border-div-outline');
           if (outlineDiv) {
               outlineDiv.style.opacity = 0;
           }
        }
      }

      // --- Fracture Animation ---
      const fractureStartScroll = titleExitStartScroll + 20 * vhInPixels;

      if (scrollPosition > fractureStartScroll) {
        fractureSections.forEach((section, index) => {
          if (section) {
            section.classList.add('fracture-visible');
            section.classList.add(`fracture-${index + 1}-animate`);
          }
        });
      } else {
        fractureSections.forEach((section, index) => {
          if (section) {
            section.classList.remove('fracture-visible');
            section.classList.remove(`fracture-${index + 1}-animate`);
          }
        });
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showPaywall]);

  return (
    <div className={`App ${showPaywall ? 'blur-background' : ''}`}>
      <div className="reveal-background"></div>
      <img src={CardinalImage} alt="Cardinal Background" className="background-image" />
      <div className="background-overlay"></div>

      <div id="fracture-1" className="fracture-section"></div>
      <div id="fracture-2" className="fracture-section"></div>
      <div id="fracture-3" className="fracture-section"></div>
      <div id="fracture-4" className="fracture-section"></div>

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
      <div className="horizontal-line">
        <div className="welcome-text">
          Welcome to the Birding Society, a passionate community dedicated to birdwatching and conservation in Zurich. We explore local habitats, share knowledge, and promote biodiversity through group outings, workshops, advocacy, and nothing shady at all.
          <div className="horizontal-line-bottom"></div>
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
        <div className="centered-border-div ">
          <div className="centered-border-div-outline"></div>
        </div>
        <div className="everything-text">EVERYTHING</div>
        <div className="is-text">IS</div>
        <div className="computer-text">COMPUTER</div>
      </main>

      {showPaywall && (
        <div className="paywall-popup">
          <h2>PAYWALL</h2>
          <p>$35 per month</p>
          <p>Enjoy unlimited access</p>
          <div className="email-input-container">
            <label htmlFor="paywall-email">Email</label>
            <input type="email" id="paywall-email" name="email" placeholder="your.email@example.com" />
            <button className="paywall-button">Sign up lmao</button>
          </div>
        </div>
      )}

      <div style={{ height: '700vh' }}></div>
    </div>
  );
}

export default App;
