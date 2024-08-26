const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/gemini", upload.single("image"), async (req, res) => {
  try {
    const { message } = req.body;
    // console.log("This is vivek sharma consoling start");
    const imageFile = req.body.image.split(",").at(-1);
    // console.log(imageFile);
    // console.log("This is vivek sharma consoling stop");

    if (!imageFile) {
      return res.status(400).send("Image file is required.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const imageData = imageFile.toString("base64"); // Convert buffer to base64
    // console.log(imageData);

    const result = await model.generateContent([
      message,
      {
        inlineData: {
          data: imageData,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const text = result.response.text();
    console.log(text);
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred during processing.");
  }
});

app.listen(8000, () => {
  console.log("App is listening at 8000");
});