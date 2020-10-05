import axios from "axios";
import React from "react";
import io from "socket.io-client";

export default class Message extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chatsMessage:'',
      chatMessages: [],

    };
  }
  
  componentDidMount() {

    this.socket = io("http://127.0.0.1:3333");
    this.socket.on("chat message", msg => {
      this.setState({
        chatMessages: [...this.state.chatMessages, msg]
      });
    });
  }
  submitChatMessage() {
    this.socket.emit('chat message', this.state.chatMessage);
    this.setState({ chatMessage: this.inputchatMessage.value});
  }


  render() {

    // const chatMessages = this.state.chatMessages.map(chatMessage => (
    //   <div className="chatroomContent">{chatMessage}</div>
    // ));
    return (
      <div className="chatroomPage">
        <div className="chatroomSection">
        <div className="chatroomContent">
          {this.state.chatMessages.map((chatMessage, i) => (
            <div key={i} className="message">
              <span
              className={ "ownMessage" }
              >
                 entwty:
           
    
              </span>
              {chatMessage}
            </div>
          ))}
        </div>
            <div className="chatroomActions">
              <div>
                <input
                  type="text"
                  name="message"
                  placeholder="Say something!"
                  ref={messageRef => this.inputchatMessage = messageRef} 
                />
              </div>
              <div>
              <button className="join" onClick={() => this.submitChatMessage()}
                  >
                  Gönder
            </button>
            </div>
            </div>
          </div>
        </div>

    )
  }

}