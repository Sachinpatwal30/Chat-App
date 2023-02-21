const createError = require("../middleware/createError");
const Chat = require("../models/chatSchema");
const User = require("../models/UserSchema");



const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");



    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });



    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {

        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            return res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
};

const fetchChats = async (req, res) => {
    try {
        const results = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });



        // results = await User.populate(results, {
        //     path: "latestMessage.sender",
        //     select: "name pic email",
        // });

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json(error);
    }
};

const createGroupChat = async (req, res) => {


    if (!req.body.users || !req.body.name)
        return res.status(400).json("please fill all required fields");


    var users = JSON.parse(req.body.users);

    if (users.length < 2) {

        return res
            .status(400)
            .json("More than 2 users required to create a group chat");
    }



    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(500).json(error);
    }
};

const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404).json("chat not found");
        throw new Error("Chat not found");
    } else {

        res.json(updatedChat);
    }
};


const addToGroup = async (req, res) => {


    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(chatId, {

        $push: { users: userId }
    }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");


    if (!added) return res.status(404).json("Chat not found");

    res.status(200).json(added);

}


const removeFromGroup = async (req, res) => {

    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(chatId, {

        $pull: { users: userId }
    }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");


    if (!removed) return res.status(404).json("Chat not found");

    res.status(200).json(removed);



}



module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup };
