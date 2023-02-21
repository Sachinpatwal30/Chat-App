const Chat = require("../models/chatSchema");
const Message = require("../models/messageSchema");
const User = require("../models/UserSchema");

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400).json("Invalid data passed into request");
    }

    var newMessage = {
        sender: req.user._id,
        content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");

        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message,
        }),
            res.status(200).json(message);
    } catch (error) {
        console.log("inside error");

        res.status(400).json(error);
    }
};


const allMessages= async (req, res)=>{

    try {

        const message= await Message.find({chat: req.params.chatId}).populate("sender"," name email pic").populate("chat");
        res.status(200).json(message);
        
    } catch (error) {

        res.status(400).json(error);
        
    }
}

module.exports = { sendMessage, allMessages };
