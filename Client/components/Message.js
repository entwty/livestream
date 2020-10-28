import axios from "axios";
import React from "react";
import io from "socket.io-client";


export default class Message extends React.Component {

  constructor(props) {
    super(props);
   
    this.state = {
      chatsMessage:'',
      chatMessages: [],
      username:'',
     
      socket:this.props.socket,
      messages:[],
      userId:'',
      chatroomId:this.props.match.params.id,
    };


    this.setState(this.state.socket = this.props.socket)
 
  }
  componentWillUnmount(){


   
   this.leaveroom()
    
  }

  componentDidMount() {

      this.joinroom()
     this.getSocket()
  }
  getSocket () {
  
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
     this.state.userId = payload.id;

    }
  
    if (this.state.socket) {
      this.props.socket.on("newMessage", message => {

        this.setState({messages:[...this.state.messages, message]})
      
      });
    }
  }
  sendMessage = () => {
    var chatroomId = this.state.chatroomId;
    var message = this.inputchatMessage.value;

    if (this.state.socket) {
      this.props.socket.emit("chatroomMessage", {
        chatroomId,
        message,
      });
      

    }
  };
  joinroom(){
    var chatroomId = this.state.chatroomId;
   
    if (this.state.socket) {
      this.props.socket.emit("joinRoom", {
        chatroomId,
      });
    }
  }
  leaveroom(){
    var chatroomId = this.state.chatroomId;
    if (this.state.socket) {
      this.props.socket.emit("leaveRoom", {
        chatroomId,
      });
    }
  }


  render() {
  
    return (
      <div className="chatroomPage">
        <div className="chatroomSection">
        <div className="chatroomContent">
        {this.state.messages.map((message, index) => (
          
            <div key={index} className="message">
              <span
                className={
                  this.state.userId === message.userId ? "ownMessage" : "otherMessage"
                }
              >
                {message.name}:
              </span>{" "}
              {message.message}
            </div>
          ))}
        </div>
            <div className="chatroomActions">
              <div>
                <input
                  type="text"
                  name="message"
                  placeholder="Mesajınız"
                  ref={messageRef => this.inputchatMessage = messageRef} 
                  onChange={messageRef => {
                    this.setState({messageRef});
                  }}
                  
                />
              </div>
              <div>
              <button className="join" onClick={ () => this.sendMessage()}
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