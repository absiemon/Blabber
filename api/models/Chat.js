const mongoose = require("mongoose");

const chatModel = mongoose.Schema({
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isBlocked: {type: Boolean},
        allMessagesDeleted: [{type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        // unSeenMessages:{
        //     user: [{type: String }],
        //     count: {type:Number, default: 0}
        // },
        unSeenMessages:[
            {user:{type: String }, count: {type: Number, default:0}}
        ]
    },
    { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;