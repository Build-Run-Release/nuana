const fs = require("fs");
const path = require("path");

const root = __dirname;
const backupDir = path.join(root, "backups");
const sources = ["saved.json", "history.json", "feedback.json", "users.json", "sessions.json"];

fs.mkdirSync(backupDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const data = { createdAt: new Date().toISOString(), files: {} };

for (const name of sources) {
  const file = path.join(root, name);
  data.files[name] = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
}

const file = path.join(backupDir, `manual-${stamp}.json`);
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log(`Backup written to ${file}`);
