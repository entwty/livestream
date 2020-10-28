import React from "react";
import { Router, Route } from 'react-router-dom';
import Navbar from './Navbar';
import LiveStreams from './LiveStreams';
import Settings from './Settings';
import makeToast from "../Toaster";
import axios from "axios";
import VideoPlayer from './VideoPlayer';
import Message from "./Message";
import io, { Socket } from "socket.io-client";
const customHistory = require("history").createBrowserHistory();



export default class Root extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            socket:null, 
            setSocket:[]
        }


    }
    
        componentDidMount(){
            axios.get("http://89.43.28.196/login/jwt", {

            }).then((res) => {
              makeToast("success", res.data.message);
              localStorage.setItem("CC_Token", res.data.token);

      
            this.setupSocket();
            })
     
        }
        
     setupSocket = () => {
        const token = localStorage.getItem("CC_Token");
        if (token && !this.state.socket) {
          const newSocket = io("http://89.43.28.196", {
            query: {
              token: localStorage.getItem("CC_Token"),
            },
          });
    
          newSocket.on("disconnect", () => {
            this.state.setSocket(null);
            setTimeout(this.setupSocket, 3000);
            makeToast("error", "Socket Disconnected!");
          });
    
          newSocket.on("connect", () => {
            makeToast("success", "Socket Connected!");
          });
    
         this.setState(this.state.setSocket = newSocket);


          this.setState(this.state.socket = this.state.setSocket)
     
        }
      };


    render() {
      const socket = this.state.socket;

        return (
         
            <Router history={customHistory} >
                <div>
                    <Navbar />
                    <Route exact path="/" setupSocket={this.setupSocket} render={props => (
                        <LiveStreams  {...props} />
                    )} />
<div className="row">
                    <Route exact path="/stream/:username/:id" render={(props) => (

                        <VideoPlayer {...props} />

                    )} />
                    
              <Route exact path="/stream/:username/:id"  socket={socket} render={(props) => (
                <div className="col-xs-5 col-sm-5 col-md-4 col-lg-4 mx-auto mt-2">
                <Message socket={socket} {...props} />
                </div>
              )} />
</div>

                    <Route exact path="/settings"  render={props => (
                        <Settings {...props} />
                    )} />
                </div>
            </Router>

        )
    }

}