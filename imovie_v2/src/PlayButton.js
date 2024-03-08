// PlayButton.js
import React from 'react';
import './PlayButton.css'; // Import the CSS file for styling

const PlayButton = ({ onClick }) => {
  return (
    <button className="play-button" onClick={onClick}>
      <div className="triangle"></div>
    </button>
  );
}

export default PlayButton;
