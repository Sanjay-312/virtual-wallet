const User = require("../../models/userSchema");
const bcrypt = require("bcrypt");
const Wallet = require("../../models/walletSchema");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const wallet = new Wallet({ userId: user._id, balance: 0 });
    await wallet.save();
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user._id,wallet });
  } catch (error) {
    return res.json({
      code: 400,
      message: error.message,
      error: error.name,
      userData: null,
    });
  }
};

// Get user details by ID
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    return res.json({
      code: 400,
      message: error.message,
      error: error.name,
      userData: null,
    });
  }
};

module.exports = { registerUser, getUser };
