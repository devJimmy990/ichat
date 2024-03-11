const express = require('./packages/node_modules/express');
const port = process.env.PORT || 7050;
const files = require("./files")
const app = express();
const server = app.listen(port, () => {
  console.log(`Running on: http://localhost:${port}`);
});
const io = require('./packages/node_modules/socket.io')(server);
let userCounter = new Set();






io.on('connection', onConnected);

function onConnected(socket) {
  userCounter.add(socket.id);
  io.emit("user-counter", userCounter.size);

  socket.on("disconnect", () => {
    userCounter.delete(socket.id);
    io.emit("user-counter", userCounter.size);
  })


  socket.on("msg", (data) => {
    socket.broadcast.emit("chat-msg", data);
  });
  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
}

//#region Get Requests
app.get('/favicon.ico', (req, res) => {
  res.sendFile(files.ico_site);
});
app.get('/', (req, res) => {
  res.sendFile(files.html_main);
});

//#region Images
app.get("/src/male.png", (req, res) => {
  res.sendFile(files.img_male);

});
app.get("/src/female.png", (req, res) => {
  res.sendFile(files.img_female);
});
app.get("/src/send.png", (req, res) => {
  res.sendFile(files.img_send);
});
app.get("/src/bg.jpg", (req, res) => {
  res.sendFile(files.img_bg);
});
//#endregion

//#region Bootstrap
app.get("/bootstrap/node_modules/bootstrap/dist/css/bootstrap.min.css", (req, res) => {
  res.sendFile(files.css_bootstrap)
})
app.get("/bootstrap/node_modules/bootstrap/dist/js/bootstrap.min.js", (req, res) => {
  res.sendFile(files.js_bootstrap)
})
//#endregion

//#region Scripts
app.get("/Server/packages/node_modules/socket.io/client-dist/socket.io.js", (req, res) => {
  console.log
  res.sendFile(files.js_socket)
})
app.get("/script.js", (req, res) => {
  res.sendFile(files.js_script)
})
//#endregion

//#endregion
