import React from "react";
import { Router, Route } from 'react-router-dom';
import Navbar from './Navbar';
import LiveStreams from './LiveStreams';
import Settings from './Settings';
import axios from "axios";
import VideoPlayer from './VideoPlayer';
const customHistory = require("history").createBrowserHistory();



export default class Root extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
        }
    }
    componentDidMount() {
        axios.get('/login', {
        }).then((res,req) => {
            this.setState({
                username: req.user.username
            })
            console.log(req.user.username);
        })
      
    }
    render() {
        return (

            <Router history={customHistory} >
                <div>
                    <Navbar />
                    <Route exact path="/" render={props => (
                        <LiveStreams  {...props} />
                    )} />

                    <Route exact path="/stream/:username" render={(props) => (
                        <VideoPlayer {...props} />

                    )} />



                    <Route exact path="/settings" render={props => (
                        <Settings {...props} />
                    )} />
                </div>
            </Router>

        )
    }

}