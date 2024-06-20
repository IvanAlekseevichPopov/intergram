import * as store from 'store'
import io from 'socket.io-client'

import { h, Component } from 'preact';
import MessageArea from './message-area';

export default class Chat extends Component {

    autoResponseState = 'pristine'; // pristine, set or canceled
    autoResponseTimer = 0;

    constructor(props) {
        super(props);
        if (store.enabled) {
            this.messagesKey = 'messages' + '.' + props.chatId + '.' + props.host;
            this.state.messages = store.get(this.messagesKey) || store.set(this.messagesKey, []);
        } else {
            this.state.messages = [];
        }
    }

    componentDidMount() {
        this.socket = io.connect();
        this.socket.on('connect', () => {
            this.socket.emit('register', {projectId: this.props.projectId, chatId: this.props.chatId });
        });
        //TODO - why 2 subscriptions??
        this.socket.on(this.props.projectId, this.incomingMessage);
        this.socket.on(this.props.projectId+'-'+this.props.chatId, this.incomingMessage);

        if (!this.state.messages.length) {
            this.writeToMessages({text: this.props.conf.introMessage, from: 'admin'});
        }
    }

    render({},state) {
        return (
            <div>
                <MessageArea messages={state.messages} conf={this.props.conf}/>


                <div class="user-input-block">
                    <input class="textarea" type="text" placeholder={this.props.conf.placeholderText}
                           ref={(input) => {
                               this.input = input
                           }}
                           onKeyPress={this.handleKeyPress}/>
                    <button class="send-message" aria-disabled="false" onClick={this.sendMessage}>
                        <i size="20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 16 16"
                             style={{color: this.props.conf.mainColor}}>
                            <path fill="currentColor" fill-rule="evenodd"
                                  d="m4.394 14.7 9.356-5.4c1-.577 1-2.02 0-2.598L4.394 1.299a1.5 1.5 0 0 0-2.25 1.3v3.438l4.059 1.088c.494.132.494.833 0 .966l-4.06 1.087v4.224a1.5 1.5 0 0 0 2.25 1.299"
                                  clip-rule="evenodd">
                            </path>
                        </svg>
                    </i></button>
                </div>
            </div>
        );
    }

    handleKeyPress = (e) => {
        if (e.keyCode == 13 && this.input.value) {
            this.sendMessage()

            // if (this.autoResponseState === 'pristine') {
            //
            //     setTimeout(() => {
            //         this.writeToMessages({
            //             text: this.props.conf.autoResponse,
            //             from: 'admin'});
            //     }, 500);
            //
            //     this.autoResponseTimer = setTimeout(() => {
            //         this.writeToMessages({
            //             text: this.props.conf.autoNoResponse,
            //             from: 'admin'});
            //         this.autoResponseState = 'canceled';
            //     }, 60 * 1000);
            //     this.autoResponseState = 'set';
            // }
        }
    };

    sendMessage = () => {
        let text = this.input.value;
        this.socket.send({text, from: 'visitor', visitorName: this.props.conf.visitorName});
        this.input.value = '';
    }

    incomingMessage = (msg) => {
        this.writeToMessages(msg);
        if (msg.from === 'admin') {
            document.getElementById('messageSound').play();

            if (this.autoResponseState === 'pristine') {
                this.autoResponseState = 'canceled';
            } else if (this.autoResponseState === 'set') {
                this.autoResponseState = 'canceled';
                clearTimeout(this.autoResponseTimer);
            }
        }
    };

    writeToMessages = (msg) => {
        msg.time = new Date();
        this.setState({
            message: this.state.messages.push(msg)
        });

        if (store.enabled) {
            try {
                store.transact(this.messagesKey, function (messages) {
                    messages.push(msg);
                });
            } catch (e) {
                console.log('failed to add new message to local storage', e);
                store.set(this.messagesKey, [])
            }
        }
    }
}
