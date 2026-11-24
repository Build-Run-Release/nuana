const { spawn } = require("child_process");
const http = require("http");
const contextTools = require("./userContext");

const port = 4181;
const serverProcess = spawn(process.execPath, ["server.js"], {
  cwd: __dirname,
  env: { ...process.env, PORT: String(port) },
  stdio: "inherit"
});
const testCookies = [];

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const request = http.request({ hostname: "127.0.0.1", port, path, method, headers }, response => {
      let body = "";
      response.on("data", chunk => body += chunk);
      response.on("end", () => resolve({
        status: response.statusCode,
        headers: response.headers,
        body: JSON.parse(body || "{}")
      }));
    });
    request.on("error", reject);
    if (body) request.write(JSON.stringify(body));
    request.end();
  });
}

function get(path, headers) {
  return request("GET", path, undefined, headers);
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
  if (contextTools.getTimeOfDay(2) !== "night" ||
      contextTools.getTimeOfDay(11) !== "morning" ||
      contextTools.getTimeOfDay(15) !== "afternoon" ||
      contextTools.getTimeOfDay(19) !== "evening" ||
      contextTools.getSeason(7, "north") !== "summer" ||
      contextTools.getSeason(7, "south") !== "winter") {
    throw new Error("Local time or hemisphere season detection failed");
  }
  const sydneyClock = contextTools.create({
    language: "en-AU",
    timeZone: "Australia/Sydney",
    navigator: { language: "en-AU" }
  }).getRecommendationContext(new Date("2026-07-01T01:00:00Z"));
  if (sydneyClock.localDate !== "2026-07-01" || sydneyClock.timeOfDay !== "morning") {
    throw new Error("Browser time zone was not used for local time");
  }
  const context = contextTools.create({
    language: "en-NG",
    timeZone: "Africa/Lagos",
    navigator: { language: "en-NG" },
    fetch: async input => {
      const url = new URL(input);
      if (url.hostname === "geocoding-api.open-meteo.com") {
        return {
          ok: true,
          json: async () => ({ results: [{
            latitude: 6.5,
            longitude: 3.4,
            name: "Lagos",
            admin1: "Lagos",
            country: "Nigeria"
          }] })
        };
      }
      return {
        ok: true,
        json: async () => ({
          current: { temperature_2m: 29, precipitation: 0, weather_code: 1 },
          daily: {
            time: ["2026-07-01", "2026-07-02", "2026-07-03"],
            temperature_2m_min: [24, 24, 23],
            temperature_2m_max: [29, 30, 29],
            precipitation_probability_max: [10, 30, 20],
            weather_code: [1, 2, 1]
          }
        })
      };
    }
  });
  const cityResult = await context.searchCity("Lagos");
  const recommendationContext = context.getRecommendationContext(new Date("2026-07-01T01:00:00Z"));
  if (cityResult.warning || context.location.city !== "Lagos" || context.hemisphere !== "north" ||
      context.season !== "summer" || context.weather.forecast.length !== 3 ||
      context.timeOfDay !== "night" || recommendationContext.location ||
      recommendationContext.weather.current.temperatureC !== 29) {
    throw new Error("User context city, forecast, privacy, or local-time handling failed");
  }
  const unavailableWeatherContext = contextTools.create({
    navigator: { language: "en" },
    timeZone: "UTC",
    fetch: async input => {
      const url = new URL(input);
      return url.hostname === "geocoding-api.open-meteo.com"
        ? { ok: true, json: async () => ({ results: [{ latitude: 6.5, longitude: 3.4, name: "Lagos" }] }) }
        : { ok: false };
    }
  });
  const weatherFallback = await unavailableWeatherContext.searchCity("Lagos");
  if (!weatherFallback.warning || unavailableWeatherContext.weather !== null) {
    throw new Error("Weather failure blocked local context");
  }

  await waitForServer();
  const health = await get("/api/health");
  if (health.status !== 200 || health.body.status !== "ok") throw new Error("Health endpoint failed");

  const recommendations = await get("/api/recommendations?mood=happy&gender=unisex&weather=mild&occasion=everyday");
  if (recommendations.status !== 200 || !Array.isArray(recommendations.body) || recommendations.body.length !== 3) {
    throw new Error("Recommendation endpoint failed");
  }
  const variedIdeas = await get("/api/recommendations?mood=happy&limit=9");
  if (variedIdeas.status !== 200 || variedIdeas.body.length !== 9 ||
      new Set(variedIdeas.body.map(outfit => outfit.desc)).size !== 9) {
    throw new Error("Mix-and-match recommendations failed");
  }
  const excludedNames = recommendations.body.map(outfit => outfit.name).join(",");
  const rotated = await get(`/api/recommendations?mood=happy&exclude=${encodeURIComponent(excludedNames)}`);
  if (rotated.status !== 200 || rotated.body.some(outfit => recommendations.body.some(previous => previous.name === outfit.name))) {
    throw new Error("Recommendation rotation repeated an excluded look");
  }

  const moods = await get("/api/moods");
  if (moods.status !== 200 || !Array.isArray(moods.body) || moods.body.length !== 24) {
    throw new Error("Mood endpoint failed");
  }

  for (const days of [1, 3, 14]) {
    const capsule = await request("POST", "/api/travel/capsule", {
      days,
      weather: "any",
      gender: "unisex",
      wardrobe: ["relaxed jeans", "trainers"]
    }, { "Content-Type": "application/json" });
    if (capsule.status !== 200 || capsule.body.capsule.length !== days ||
        capsule.body.capsule.some((look, index) => look.day !== index + 1) ||
        new Set(capsule.body.capsule.map(look => look.name)).size !== days) {
      throw new Error(`Travel capsule failed for ${days} days`);
    }
  }
  const invalidCapsule = await request("POST", "/api/travel/capsule", { days: 15 }, {
    "Content-Type": "application/json"
  });
  if (invalidCapsule.status !== 400) throw new Error("Travel capsule accepted an invalid trip length");

  const stylist = await request("POST", "/api/stylist", {
    prompt: "I'm feeling calm and need a comfortable outfit for a rainy workday with no heels",
    gender: "unisex",
    wardrobe: ["relaxed jeans"]
  }, { "Content-Type": "application/json" });
  if (stylist.status !== 200 || stylist.body.mood !== "calm" ||
      stylist.body.weather !== "rainy" || stylist.body.occasion !== "work" ||
      stylist.body.recommendations.length !== 6 ||
      !stylist.body.reply.includes("comfortable pieces") || !stylist.body.reply.includes("flat footwear")) {
    throw new Error(`Private stylist request failed (${stylist.status}): ${stylist.body.mood}, ${stylist.body.weather}, ${stylist.body.occasion}`);
  }
  const oversizedPrompt = await request("POST", "/api/stylist", {
    prompt: "a".repeat(501)
  }, { "Content-Type": "application/json" });
  if (oversizedPrompt.status !== 400) throw new Error("Stylist accepted an oversized prompt");

  const suffix = Date.now();
  const accountA = await request("POST", "/api/auth/register", {
    email: `test-a-${suffix}@example.com`,
    password: "test-password-a"
  }, { "Content-Type": "application/json" });
  const cookieA = accountA.headers["set-cookie"][0].split(";")[0];
  testCookies.push(cookieA);
  await request("POST", "/api/saved", { name: "Account A look" }, {
    "Content-Type": "application/json",
    Cookie: cookieA
  });
  await request("POST", "/api/history", { outfit: "Account A look", action: "worn" }, {
    "Content-Type": "application/json",
    Cookie: cookieA
  });
  await request("POST", "/api/feedback", { outfit: "Account A look", feedback: "good-fit" }, {
    "Content-Type": "application/json",
    Cookie: cookieA
  });
  const accountB = await request("POST", "/api/auth/register", {
    email: `test-b-${suffix}@example.com`,
    password: "test-password-b"
  }, { "Content-Type": "application/json" });
  const cookieB = accountB.headers["set-cookie"][0].split(";")[0];
  testCookies.push(cookieB);
  const accountBData = await get("/api/saved", { Cookie: cookieB });
  if (accountBData.status !== 200 || accountBData.body.length !== 0) {
    throw new Error("Account data isolation failed");
  }
  for (const endpoint of ["/api/history", "/api/feedback"]) {
    const data = await get(endpoint, { Cookie: cookieB });
    if (data.status !== 200 || data.body.length !== 0) throw new Error(`${endpoint} account isolation failed`);
  }
  const deleteB = await request("DELETE", "/api/auth/account", undefined, { Cookie: cookieB });
  if (deleteB.status !== 200) throw new Error("Account deletion failed");
  const accountAData = await get("/api/saved", { Cookie: cookieA });
  if (accountAData.status !== 200 || accountAData.body.length !== 1) {
    throw new Error("Account deletion removed another account's data");
  }
  const accountAFeedback = await get("/api/feedback", { Cookie: cookieA });
  if (accountAFeedback.status !== 200 || accountAFeedback.body.length !== 1) {
    throw new Error("Account deletion removed another account's feedback");
  }

  console.log("Tests passed: health, recommendations, travel capsules, stylist, and account isolation");
}

run()
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    for (const cookie of testCookies) {
      await request("DELETE", "/api/auth/account", undefined, { Cookie: cookie });
    }
    serverProcess.kill();
  });
