const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const backendDir = path.join(__dirname, '..', 'backend');
let pythonExe = path.join(backendDir, '.venv', 'Scripts', 'python.exe');

if (!fs.existsSync(pythonExe)) {
  pythonExe = path.join(backendDir, '.venv', 'bin', 'python');
}

if (!fs.existsSync(pythonExe)) {
  pythonExe = 'python';
}

console.log(`[VisionGuard] Starting Python FastAPI backend using ${pythonExe}...`);

const backend = spawn(pythonExe, ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true,
});

backend.on('error', (err) => {
  console.error('[VisionGuard Backend Error]:', err);
});

backend.on('exit', (code) => {
  console.log(`[VisionGuard Backend] Exited with code ${code}`);
});

process.on('SIGINT', () => {
  backend.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  backend.kill('SIGTERM');
  process.exit();
});
