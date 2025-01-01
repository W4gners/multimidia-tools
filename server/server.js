const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }

  const inputPath = req.file.path;
  const outputPath = path.join('uploads', `${req.file.filename}.txt`);

  try {
    // Executar Whisper
    await new Promise((resolve, reject) => {
      exec(`whisper "${inputPath}" --output_dir uploads --output_format txt`, (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve(stdout);
      });
    });

    // Ler o resultado
    const transcription = await fs.readFile(outputPath, 'utf8');

    // Limpar arquivos temporários
    await fs.unlink(inputPath);
    await fs.unlink(outputPath);

    res.json({ transcription });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process audio' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
