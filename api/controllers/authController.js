const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const generateJwtToken = require("../config/generateJWTToken");

const registerUser = async (req, res) => {
    const { name, email, password, pic } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword,
        pic,
    });


    try {
        const savedUser = await user.save();

        res.status(200).json({ id: savedUser._id, name: savedUser.name, email: savedUser.email, pic: savedUser.pic, token: generateJwtToken(savedUser._id) });
    } catch (error) {
        return next(error)
    }
};

const loginUser = async (req, res) => {


    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json("USER Not Found");

    if (! await bcrypt.compare(password, user.password))
        return res.status(503).json("Invalid Password");

        const token= generateJwtToken(user._id);

  
    res.status(200).json({ ...user._doc, token });

}


const allUser= async (req, res) =>{

    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ],
    }
        : {};


    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);


}


module.exports = { registerUser, loginUser, allUser };
