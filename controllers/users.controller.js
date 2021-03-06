const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.addNotifs = async (req,res) => {
  const users = await User.updateMany({},{notifications: []} );
  res.json({success: true, users});
}

module.exports.signUpUser = async (req, res) => {
  const { firstName, lastName, email, username } = req.body;
  let { password } = req.body;

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    firstName,
    lastName,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    joinedOn: new Date().toISOString(),
    bio: "",
    notifications: [],
    followers: [],
    following: []
  })

  res.status(201).json({ success: true, newUser });
}

exports.logInUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).lean();

  if (user) {
    const passwordValid = await bcrypt.compare(password, user.password);

    if (passwordValid) {
      const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: "24h",
      });

      user.__v = undefined;
      user.password = undefined;

      return res.status(200).json({ success: true, token, user });
    }
  }

  return res
    .status(401)
    .json({ success: false, errorMessage: "email or password is incorrect" });
};

module.exports.getUserById = async (req, res) => {
  const { userId } = req;

  const user = await User.findById(userId).select("-password -__v").lean();

  res.status(200).json({ success: true, user });
}

module.exports.getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password -__v").lean();

  res.status(200).json({ success: true, users });
}

module.exports.updateFollowingAndFollowersCount = async (req, res) => {
  const { userId } = req;
  const { toFollowUserId } = req.body;

  let user = await User.findById(userId).select("-password -__v");
  let followUser = await User.findById(toFollowUserId).select("-password -__v");

  const userToFollowIndex = user.following.findIndex((user) => String(user) === toFollowUserId);

  if (userToFollowIndex !== -1) {
    //Removing from users following array
    user.following.splice(userToFollowIndex, 1);

    //Removing from followed users followers array
    const followingUserIndex = followUser.followers.findIndex((user) => String(user) === userId);
    followUser.followers.splice(followingUserIndex, 1);
  }
  else {
    //Adding to users following arary
    user.following.push(toFollowUserId);
    //Adding to followed users followers array
    followUser.followers.push(userId);
    followUser.notifications.push({
      from: userId,
      type: "follow",
      createdAt: new Date().toISOString()
    })

  }

  user = await user.save();
  followUser = await followUser.save();

  res.status(200).json({ success: true, user, followUser });
}

module.exports.updateUserData = async (req, res) => {
  const { userId } = req;
  const { editData } = req.body;

  const user = await User.findById(userId).select("-password -__v");
  Object.assign(user, editData);

  await user.save();

  res.status(200).json({ success: true, updatedUser: user });
}