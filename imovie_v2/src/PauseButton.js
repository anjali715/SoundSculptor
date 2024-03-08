// PauseButton.js

import React from 'react';
import './PauseButton.css'; // Import the CSS file for styling

const PauseButton = ({ onClick }) => {
  return (
    <button className="pause-button" onClick={onClick}>
      <div className="pause-icon"></div>
      <div className="pause-icon"></div>
    </button>
  );
}

export default PauseButton;
