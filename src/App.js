import React, { Component } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    // Add initial message from bot to messages list
    this.setState({
      messages: [
        {
          sender: 'bot',
          message: 'Welcome to Beary Bot! I answer questions based on the dataset of all Beary movies and TV show scripts. Here are a few things you can ask me:',
        },
        {
          sender: 'bot',
          message: '-> What is the name of the ship in Star Trek?',
        },
        {
          sender: 'bot',
          message: '-> Who is the captain of the USS Enterprise?',
        },
      ],
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const userMessage = event.target.userInput.value;
    this.sendMessage(userMessage);
    event.target.userInput.value = '';
  };

  async sendMessage(userMessage) {
    try {
      const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
      const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const model = 'gpt-3.5-turbo';
  
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      };
  
      const requestData = {
        model: model,
        messages: [
          { role: 'system', content: 'You are a user' },
          { role: 'user', content: userMessage },
        ],
      };
  
      const response = await axios.post(openaiEndpoint, requestData, {
        headers: headers,
      });
  
      const botReply = response.data.choices[0].message.content;
  
      this.setState((prevState) => ({
        messages: [
          ...prevState.messages,
          { sender: 'user', message: userMessage },
          { sender: 'bot', message: botReply },
        ],
      }));
    } catch (error) {
      console.error('Error sending API request:', error);
    }
  }
  

  render() {
    return (
      <div className="chatbot">
        <div className="chat-window">
          {this.state.messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <span>{message.message}</span>
            </div>
          ))}
        </div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="userInput" placeholder="Type your message here" />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}

export default App;
