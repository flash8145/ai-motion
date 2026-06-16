const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpeg = path.resolve(__dirname, '../node_modules/ffmpeg-static/ffmpeg.exe');
const video = `D:\\motion\\demo videos\\Introducing_your_agent_and_the_all-new_Gemini_Omni_model_in_Google_Flow._Unlock_your_best_creative_work._⚡.mp4`;
const outDir = process.argv[2] || 'C:\\Users\\alipa\\AppData\\Local\\Temp\\opencode\\video_frames\\key_frames';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const times = [
  0, 2.5, 4.5, 6.5, 8.5, 11, 14, 17, 20, 23, 26, 29,
  32, 35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74
];

for (let i = 0; i < times.length; i++) {
  const t = times[i];
  const out = path.join(outDir, `frame_${String(i).padStart(3, '0')}_${String(Math.round(t*10)).padStart(4,'0')}.png`);
  if (fs.existsSync(out)) continue;
  const cmd = `"${ffmpeg}" -hide_banner -ss ${t} -i "${video}" -frames:v 1 -an -y "${out}"`;
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (e) {
    console.error('Failed', t, e.message);
  }
}
