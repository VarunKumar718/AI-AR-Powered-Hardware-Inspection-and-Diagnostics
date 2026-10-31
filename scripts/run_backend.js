const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const backendDir = path.join(__dirname, '..', 'backend');
const isWin = os.platform() === 'win32';
const pythonExe = isWin
  ? path.join(backendDir, '.venv', 'Scripts', 'python.exe')
  : path.join(backendDir, '.venv', 'bin', 'python');

console.log(`[VisionGuard] Launching FastAPI backend using ${pythonExe}...`);

const proc = spawn(
  pythonExe,
  ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000', '--reload'],
  { cwd: backendDir, stdio: 'inherit' }
);

proc.on('error', (err) => {
  console.error('[VisionGuard Backend Error]:', err.message);
  process.exit(1);
});

proc.on('close', (code) => {
  process.exit(code || 0);
});
