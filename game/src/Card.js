import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import card from './25490.png';

const Card = ({ question, options, correctAnswer, onAnswerSelected }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswerClick = (selectedOption) => {
    onAnswerSelected(selectedOption === correctAnswer);
    handleCardFlip();
  };

  return (
    <div className="envelope" onClick={handleCardFlip}>
      <ReactCardFlip
        isFlipped={isFlipped}
        flipDirection="horizontal"
      >
        {/* Front of the card - Envelope */}
        <div
          className="card envelope-front"
          style={{
            backgroundImage: `url(${card})`,
            width: '266px',
            height: '203px',
          }}
        ></div>
        {/* Back of the card - Question */}
        <div className="card envelope-back">
      {   question&& <h2>{question}</h2>}
          <div className="options">
            {options?.map((option, index) => (
              <div key={index} onClick={() => handleAnswerClick(option)}>
                {option}
              </div>
            ))}
          </div>
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default Card;
