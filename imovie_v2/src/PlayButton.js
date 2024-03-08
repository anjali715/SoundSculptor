// PlayButton.js
import React from 'react';
import './PlayButton.css'; // Import the CSS file for styling
import playbutton from './play.png';

const PlayButton = ({ onClick }) => {
  return (
    <button className="play-button" onClick={onClick}>
      <img src={playbutton} alt="Play" className="playbutton" />
    </button>
  );
}

export default PlayButton;
