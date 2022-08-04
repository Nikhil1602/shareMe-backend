import File from "./models/file.js";
import fs from "fs";
import connnectDB from "./config/db.js";

connnectDB();

const deleteData = async () => {
  const pastData = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const files = await File.find({ createdAt: { $lt: pastData } });

  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.remove();
      } catch (err) {
        console.log(err);
      }
    }
  }
};

deleteData().then(process.exit);
