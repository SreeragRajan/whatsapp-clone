import dotenv from "dotenv";
import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";

import messageRoutes from "./src/routes/messages.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

const PORT = process.env.PORT || 4000;

// MongoDB connection
connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error", err);
  });

// Routes
app.use("/api", messageRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

export default app;
