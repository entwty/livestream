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
                        src: 'http://127.0.0.1:' + config.rtmp_server.http.port + '/live/' + res.data.stream_key + '/index.m3u8',
                        type: 'application/x-mpegURL'
                    }],
                    fluid: true,
                }
            }, () => {
                this.player = videojs(this.videoNode, this.state.videoJsOptions, function onPlayerReady() {
                    console.log('onPlayerReady', this)
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
            <Grid>
            <div className="row">
                <div className="col-xs-10 col-sm-10 col-md-8 col-lg-8 mx-auto mt-5">
                    {this.state.stream ? (
                        <div data-vjs-player>
                            <video ref={node => this.videoNode = node} className="video-js vjs-big-play-centered"/>
                        </div>
                    ) : ' Loading ... '}
                </div>
         
                <div className="col-xs-4 col-sm-4 col-md-3 col-lg-4 mx-auto mt-5">
            <Message/>
            </div>
            </div>
 
  
            </Grid>
        )
 
    }


}
