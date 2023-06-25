const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const secretKey = process.env.KEY;

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.amazonclone;
    const verifyToken = jwt.verify(token, secretKey);
    console.log(verifyToken);
    // verifyToken will return an id

    // matching the userid and verifyToken id if matched than it is the same  user than save item to the user cart page
    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    //first _id is database id and secondone is token id  from cookie
    console.log(rootUser);
    if (!rootUser) {
      throw new Error("user not found");
    }
    // if requesting from router than send data like this
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (error) {
    res.status(401).send("unautherized:No token provide");
    console.log(error);
  }
};
module.exports = authenticate;
