const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/stream/:video', (req, res) => {
    const videoPath = path.join(__dirname, 'videos', req.params.video);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    console.log("range : " + range);

  
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');

      console.log("parts : " + parts);

      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;

       console.log("chunkSize : " + chunkSize);

      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  });

  
const port = 3001;
app.listen(port, () => {
  console.log(`File IO - Server is running on port ${port}`);
});

