import React, { useState, useEffect } from 'react';
import Card from './Card';
import win from './win.gif';
import ProgressBar from './ProgressBar';
import correctSound from './wineffect.mpeg'; 
import wrongSound from './wrongeffect.mpeg';
import celebrate from './confetti-31.gif'

import swal from 'sweetalert';

const App = () => {

  const [allQuestions , setAllQuestions] =useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [openedEnvelopes, setOpenedEnvelopes] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
//sound 
  const [correctSoundRef, setCorrectSoundRef] = useState(new Audio(correctSound));
  const [wrongSoundRef, setWrongSoundRef] = useState(new Audio(wrongSound));
  useEffect(() => {
    correctSoundRef.volume = 0.5; // Adjust volume if needed
    wrongSoundRef.volume = 0.5; // Adjust volume if needed
  }, [correctSoundRef, wrongSoundRef]);

  useEffect(() => {
    console.log("...fetching");
    fetch("https://shesafebackend.onrender.com/api/question")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAllQuestions(data); 
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);




  useEffect(() => {

    selectNextQuestion();
  }, [openedEnvelopes , loading]);


  const playCorrectSound = () => {
    correctSoundRef.currentTime = 0;
    correctSoundRef.play();
  };

  const playWrongSound = () => {
    wrongSoundRef.currentTime = 0;
    wrongSoundRef.play();
  };



  const selectNextQuestion = () => {
    if (loading || gameEnded) {
      return;
    }
    const unansweredQuestions = allQuestions.filter(
      (q) => !openedEnvelopes.includes(q._id)
    );

    if (unansweredQuestions.length > 0) {
      const nextQuestion = unansweredQuestions[0];
      setCurrentQuestionIndex(allQuestions.indexOf(nextQuestion));
    }
    else{
      setGameEnded(true);
      swal({
        title: "Game Over!",
        text: `Your Score: ${score} out of ${allQuestions.length}`,
        icon: "sucsses",
        buttons: ["Play Again", "Cancel"],
        customClass: {
          container: "custom-swal-container",
          popup: "custom-swal-popup",
          title: "custom-swal-title",
          text: "custom-swal-text",
          confirmButton: "custom-swal-confirm-button",
          background: "custom-swal-background",
        },
        
        
      }).then((playAgain) => {
        // if (playAgain) {
        //   // Reset game state and fetch new questions
        //   setScore(0);
        //   setOpenedEnvelopes([]);
        //   setGameEnded(false);
        //   setLoading(true);
        //   fetchQuestions();
        // }
      });
    }
  };

  const handleAnswerSelected = (isCorrect) => {
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      playCorrectSound();
    }
    else{
      playWrongSound();
    }

    setOpenedEnvelopes((prevOpenedEnvelopes) => [
      ...prevOpenedEnvelopes,
      allQuestions[currentQuestionIndex]._id,
    ]);
  };

  const progressBarFill = (score / allQuestions.length) * 100;

  return (
    <div className="app">


      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
        Envelope Game 💌
      </h1>
      {gameEnded ? (
        // <div className="result" >
        //   <h2>Game Over!</h2>
        //   <p>Your Score: {score} out of {allQuestions.length}</p>
        //   <button className='playButtom'>play Again</button>
    
        // </div>
        null

      ) : (
        <>
          <div
            className="score"
            style={{ backgroundImage: `url(${win})`}}
          >
            <h4>Score: {score}</h4>
          </div>
          <ProgressBar fill={progressBarFill} />
          <div className="cards-container">
          {currentQuestionIndex !== null && (
              <Card
                question={allQuestions[currentQuestionIndex].question}
                options={allQuestions[currentQuestionIndex].options}
                correctAnswer={allQuestions[currentQuestionIndex].correctAnswer}
                onAnswerSelected={handleAnswerSelected}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
