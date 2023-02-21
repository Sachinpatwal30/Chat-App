const mongoose = require("mongoose");


const connectDB = async () => {

    try {

        mongoose.set('strictQuery', false)
        mongoose.connect(process.env.MONGODB_URL);

        console.log("Successfully Connected to MongoDB");

    } catch (error) {

        console.log(error);
    }
}

module.exports = connectDB;


