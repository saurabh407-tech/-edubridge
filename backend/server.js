const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const { initSocket } = require("./sockets");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const resourceRoutes = require("./routes/resources");
const bookRoutes = require("./routes/books");
const projectRoutes = require("./routes/projects");
const mentorshipRoutes = require("./routes/mentorship");
const opportunityRoutes = require("./routes/opportunities");
const messageRoutes = require("./routes/messages");
const notificationRoutes = require("./routes/notifications");
const universityRoutes = require("./routes/universities");
const aiRoutes = require("./routes/ai");
const adminRoutes = require("./routes/admin");
const statsRoutes = require("./routes/stats");

// Connect to DB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Init socket
initSocket(io);

// Global middleware
app.use(helmet());
app.set("trust proxy", 1);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  trustProxy: true,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stats", statsRoutes);

app.get("/api/health", (req, res) => res.json({ status: "OK", env: process.env.NODE_ENV }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
