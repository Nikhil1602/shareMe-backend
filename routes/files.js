import { Router } from "express";
import multer from "multer";
import path from "path";
import File from "../models/file.js";
import { v4 as uuidv4 } from "uuid";
import sendMail from "../services/email.js";
import template from "../services/template.js";
import dotenv from "dotenv";

dotenv.config();

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limits: { fileSize: 1000000 * 100 },
}).single("myfile"); // client-side form with the name attribute

const router = Router();

router.post("/", (req, res) => {
  upload(req, res, async (err) => {
    if (!req.file) {
      return res.json({ error: "All Fields are required!" });
    }

    if (err) {
      return res.status(500).send({ error: err.message });
    }

    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;

  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fields are required !!" });
  }

  const file = await File.findOne({ uuid: uuid });

  if (file.sender) {
    return res.status(422).send({ error: "Email already sent !!" });
  }

  file.sender = emailFrom;
  file.receiver = emailTo;

  const response = await file.save();

  const send = sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "shareMe file sharing",
    text: `${emailFrom} shared a file to you`,
    html: template({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + " KB",
      expires: "24 hours",
    }),
  });

  return res.send({ success: true });
});

export default router;
