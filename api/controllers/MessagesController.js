const { getUserDataFromToken } = require("../config/verify");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

module.exports.sendMessage = async(req, res)=>{
    const {token} = req.cookies;
    const {content, chatId} = req.body;
    const userData = await getUserDataFromToken(token)

    const newMsg = {
        sender: userData.id,
        content: content,
        chat: chatId
    }
    try {
        await Message.create(newMsg).then(async (message) =>{
            await Message.populate(message, {path: 'sender', select:'username email'})
            await Message.populate(message, {path: 'chat'})
            await Message.populate(message, {path: 'chat.users', select:'username email'})
            
            await Chat.findByIdAndUpdate(chatId, {
                latestMessage: message
            })
            res.json(message);
        }).catch((err)=>{
            res.status(500).json(err)
        })

    } catch (error) {
        res.status(422).json(error);
        throw new Error(error);
    }
}

module.exports.getAllMessages = async(req, res)=>{
    const {id} = req.params
    try {
        const allMessages = await Message.find({chat: id})
        .populate("sender", "username email")
        .populate("chat")

        res.json(allMessages);
    } catch (error) {
        res.status(422).json(error);
        throw new Error(error);
    }
}