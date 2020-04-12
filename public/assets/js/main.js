const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const roomUserList = document.querySelector('#users');

//Get username & room from url 
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });
  

const socket = io();

//Join a chat room 
socket.emit('joinRoom',{ username, room});
//Get Room & users
socket.on('roomUsers', ({ room, users})=>{
    outputRoomName(room);
    outputRoomUsers(users);
});
//Get Message from server
socket.on('message', message =>{
  // console.log(message); 
   outputMessage(message);
   //Scroll down to latest message
   chatMessages.scrollTop=chatMessages.scrollHeight;
});

//Message Submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //get input value(message)
    const msg = e.target.elements.msg.value;
    //emit the message to server 
    socket.emit('chatMsg',msg);
    //clear input&focus on it
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

});

//Output the message to DOM
function outputMessage(msg)
{   //create message elements
     const div = document.createElement('div');
     div.classList.add('message');
     div.innerHTML = `
     <p class="meta">${msg.username} <span>${msg.time}</span></p>
     <p class="text">
         ${msg.text}
     </p>
     `;
    //Append the message element to msg container
    document.querySelector('.chat-messages').appendChild(div);

}

//Add Room name to dom
function outputRoomName(room)
{
    roomName.innerText = room;
}

//Add Users to dom
function outputRoomUsers(users)
{
    roomUserList.innerHTML = `
        ${users.map( user => `<li>${user.username}</li>`).join('')}
    `;
}