const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const executeCode = (req, res) => {
  const { language, code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code is required.' });
  }

  const languageConfig = {
    python: {
      extension: 'py',
      image: 'python:3.9-slim'
    },
    javascript: {
      extension: 'js',
      image: 'node:18-slim'
    }
  };

  if (!languageConfig[language]) {
    return res.status(400).json({ message: `Language '${language}' is not supported.` });
  }

  const { extension, image } = languageConfig[language];
  const uniqueId = crypto.randomBytes(8).toString('hex');
  // We will use the system's default temp directory for better compatibility
  const tempDir = path.join(require('os').tmpdir(), 'alx-code-executor');
  const filepath = path.join(tempDir, `${uniqueId}.${extension}`);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  fs.writeFileSync(filepath, code);

  const command = `docker run --rm --memory="256m" --cpus="0.5" -v "${tempDir}":/app ${image} ${language === 'javascript' ? 'node' : language} /app/${uniqueId}.${extension}`;

  // --- DEBUGGING ---
  // Log the exact command we are about to run.
  console.log('EXECUTING COMMAND:', command);

  exec(command, (error, stdout, stderr) => {
    // --- ROBUST CLEANUP ---
    // Always try to clean up the file, but don't let it crash the app.
    try {
      fs.unlinkSync(filepath);
    } catch (cleanupError) {
      console.error('Error during file cleanup:', cleanupError);
    }

    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ output: stderr || 'An error occurred during execution.' });
    }
    if (stderr) {
      return res.json({ output: stderr });
    }
    res.json({ output: stdout });
  });
};

module.exports = {
  executeCode
};
