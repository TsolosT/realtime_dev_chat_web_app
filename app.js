const port = process.env.PORT || 3000;

const path = require('path');
const express = require('express');
const http = require("http");
const socketio = require('socket.io');
const formatMessage = require('./app/utils/messages');
const { userJoin, getCurrentUser,userLeave,getRoomUsers } = require('./app/utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set uses
app.use(express.static(path.join(__dirname,'public')));

const botName = 'DevChat-Bot';

//Run when a user connects
io.on('connection', socket => {
 socket.on('joinRoom',({ username, room}) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

     //welcome the new user to the room
    socket.emit('message',formatMessage(botName,'Welcome to DevChat!'));
    //broadcast when a user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat room.`));
    //Send User & Room info
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    });
 });
 //Listen for chatMessage
 socket.on('chatMsg', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message',formatMessage(user.username,msg));
 });

  //run when a client disconnect
  socket.on('disconnect',()=>{
      const user = userLeave(socket.id);
     if(user)
     {
        io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat room.`));
         //Send User & Room info
        io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
        });
    }
    });

});

// Server Run on local env port or localhost:3000
server.listen(port,() =>
    {
        console.log(`Server running on port : ${port}`);
    });
