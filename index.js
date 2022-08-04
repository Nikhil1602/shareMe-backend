import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import connnectDB from "./config/db.js";
import router from "./routes/files.js";
import show from "./routes/show.js";
import download from "./routes/download.js";

const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.static("public"));
app.use(express.json());
connnectDB();

const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
};

app.use(cors(corsOptions));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Routes
app.use("/api/files", router);
app.use("/files", show);
app.use("/files/download", download);

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});
