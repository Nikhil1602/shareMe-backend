import { Router } from "express";
import File from "../models/file.js";
import dotenv from "dotenv";

dotenv.config();

const show = Router();

show.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({
      uuid: req.params.uuid,
    });

    if (!file) {
      return res.render("download", { error: "Link has been expired !!" });
    }

    return res.render("download", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (e) {
    return res.render("download", { error: "Something went wrong !!" });
  }
});

export default show;
