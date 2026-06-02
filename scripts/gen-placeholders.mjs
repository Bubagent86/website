import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("src/screenshots", { recursive: true });

const shots = [
  { file: "baby-steps", label: "BABY STEPS", c1: "#ff8a5b", c2: "#3a1078" },
  { file: "despelote", label: "DESPELOTE", c1: "#00b4d8", c2: "#03045e" },
  { file: "ape-out", label: "APE OUT", c1: "#ff5400", c2: "#1a0000" },
  { file: "foiled-arcade", label: "FOILED ARCADE", c1: "#06d6a0", c2: "#073b4c" },
  { file: "foiled", label: "FOILED", c1: "#ffd166", c2: "#6a040f" },
];

for (const s of shots) {
  const svg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${s.c1}"/>
        <stop offset="1" stop-color="${s.c2}"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#g)"/>
    <text x="960" y="555" font-family="Arial, Helvetica, sans-serif" font-size="130"
      font-weight="bold" fill="#ffffff" text-anchor="middle">${s.label}</text>
    <text x="960" y="640" font-family="Arial, Helvetica, sans-serif" font-size="40"
      fill="#ffffffbb" text-anchor="middle">placeholder screenshot</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(`src/screenshots/${s.file}.jpg`);
  console.log("wrote src/screenshots/" + s.file + ".jpg");
}
