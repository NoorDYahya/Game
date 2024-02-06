import React, { useState, useEffect } from 'react';

function ChatBot() {
  const [question, setQuestion] = useState('');

  useEffect(() => {
    // Add event listener to the chatBotButton when DOM is loaded
    
      // Create chatBotButton and append it to the document body
      var chatBotButton = document.createElement("button");
      chatBotButton.id = "chatBotButton";
      chatBotButton.innerHTML = '<img src="Group.svg" alt="ChatBot">';
    //   <img src={Group}alt="ChatBot " />
      document.body.appendChild(chatBotButton);

      // Add event listener to the chatBotButton
      chatBotButton.addEventListener("click", function () {
        toggleChatPopup();
      });
  }, []); // Empty dependency array ensures this effect runs only once

  const toggleChatPopup = () => {
    var chatPopup = document.getElementById("chatPopup");
    chatPopup.style.display = chatPopup.style.display === "none" ? "block" : "none";
  };

  const sendQuestion = async () => {
    const questionInput = document.getElementById("questionInput");
    const question = questionInput.value.trim();
  
    if (!question) {
      // Don't proceed if the question is empty
      return;
    }
  
    try {
      // Create a new element for displaying the user message
      const userMessageElement = document.createElement("div");
      userMessageElement.classList.add("user-message");
      userMessageElement.textContent = "You: " + question + "\n\n";
  
      // Get the chat popup container
      const chatPopup = document.getElementById("chatPopup");
  
      // Insert the user message element before the text input element
      chatPopup.insertBefore(userMessageElement, questionInput);
  
      // Clear input field after sending the question
      questionInput.value = "";
  
      // Make a POST request to the backend route
      const aiResponse = await sendChatMessage(question);
  
      // Create a new element for displaying the AI response
      const aiMessageElement = document.createElement("div");
      aiMessageElement.classList.add("ai-message");
      aiMessageElement.textContent = "AI: " + aiResponse;
  
      // Insert the AI message element after the user message
      userMessageElement.insertAdjacentElement('afterend', aiMessageElement);
  
    } catch (error) {
      console.error(error);
      // Handle the error as per your requirement
    }
  };
  
  const sendChatMessage = async (messageContent) => {
    try {
      // Make a POST request to the backend route
      const response = await fetch('https://shesafebackend.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageContent }), // Pass the message content in the request body
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error('Failed to send chat message');
      }
  
      // Parse the JSON response
      const data = await response.json();
      
      // Return the AI response
      return data.aiResponse;
    } catch (error) {
      console.error(error);
      return 'Error: Unable to send chat message'; // You can handle the error as per your requirement
    }
  };

  return (
    <>
      <div id="chatPopup" style={{ display: 'none' }}>
        <input
          type="text"
          id="questionInput"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button id="sendButton" onClick={sendQuestion}>Send</button>
      </div>
    </>
  );
}

export default ChatBot;