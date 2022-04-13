var io = require('socket.io-client');
const socket = io('https://socketkeyboard.herokuapp.com/', {query: 'type=listener'});
const sendkeys = require('sendkeys');

var uuid = "";

socket.on("connection-ack", (data) => {
    socket.off("resp-"+uuid);
    uuid = data.uuid;

    console.log("New UUID --> " + uuid);

    socket.on("resp-"+uuid, (data)=> {
        for(var i=0; i<data.message.length; i++) {
            try {sendkeys.sync(data.message[i]);}
            catch(e) {console.log("Some characters will not be typed");}
        }
    })
})