const socketio = require('socket.io');
const cors = require('cors');
const { getUserDataFromToken } = require('./config/verify.js');
const Chat = require('./models/Chat.js');

// function hasId(map, id) {
//     for (const [key, value] of map.entries()) {
//         if(key === id) {
//             return true;
//         }
//     }
//     return false;
// }

// const clients = new Set();
let onlineUsers = [];
global.usersMap = new Map();

module.exports = function (server) {
    const io = socketio(server, {
        pingTimeout: 60000,
        cors: {
            origin: "*",
            credentials: true,
        }
    });

    io.on('connection', async (socket) => {
        // creating a room as soon as the user connects to the socket
        socket.on('setup', (user)=>{
            socket.join(user?._id);
            if(!onlineUsers.includes(user?._id)) onlineUsers.push(user?._id);
            usersMap.set(socket.id, user?._id);
            console.log(usersMap);
            socket.emit('connected')
        })

        // as soon as the user changes the chat we will join the user with that chat. room is like chatId
        socket.on('join-chat', (room)=>{
            socket.join(room);
        })

        // checking if the user is typing something or not
        socket.on('typing', ({selectedChat, user})=>{
            selectedChat.users.map(u=>{
                if(u?._id === user?._id){ return}

                // emit the msg to all users, because it can be a group chat as well.
                socket.in(u._id).emit("typing")
            })
        })
        socket.on('stop-typing', ({selectedChat, user})=>{
            selectedChat.users.map(u=>{
                if(u?._id === user?._id){ return}

                // emit the msg to all users, because it can be a group chat as well.
                socket.in(u._id).emit("stop-typing")
            })
        })
        
        // when user sends a message
        socket.on('new-msg', async (newMsg)=>{    
            let chat = newMsg.chat;
            // if user is not online then push the user inside unseenMessages
            let chatDoc = await Chat.findOneAndUpdate(
                { _id: chat._id },
                { $addToSet: { 'unSeenMessages.user': { $each: chat.users.filter(u => !onlineUsers.includes(u._id)).map(u => u._id) } } },
                { new: true }
            );
            if(chatDoc.unSeenMessages.user.length > 0) {
                chatDoc.unSeenMessages.count++;
                await chatDoc.save();
            }

            // we are not supposed to send the msg to the sender
            chat.users.map(user=>{
                if(user?._id === newMsg?.sender._id){ return}

                // emit the msg to all users, because it can be a group chat as well.
                socket.in(user._id).emit("msg-recieved", newMsg)
            })
        })

        socket.on("disconnect", (callback) => {
            const userId = usersMap.get(socket.id);
            if(onlineUsers.includes(userId)){
                onlineUsers.pop(userId);
            }
        });
        
    });
}

