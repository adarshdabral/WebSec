import { motion } from 'framer-motion';
import React, { useState, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

// Function to send a request to the API with given options
async function requestApi(option: string, url: string) {
  let apiUrl = '';

  // Define API endpoints based on user choice
  switch (option) {
    case '1': // SQL Attack
      apiUrl = 'http://deka.pylex.xyz:10037/sqlscan';
      break;
    case '2': // Website Stressing
      apiUrl = 'https://your-api.com/website-stressing';
      break;
    case '3': // Admin Passwords
      apiUrl = 'https://your-api.com/admin-passwords';
      break;
    case '4': // XSS Testing
      apiUrl = 'https://your-api.com/xss-testing';
      break;
    default:
      return { message: 'Invalid option', statusCode: 400 };
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }), // Send URL in the request body as JSON
    });

    const result = await response.json(); // Expecting a JSON response
    return { message: JSON.stringify(result, null, 2), statusCode: response.status };
  } catch (error) {
    return { message: 'Error occurred', statusCode: 500 };
  }
}

function getResponse(message: string, setOptions: React.Dispatch<React.SetStateAction<boolean>>): string {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.startsWith('hi') || normalizedMessage.startsWith('hello')) {
    setOptions(true);
    return 'Hey there! I\'m WebSec. How can I help you today?';
  } else if (normalizedMessage.includes('help')) {
    return 'I can help you with SQL Injection, Website Stressing, Admin Passwords, or XSS Testing. Please select an option.';
  } else {
    return 'I\'m still learning. Could you please rephrase your question?';
  }
}

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [options, setOptions] = useState(false); // State to control displaying options
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Stores the user's selected option
  const [awaitingUrl, setAwaitingUrl] = useState(false); // Flag to check if the bot is waiting for the URL input
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  // Handle message submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message.trim()) {
      setMessages((prevMessages) => [...prevMessages, message]);

      // If the bot is awaiting a URL, trigger the API request
      if (awaitingUrl && selectedOption) {
        setMessages((prevMessages) => [...prevMessages, `You entered URL: ${message}`]);

        // Make the API request with the selected option and provided URL
        const { message: apiMessage, statusCode } = await requestApi(selectedOption, message);

        // Handle the response based on the status code
        if (statusCode === 200) {
          setMessages((prevMessages) => [...prevMessages, `Response: ${apiMessage}`]);
        } else {
          setMessages((prevMessages) => [...prevMessages, `Error: ${apiMessage}`]);
        }

        // Reset flags and inputs
        setAwaitingUrl(false);
        setSelectedOption(null);
      } else {
        // Generate the chatbot's response
        const response = getResponse(message, setOptions);
        setMessages((prevMessages) => [...prevMessages, response]);
      }

      setMessage('');
      inputRef.current?.focus();
    }
  };

  // Handle option selection and ask for URL input
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setMessages((prevMessages) => [...prevMessages, `You selected option ${option}`]);

    // Ask for the URL after selecting an option
    setMessages((prevMessages) => [...prevMessages, 'Please enter the URL for testing:']);
    setAwaitingUrl(true); // Now wait for the user to enter the URL
  };

  // Handle chat clearing
  const handleClearChat = () => {
    setMessages([]);
    setOptions(false);
    setAwaitingUrl(false);
    setSelectedOption(null);
  };

  return (
    <div className="chatbot-container mx-5">
      <motion.div
        className="chat-messages"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      ></motion.div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div className="" key={index}>
            {msg}
          </div>
        ))}
      </div>

      {/* Display options if required */}
      {options && !awaitingUrl && (
        <div className="options-container">
          <button onClick={() => handleOptionClick('1')} className="mx-2 py-2 px-4 bg-blue-500 text-white rounded">
            1. SQL Attack
          </button>
          <button onClick={() => handleOptionClick('2')} className="mx-2 py-2 px-4 bg-green-500 text-white rounded">
            2. Website Stressing
          </button>
          <button onClick={() => handleOptionClick('3')} className="mx-2 py-2 px-4 bg-yellow-500 text-white rounded">
            3. Admin Passwords
          </button>
          <button onClick={() => handleOptionClick('4')} className="mx-2 py-2 px-4 bg-red-500 text-white rounded">
            4. XSS Testing
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <button className="mx-1.5 border-2 border-red px-5 bg-sky-950 rounded-xl py-1.5" onClick={handleClearChat}>
          Clear Chat
        </button>

        <input
          className="text-white rounded-xl px-3 bg-transparent border-red"
          type="text"
          placeholder={awaitingUrl ? 'Enter the URL...' : 'Type your message...'}
          value={message}
          onChange={handleInputChange}
          ref={inputRef}
        />
        <button className="mx-3 border-2 border-red px-5 py-2 bg-sky-950 rounded-xl" type="submit">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
