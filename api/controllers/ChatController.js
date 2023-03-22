const User = require("../models/User.js");
const { getUserDataFromToken } = require('../config/verify.js');
const Chat = require("../models/Chat.js");
const Message = require("../models/Message.js");

module.exports.chats = async (req, res) => {
    // if the chat exists with this userId then return else create a chat.
    const { userId } = req.body;
    const { token } = req.cookies;
    const userData = await getUserDataFromToken(token);

    if (!userId) {
        return res.status(400).json(null);
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: userData.id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "username email"
    })

    if (isChat.length > 0) {
        res.json(isChat[0]);
    }

    // create a new chat
    else {
        const chatData = {
            chatName: "sender",
            isGrouptChat: false,
            users: [userData.id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat)

        } catch (err) {
            res.status(422).json(err);
        }
    }
}

// fetch all the chats made by the user
module.exports.fetchChat = async (req, res) => {
    try {
        const {token} = req.cookies;
        const userData = await getUserDataFromToken(token)
        await Chat.find({ users: { $elemMatch: { $eq: userData.id} } })
        .populate("users" , "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async (result) =>{
            result = await User.populate(result, {
                path: "latestMessage",
                select: "username email"
            })
            res.json(result);
        }).catch(err=> res.json(null));

    } catch (error) {
        res.status(422).json(error);
    }
}

module.exports.createGroupChat = async(req, res)=>{
    let users = req.body.users;
    const {token} = req.cookies;
    const userData = await getUserDataFromToken(token);
    // owner also will be a part of the chat
    users.push(userData.id);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: userData.id
        })
        
        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.json(fullGroupChat);
    } catch (error) {
        res.status(422).json(error);
    }
    
}

module.exports.renameGroup = async(req, res)=>{
    const {chatId, chatName} = req.body;

    try {
        const updatedChat = await Chat.findByIdAndUpdate(chatId, {chatName}, {new: true})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.json(updatedChat);
    } catch (error) {
        res.status(422).json(error);
    }
    
}

module.exports.addInGroup = async(req, res)=>{
    const {chatId, userId} = req.body;

    try {
        const chat = await Chat.findByIdAndUpdate(chatId, {$push: {users: userId}}, {new: true})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.json(chat);
        res.status(422).json(err);
        throw new Error(err.message);
    } catch (error) {
        res.status(422).json(error);
        
    }
}

module.exports.removeFromGroup = async(req, res)=>{
    const {chatId, userId} = req.body;

    try {
        const chat = await Chat.findByIdAndUpdate(chatId, {$pull: {users: userId}}, {new: true})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.json(chat);
    } catch (error) {
        res.status(422).json(error);
    }
}


module.exports.deleteChat = async(req, res)=>{
    const{chatId} = req.body;
    try {
        await Message.deleteMany({chat : chatId}).then( async (data)=>{
            await Chat.findByIdAndDelete(chatId).then((data)=>{
                res.json(true);
            }).catch(err=>{
                res.status(500).json(err);
            })
        }).catch(err=>{
            res.status(500).json(err);
        })
    } catch (error) {
        res.status(422).json(error);
    }
}

module.exports.blockChat = async(req, res)=>{
    const {chatId} = req.body;
    try {
        await Chat.findByIdAndUpdate(chatId, {isBlocked: true}, {new:true}).then((data)=>{
            res.json(true)
        }).catch(err=>{
            res.status(500).json(err);
        })
    } catch (error) {
        res.status(422).json(error);
    }
}