// src/components/ProgressBar.js
import React from 'react';

const ProgressBar = ({ fill }) => {
  const progressStyle = {
    width: `${fill}%`,
  };

  return (
    <div className="progress-bar">
      <div className="progress-fill" style={progressStyle}></div>
    </div>
  );
};

export default ProgressBar;
