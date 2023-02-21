const User = require("../models/UserSchema");
const createError = require("./createError");
const jwt = require("jsonwebtoken");


const verifyToken = async (req, res, next) => {

    let token;
    if(req.headers.authorization && req. headers.authorization.startsWith("Bearer")) {

        try {
            token= req.headers.authorization.split(" ")[1];
            const decoded= jwt.verify(token, process.env.JWT_SECRET);
            req.user= await User.findById(decoded.id).select("-password");
            next();
            
        } catch (error) {

            res.status(401).json(createError(error.status,error.message));
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401).json("No Token Found");
        throw new Error("Not authorized, no token");
    }


}

module.exports= verifyToken;