// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

const imageSchema = new mongoose.Schema({
  image: { type: String, required: true },
});

const Image = mongoose.model('Image', imageSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for uploading images
app.post('/upload', upload.single('image'), async (req, res) => {
  const newImage = new Image({ image: req.file.buffer.toString('base64') });
  await newImage.save();
  res.json({ message: 'Image saved successfully!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

