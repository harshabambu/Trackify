const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const collabRoutes = require("./routes/collabRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const DB_URI = process.env.DB_URI;

// ✅ Connect to MongoDB (No Deprecated Options)
mongoose
  .connect(DB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("🚨 MongoDB Connection Error:", err);
    process.exit(1); // 🔥 Exit the server if MongoDB fails
  });

// ✅ Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/collaboration", collabRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Fix "Port Already in Use" Error
const PORT = process.env.PORT || 5000;

app.get('/', (req,res)=>{
  res.send('Server is running....')
})

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`⚠️ Port ${PORT} is already in use. Trying another port...`);
    app.listen(PORT + 1, () => console.log(`✅ Server running on port ${PORT + 1}`));
  } else {
    console.error("🚨 Server Error:", err);
  }
});
