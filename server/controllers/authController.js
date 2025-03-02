const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: "Email already in use" });
  
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
  
      res.status(201).json({ 
        message: "User registered successfully",
        userId: user._id, 
        username: user.username, 
        email: user.email 
      });
    } catch (error) {
      res.status(500).json({ error: "Error registering user" });
    }
  };
  
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Send user details
    res.json({ userId: user._id, username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};
