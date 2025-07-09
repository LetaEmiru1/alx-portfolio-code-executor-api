const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const executeCode = (req, res) => {
  // Check for our new environment variable "feature flag"
  if (process.env.DOCKER_ENABLED !== 'true') {
    return res.status(200).json({
      output: 'Code execution is disabled in this live environment for security and resource reasons.\nThis feature is fully functional in the local development environment.'
    });
  }

  // The rest of your existing code...
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
  const tempDir = path.join(require('os').tmpdir(), 'alx-code-executor');
  const filepath = path.join(tempDir, `${uniqueId}.${extension}`);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  fs.writeFileSync(filepath, code);

  const command = `docker run --rm --memory="256m" --cpus="0.5" -v "${tempDir}":/app ${image} ${language === 'javascript' ? 'node' : language} /app/${uniqueId}.${extension}`;

  console.log('EXECUTING COMMAND:', command);

  exec(command, (error, stdout, stderr) => {
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
