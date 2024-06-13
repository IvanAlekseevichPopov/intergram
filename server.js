const request = require('request');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('dist', {index: 'demo.html', maxage: '4h'}));
app.use(bodyParser.json());

// handle admin Telegram messages
app.post('/hook', function(req, res){
    console.log("Hook request");
    console.log(req.body);
    try {
        // const message = req.body.message || req.body.channel_post;
        const chatId = req.body.chat_id;
        const name = req.body.manager_name || "admin";
        const text = req.body.text || "";
        // const reply = message.reply_to_message;

        // if (text.startsWith("/start")) {
        //     console.log("/start chatId " + chatId);
        //     sendTelegramMessage(chatId,
        //         "*Welcome to Intergram* \n" +
        //         "Your unique chat id is `" + chatId + "`\n" +
        //         "Use it to link between the embedded chat and this telegram chat",
        //         "Markdown");
        // } else
        // if (reply) {
            // let replyText = reply.text || "";
            // let userId = replyText.split(':')[0];
            io.to(chatId).emit(chatId, {name, text, from: 'admin'});
        // } else if (text){
        //     io.emit(chatId, {name, text, from: 'admin'});
        // }

    } catch (e) {
        console.error("hook error", e, req.body);
    }
    res.json = {"ok": true}
    res.statusCode = 200;
    res.end();
});

// handle chat visitors websocket messages
io.on('connection', function(socket){

    socket.on('register', function(registerMsg){
        let chatId = registerMsg.chatId;
        let messageReceived = false;
        socket.join(chatId);
        console.log(" connected to chatId " + chatId);

        socket.on('message', function(msg) {
            messageReceived = true;
            io.to(chatId).emit(chatId, msg);
            let visitorName = msg.visitorName ? "[" + msg.visitorName + "]: " : "";
            sendTelegramMessage(chatId, visitorName + " " + msg.text);
        });

        socket.on('disconnect', function(){
            if (messageReceived) {
                sendTelegramMessage(chatId,  chatId + " has left");
            }
        });
    });
});

function sendTelegramMessage(chatId, text, parseMode) {
    //TODO retries here
    request
        .post(process.env.API_HOST + '/messages', null, (response) => {console.log(response)})
        // .post('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage')
        .json({
            "chat_id": chatId,
            "text": text,
            // "parse_mode": parseMode
        });
        // .form({
        //     "chat_id": chatId,
        //     "text": text,
        //     "parse_mode": parseMode
        // });
}

app.post('/usage-start', cors(), function(req, res) {
    console.log('usage from', req.query.host);
    res.statusCode = 200;
    res.end();
});

// left here until the cache expires
app.post('/usage-end', cors(), function(req, res) {
    res.statusCode = 200;
    res.end();
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on port:' + (process.env.PORT || 3000));
});

app.get("/.well-known/acme-challenge/:content", (req, res) => {
    res.send(process.env.CERTBOT_RESPONSE);
});
