// YouTube → MP3 로컬 변환 서버 (의존성 없음, yt-dlp + ffmpeg 필요)
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

const PORT = Number(process.env.PORT) || 3333;
const HOST = process.env.HOST || '0.0.0.0'; // 같은 네트워크의 다른 컴퓨터도 접속 가능 (HOST=127.0.0.1 로 실행하면 이 컴퓨터에서만)
const INDEX = path.join(__dirname, 'index.html');
const YT_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be']);

function validateUrl(raw) {
  try {
    const u = new URL(raw);
    if (!['http:', 'https:'].includes(u.protocol)) return null;
    if (!YT_HOSTS.has(u.hostname)) return null;
    return u.href;
  } catch {
    return null;
  }
}

function sendJson(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function readBody(req, limit = 10_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(new Error('too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function convert(url, dir, signal) {
  return new Promise((resolve, reject) => {
    const args = [
      '--no-playlist',
      '-x', '--audio-format', 'mp3', '--audio-quality', '0',
      '--embed-metadata',
      '-o', path.join(dir, 'audio.%(ext)s'),
      '--no-simulate', '--print', 'title',
      '--', url,
    ];
    const p = spawn('yt-dlp', args, { signal });
    let out = '';
    let err = '';
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (err += d));
    p.on('error', reject);
    p.on('close', (code) => {
      if (code !== 0) return reject(new Error(err.trim().split('\n').pop() || `yt-dlp 종료 코드 ${code}`));
      const title = out.trim().split('\n')[0] || 'audio';
      resolve({ title, file: path.join(dir, 'audio.mp3') });
    });
  });
}

function safeName(title) {
  return title.replace(/[\\/:*?"<>|\x00-\x1f]/g, '_').slice(0, 120).trim() || 'audio';
}

async function handleConvert(req, res) {
  let url;
  try {
    url = validateUrl(JSON.parse(await readBody(req)).url);
  } catch {
    return sendJson(res, 400, { error: '잘못된 요청입니다.' });
  }
  if (!url) return sendJson(res, 400, { error: '올바른 YouTube 주소가 아닙니다.' });

  const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'y2m-'));
  const ac = new AbortController();
  res.on('close', () => { if (!res.writableEnded) ac.abort(); }); // 브라우저가 끊으면 변환도 중단
  const cleanup = () => fs.promises.rm(dir, { recursive: true, force: true }).catch(() => {});

  try {
    const { title, file } = await convert(url, dir, ac.signal);
    const stat = await fs.promises.stat(file);
    const name = safeName(title) + '.mp3';
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
      'X-Filename': encodeURIComponent(name),
      'Access-Control-Expose-Headers': 'X-Filename',
    });
    fs.createReadStream(file).pipe(res).on('close', cleanup);
  } catch (e) {
    await cleanup();
    if (ac.signal.aborted) return;
    sendJson(res, 500, { error: e.message });
  }
}

http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(INDEX).pipe(res);
  }
  if (req.method === 'POST' && req.url === '/api/convert') return handleConvert(req, res);
  sendJson(res, 404, { error: 'Not found' });
}).listen(PORT, HOST, () => {
  console.log(`http://127.0.0.1:${PORT} 에서 실행 중 (바인딩: ${HOST})`);
  if (HOST === '0.0.0.0') {
    for (const list of Object.values(os.networkInterfaces())) {
      for (const n of list || []) {
        if (n.family === 'IPv4' && !n.internal) console.log(`같은 네트워크에서: http://${n.address}:${PORT}`);
      }
    }
  }
});
