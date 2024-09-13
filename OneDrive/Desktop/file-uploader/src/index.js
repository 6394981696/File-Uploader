const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('./cloudinary');
const app = express();
const port = 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Error uploading to Cloudinary', error });
      }

      res.status(200).json({
        message: 'File uploaded successfully',
        imageUrl: result.secure_url,
      });
    }).end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

