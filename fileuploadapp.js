const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Define the upload directory path
const directoryPath = 'uploads/';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });

// Serve the HTML form for file upload
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return next(new Error('No file uploaded.'));
  }

  // Access the uploaded file information
  const uploadedFile = req.file;
  console.log('Uploaded file:', uploadedFile);

  fs.readdir(directoryPath, (err,files)=>{
    if (err) {
      return res.status(500).send('Error reading directory.');
    }
    strfilenames = `<a href='/'>Home</a><br/>`;

    files.forEach((file)=>{
      strfilenames = `${strfilenames} <a target='_blank' href='file/${file}'>${file}</a><br/>`;
    });
    res.send(strfilenames)
  });

});

// Serve uploaded files using express.static middleware
app.use('/file', express.static('uploads'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});