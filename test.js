const { spawn } = require("child_process");
const http = require("http");

const port = 4181;
const serverProcess = spawn(process.execPath, ["server.js"], {
  cwd: __dirname,
  env: { ...process.env, PORT: String(port) },
  stdio: "inherit"
});

function get(path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: "127.0.0.1", port, path }, response => {
      let body = "";
      response.on("data", chunk => body += chunk);
      response.on("end", () => resolve({ status: response.statusCode, body: JSON.parse(body || "{}") }));
    }).on("error", reject);
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      await get("/api/health");
      return;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  throw new Error("Server did not start");
}

async function run() {
  await waitForServer();
  const health = await get("/api/health");
  if (health.status !== 200 || health.body.status !== "ok") throw new Error("Health endpoint failed");

  const recommendations = await get("/api/recommendations?mood=happy&gender=unisex&weather=mild&occasion=everyday");
  if (recommendations.status !== 200 || !Array.isArray(recommendations.body) || recommendations.body.length !== 3) {
    throw new Error("Recommendation endpoint failed");
  }

  const moods = await get("/api/moods");
  if (moods.status !== 200 || !Array.isArray(moods.body) || moods.body.length !== 24) {
    throw new Error("Mood endpoint failed");
  }

  console.log("Tests passed: health, moods, and recommendations");
}

run()
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => serverProcess.kill());
