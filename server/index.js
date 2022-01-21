const express = require('express');
const app = express();
const server = require("http").createServer(app);
const cors = require('cors');
const logger = require('./logger');
const passport = require('passport');

require('dotenv').config();
require('./config/db');
require('./config/passJWT');

const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
});

const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/', require('./api/routes'));


//Video Calling Server
io.on("connection", (socket) => {
    socket.emit("me", socket.id);
  
    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
      io.to(userToCall).emit("callUser", {
        signal: signalData,
        from,
        name,
      });
    });
  
    socket.on("updateMyMedia", ({ type, currentMediaStatus }) => {
      console.log("updateMyMedia");
      socket.broadcast.emit("updateUserMedia", { type, currentMediaStatus });
    });
  
    socket.on("msgUser", ({ name, to, msg, sender }) => {
      io.to(to).emit("msgRcv", { name, msg, sender });
    });
  
    socket.on("answerCall", (data) => {
      socket.broadcast.emit("updateUserMedia", {
        type: data.type,
        currentMediaStatus: data.myMediaStatus,
      });
      io.to(data.to).emit("callAccepted", data);
    });
    socket.on("endCall", ({ id }) => {
      io.to(id).emit("endCall");
    });
});


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// error handler middleware
app.use((error, req, res) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});

server.listen(port, (err) => {
    if (err) {
        logger.error(err);
    }
    logger.info(`Server started at http://localhost:${port}`);
});