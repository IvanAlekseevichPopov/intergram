import dateFormat from 'dateformat'
import { h, Component } from 'preact';

const dayInMillis = 60 * 60 * 24 * 1000;

export default class MessageArea extends Component {

    componentDidMount() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    render(props,{}) {
        const currentTime = new Date();
        return (
            <ol class="chat">
                {props.messages.map(({name, text, from, time}) => {
                    text = text.replace(/\bhttps?:\/\/\S[^()]+/gi, '<a href="$&" target="_blank" rel="nofollow">$&</a>');
                    text = name ? name + ': ' + text : text

                    if (from === 'visitor') {
                        name = props.conf.visitorPronoun;
                    }
                    return (
                        <li class={from}>
                            <div class="msg">
                                <p dangerouslySetInnerHTML={{ __html: text }} />
                                { (props.conf.displayMessageTime) ?
                                    <div class="time">
                                        {
                                            currentTime - new Date(time) < dayInMillis ?
                                                dateFormat(time, "HH:MM") :
                                                dateFormat(time, "m/d/yy HH:MM")
                                        }
                                    </div> 
                                    :
                                    ''
                                }
                            </div>
                        </li>
                    );
                })}
            </ol>
        );
    }

}
