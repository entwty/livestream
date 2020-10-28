import React from 'react';
import videojs from 'video.js'
import axios from 'axios';
import config from '../../server/config/default';
import Message from './Message';
import { Grid } from 'semantic-ui-react';


export default class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            stream: false,
            videoJsOptions: null
        }
    }
//Chatin Olucağı sayfa 
    componentDidMount() {

        axios.get('/user', {
            params: {
                username: this.props.match.params.username
            }
        }).then(res => {
            this.setState({
                stream: true,
                videoJsOptions: {
                    autoplay: false,
                    controls: true,
                    sources: [{
                        src: 'http://89.43.28.196:' + config.rtmp_server.http.port + '/live/' + res.data.stream_key + '/index.m3u8',
                        type: 'application/x-mpegURL'
                    }],
                    fluid: true,
                }
            }, () => {
                this.player = videojs(this.videoNode, this.state.videoJsOptions, function onPlayerReady() {
    
                });
            });
        })
    }

    componentWillUnmount() {
        if (this.player) {
            this.player.dispose()
        }
    }

    render() {
        return (
 
                <div className="col-xs-5 col-sm-8 col-md-2 col-lg-7 mx-auto mt-4">
                    {this.state.stream ? (
                        <div data-vjs-player>
                            <video ref={node => this.videoNode = node} className="video-js vjs-big-play-centered"/>
                        </div>
                    ) : ' Loading ... '}
                </div>
         


 
  

        )
 
    }


}
