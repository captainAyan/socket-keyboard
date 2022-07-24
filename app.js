var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

var emitter_list = [];
var listener_list = [];

io.on("connection", (socket) => {
  // on user connection
  console.log("Node connected");
  console.log(socket.handshake.query.type);

  if (socket.handshake.query.type == "emitter") {
    var uuid = generateUuid();
    console.log(uuid);
    emitter_list.push({
      socket: socket,
      uuid: uuid,
    });
    console.log("EMITTER CONN --> ", uuid);
  } else if (socket.handshake.query.type == "listener") {
    var uuid = generateUuid();
    console.log(uuid);
    listener_list.push({
      socket: socket,
      uuid: uuid,
    });
    console.log("LISTENER CONN --> ", uuid);
    socket.emit("connection-ack", { uuid: uuid });
  }
  // on user connection

  // on message sent
  socket.on("message", (data) => {
    console.log("resp-" + data.to);
    io.emit("resp-" + data.to, data);
  });
  // on message sent

  // on disconnect
  socket.on("disconnect", () => {
    for (let i = 0; i < emitter_list.length; i++) {
      if (emitter_list[i].socket.id == socket.id) {
        console.log(emitter_list[i].uuid);
        emitter_list.splice(i, 1);
      }
    }

    for (let i = 0; i < listener_list.length; i++) {
      if (listener_list[i].socket.id == socket.id) {
        console.log(listener_list[i].uuid);
        listener_list.splice(i, 1);
      }
    }

    console.log("EMITTER LEFT --> ", emitter_list.length);
    console.log("LISTENER LEFT --> ", listener_list.length);
  });
  // on disconnect
});

var port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("running on port " + port);
});

function generateUuid() {
  var result, i, j;
  result = "";
  for (j = 0; j < 32; j++) {
    if (j == 8 || j == 12 || j == 16 || j == 20) result = result + "-";
    i = Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase();
    result = result + i;
  }
  // result.split("-")[0]
  return result.split("-")[0];
}
