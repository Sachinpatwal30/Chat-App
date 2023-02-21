const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const AuthRoute = require("./routes/auth");
const errorHandler = require("./middleware/errorMiddleware");
const MessageRoute = require("./routes/messageRoute");
const ChatRoute = require("./routes/chatRoutes");

dotenv.config();

const app = express();
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("welcome");
});

app.use("/api/auth", AuthRoute);
app.use("/api/chat", ChatRoute);
app.use("/api/message", MessageRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,

    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on("setup", (userData) => {

        socket.join(userData._id);
        console.log("user logged in  ", userData.name);
        socket.emit("connected");
    });


    socket.on("join chat", (room)=>{
        socket.join(room);
        console.log("user joined room" ,room);

    });


    socket.on("new message" , (newMessageReceived )=>{


     //   console.log("new message received" , newMessageReceived);

        var chat= newMessageReceived.chat;

        if(!chat.users) return console.log("chat.user not defined");

        chat.users.forEach((user)=>{
            if(user._id === newMessageReceived.sender._id ) return;
            socket.in(user._id).emit("message received", newMessageReceived )

        })
    })

    socket.on("typing",(room)=> socket.in(room).emit("typing") );
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));


});
