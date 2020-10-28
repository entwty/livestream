import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './LiveStreams.scss';
import config from '../../server/config/default';




export default class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            live_streams: [],
            chatrooms: [],
            chatroomid:'',
        }

    }


    componentDidMount() {
        this.getLiveStreams();
        this.getChatrooms();
    }

    getLiveStreams() {
        axios.get('http://89.43.28.196:' + config.rtmp_server.http.port + '/api/streams')
            .then(res => {
                let streams = res.data;
                if (typeof (streams['live'] !== 'undefined')) {
                    this.getStreamsInfo(streams['live']);

                }

            });

    }
    getChatrooms = () => {
        axios
            .get("http://89.43.28.196:3333/chatroom")
            .then((res) => {
                this.setState(this.state.chatrooms = res.data);

            })
            .catch((err) => {
                setTimeout(getChatrooms, 3000);
            });
    };
    createChatroom = (test) => {


        axios.post("http://89.43.28.196:3333/chatroom", {

            name: test

        })
            .then((res, req) => {
                this.setState(this.state.name = this.streamname)
             
            })
    }

    getStreamsInfo(live_streams) {
        axios.get('/streams/info', {
            params: {
                streams: live_streams
            }
        }).then(res => {
            this.setState({
                live_streams: res.data
            }, () => {
               
            });
        });
    }
    //Canlı yayınların listelendiği sayfa
    render() {


        let streams = this.state.live_streams.map((stream, index) => {
   
            this.state.chatrooms.map((chatroom, index) => {
                if (chatroom.name ===stream.stream_key) {
                this.state.chatroomid = chatroom._id
                }
            })
            var test = stream.stream_key;
            this.createChatroom(test);
            return (
                <div className="stream col-xs-12 col-sm-12 col-md-3 col-lg-4" key={index}>
                    <span className="live-label">Canlı</span>
                    <Link to={'/stream/' + stream.username  + "/" + this.state.chatroomid} >
                        <div className="stream-thumbnail">
                            <img src={'/thumbnails/' + stream.stream_key + '.png'} />
                        </div>
                    </Link>

                    <span className="username" >
                        <Link to={'/stream/' + stream.username + "/" + this.state.chatroomid}  >
                            {stream.username}
                        </Link>
                    </span>
                </div>
                
            );
            
       });

        return (
            <div className="container mt-5">
                <h4>Canlı Yayınlar</h4>
                <hr className="my-4" />

                <div className="streams row" >
                    {streams}
                </div>
            </div>
        )
    }
}