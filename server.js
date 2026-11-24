const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT) || 4173;
const ROOT = __dirname;
const SAVED_FILE = path.join(ROOT, "saved.json");
const HISTORY_FILE = path.join(ROOT, "history.json");
const FEEDBACK_FILE = path.join(ROOT, "feedback.json");
const USERS_FILE = path.join(ROOT, "users.json");
const SESSIONS_FILE = path.join(ROOT, "sessions.json");
const BACKUP_DIR = path.join(ROOT, "backups");

const moods = [
  { id: "happy", name: "Happy", emoji: "☀", category: "Bright", color: "lime" },
  { id: "confident", name: "Confident", emoji: "✦", category: "Bold", color: "lavender" },
  { id: "calm", name: "Calm", emoji: "◡", category: "Soft", color: "sky" },
  { id: "romantic", name: "Romantic", emoji: "♡", category: "Soft", color: "pink" },
  { id: "playful", name: "Playful", emoji: "✿", category: "Bright", color: "peach" },
  { id: "focused", name: "Focused", emoji: "◉", category: "Bold", color: "gray" },
  { id: "cozy", name: "Cozy", emoji: "≈", category: "Soft", color: "sand" },
  { id: "adventurous", name: "Adventurous", emoji: "⌁", category: "Bold", color: "sage" },
  { id: "mysterious", name: "Mysterious", emoji: "◐", category: "Deep", color: "gray" },
  { id: "dreamy", name: "Dreamy", emoji: "☾", category: "Soft", color: "lavender" },
  { id: "rebellious", name: "Rebellious", emoji: "ϟ", category: "Bold", color: "pink" },
  { id: "nostalgic", name: "Nostalgic", emoji: "⌂", category: "Soft", color: "sand" },
  { id: "elegant", name: "Elegant", emoji: "◆", category: "Refined", color: "gray" },
  { id: "restless", name: "Restless", emoji: "↗", category: "Bright", color: "lime" },
  { id: "melancholy", name: "Melancholy", emoji: "☁", category: "Deep", color: "sky" },
  { id: "energetic", name: "Energetic", emoji: "↯", category: "Bright", color: "peach" },
  { id: "creative", name: "Creative", emoji: "◎", category: "Refined", color: "lavender" },
  { id: "grounded", name: "Grounded", emoji: "◇", category: "Soft", color: "sage" },
  { id: "seductive", name: "Seductive", emoji: "◒", category: "Deep", color: "pink" },
  { id: "optimistic", name: "Optimistic", emoji: "⌃", category: "Bright", color: "lime" },
  { id: "overwhelmed", name: "Overwhelmed", emoji: "○", category: "Soft", color: "sky" },
  { id: "professional", name: "Professional", emoji: "▣", category: "Refined", color: "gray" },
  { id: "spontaneous", name: "Spontaneous", emoji: "※", category: "Bright", color: "peach" },
  { id: "peaceful", name: "Peaceful", emoji: "◌", category: "Soft", color: "sage" }
];

const outfitBase = [
  ["Soft-Focus", "Relaxed tailoring", "Coffee, errands or a relaxed workday", ["happy","calm","cozy","grounded","peaceful","overwhelmed"], "#dde9e7", "#ece7dc", "#8e9f99", "#f4f1e7", "Soft"],
  ["Golden-Hour", "Warm minimal", "Lunch outside or a golden-hour walk", ["happy","optimistic","energetic","playful","spontaneous"], "#f2dfad", "#e2b62e", "#eee8d6", "#5f5141", "Bright"],
  ["Quiet-Power", "Modern monochrome", "Presentations, interviews or important meetings", ["confident","focused","professional","elegant","grounded"], "#d9d8d1", "#252a27", "#eeece3", "#252521", "Sharp"],
  ["Main-Character", "Color blocking", "Dinner, gallery opening or a first date", ["confident","rebellious","seductive","energetic","adventurous"], "#d9cbee", "#9b79bd", "#e5e0d5", "#b43d52", "Statement"],
  ["Paper-Rose", "Romantic casual", "Weekend brunch or a bookstore date", ["romantic","dreamy","nostalgic","playful"], "#efdae0", "#c98292", "#a9b1b5", "#f4ece7", "Soft"],
  ["Lavender-Haze", "Art school ease", "Creative class, museum or afternoon plans", ["dreamy","creative","romantic","calm","nostalgic"], "#dfd8ef", "#9f94c2", "#e7dfe7", "#6f6a78", "Airy"],
  ["After-Hours", "Noir romance", "Late dinner or cocktail evening", ["mysterious","seductive","rebellious","elegant"], "#bbbdb6", "#30332f", "#1e211f", "#151716", "Noir"],
  ["City-Rhythm", "Polished street", "City exploring or a casual live show", ["restless","rebellious","adventurous","spontaneous","energetic"], "#bcd3d9", "#466b70", "#d6d3c7", "#f2eee2", "Street"],
  ["Slow-Sunday", "Ultra cozy", "Slow morning at home or a neighborhood stroll", ["cozy","calm","peaceful","melancholy","overwhelmed"], "#e5dcc9", "#b7a98f", "#7f806f", "#ded0b7", "Cozy"],
  ["Open-Road", "Utility explorer", "Day trip, hike or outdoor market", ["adventurous","spontaneous","restless","grounded"], "#ccd7c3", "#747d5e", "#c5a886", "#5a4d3e", "Utility"],
  ["Gallery-Light", "Creative refined", "Exhibition, portfolio review or dinner party", ["creative","elegant","focused","mysterious","professional"], "#ddd5bf", "#7d82a3", "#d8d2c5", "#2e302e", "Editorial"],
  ["Perfectly-Unbothered", "Effortless basics", "Everyday plans with zero outfit anxiety", ["peaceful","cozy","grounded","happy","nostalgic"], "#dadccf", "#ecebdc", "#6e7d79", "#a7a394", "Easy"],
  ["Cherry-On-Top", "Retro pop", "A playful afternoon or casual celebration", ["playful","spontaneous","happy","optimistic"], "#e5c4bd", "#bf4d56", "#f0eade", "#c44d58", "Retro"],
  ["Blue-Note", "Quiet cool", "Quiet plans, studying or rainy-day wandering", ["melancholy","calm","mysterious","focused"], "#cad8df", "#718d9a", "#d8d2c5", "#4d5558", "Moody"],
  ["Boardroom-Bloom", "Modern professional", "Office day, pitch or formal lunch", ["professional","focused","confident","elegant"], "#d9d8d0", "#a6b0a1", "#343936", "#242725", "Polished"],
  ["June-In-Motion", "Vacation energy", "Beach town, festival or outdoor trip", ["optimistic","energetic","adventurous","playful","spontaneous"], "#d7e2bc", "#eee4b3", "#789396", "#b66d55", "Fresh"],
  ["Velvet-Low-Tide", "Textural evening", "Low-lit restaurant or intimate evening event", ["seductive","mysterious","romantic","melancholy"], "#c7bdc7", "#4e4657", "#302f39", "#1f2024", "Evening"],
  ["Outside-The-Lines", "Deconstructed casual", "Art event, studio visit or unconventional night out", ["creative","rebellious","restless","confident"], "#dbd1c4", "#d6bb62", "#777f85", "#dcd8ca", "Experimental"]
];

const variants = {
  unisex: [
    "cream ribbed tee · stone pleated trousers · oat trainers",
    "saffron overshirt · ivory wide-leg trousers · tan crossbody",
    "charcoal relaxed blazer · silk shell · straight cream trousers",
    "violet oversized shirt · stone straight trousers · burgundy sneakers",
    "blush camp-collar shirt · relaxed blue jeans · pearl trainers",
    "lavender mesh cardigan · silver relaxed skirt or trousers · lilac boots",
    "black satin overshirt · tailored straight trousers · pointed boots",
    "teal cropped jacket · white tee · tapered cargo trousers",
    "oat cashmere cardigan · slate lounge trousers · shearling slippers",
    "olive field jacket · sand tee · khaki cargo shorts",
    "periwinkle sculptural top · draped ecru trousers · black mules",
    "washed cotton tee · softened straight jeans · moss canvas sneakers",
    "cherry red knit · white pleated trousers · cherry shoes",
    "dusty-blue mock neck · faded straight jeans · charcoal derby shoes",
    "sage wrap shirt · charcoal tailored trousers · almond loafers",
    "butter-yellow linen shirt · blue cotton shorts · terracotta sandals",
    "plum velvet shirt · black wide-leg trousers · patent loafers",
    "ochre asymmetric shirt · slate wide-leg trousers · ecru technical sneakers"
  ],
  women: [
    "cream ribbed knit · stone pleated trousers · oat loafers",
    "saffron tank · ivory wide-leg jeans · tan crossbody",
    "charcoal fitted blazer · silk shell · straight cream trousers",
    "violet oversized shirt · stone mini skirt · burgundy pumps",
    "blush lace-trim blouse · relaxed blue jeans · pearl flats",
    "lavender mesh cardigan · silver slip skirt · lilac ankle boots",
    "black satin blouse · tailored leather-look skirt · pointed flats",
    "teal cropped jacket · white crop tee · tapered cargo trousers",
    "oat cashmere cardigan · slate lounge trouser · shearling slippers",
    "olive field jacket · sand tee · khaki trail shorts",
    "periwinkle sculptural top · draped ecru pants · black mules",
    "washed cotton tee · softened straight jeans · moss canvas sneakers",
    "cherry red knit · white A-line skirt · cherry Mary Janes",
    "dusty-blue mock neck · faded straight jeans · charcoal ankle boots",
    "sage wrap shirt · charcoal pencil trouser · almond loafers",
    "butter-yellow linen shirt · blue cotton shorts · terracotta sandals",
    "plum velvet camisole · black bias-cut skirt · patent slingbacks",
    "ochre asymmetric shirt · slate wide-leg trouser · ecru technical sneaker"
  ],
  men: [
    "cream merino knit · stone pleated trousers · oat suede loafers",
    "saffron camp shirt · ivory straight-leg trousers · tan leather crossbody",
    "charcoal single-breasted blazer · grey tee · cream tailored trousers",
    "violet overshirt · stone relaxed trousers · burgundy loafers",
    "blush knit polo · relaxed indigo jeans · pearl-white sneakers",
    "lavender overshirt · silver-grey relaxed trousers · lilac suede sneakers",
    "black satin camp shirt · tailored black trousers · polished Chelsea boots",
    "teal chore jacket · white heavyweight tee · tapered cargo trousers",
    "oat quarter-zip · slate jogger trouser · shearling-lined slippers",
    "olive chore jacket · sand tee · khaki utility shorts",
    "periwinkle boxy jacket · draped ecru trousers · black leather loafers",
    "washed cotton tee · softened straight jeans · moss canvas sneakers",
    "cherry red knit polo · white pleated shorts · cherry low-top sneakers",
    "dusty-blue crewneck · faded straight jeans · charcoal derby shoes",
    "sage open-collar shirt · charcoal tailored trouser · almond loafers",
    "butter-yellow linen shirt · blue cotton shorts · terracotta leather sandals",
    "plum velvet jacket · black wide-leg trousers · patent loafers",
    "ochre asymmetric overshirt · slate pleated trousers · technical sneakers"
  ]
};

const outfits = outfitBase.map((item, index) => ({
  id: item[0],
  name: item[0].replaceAll("-", " "),
  style: item[1],
  occasion: item[2],
  mood: item[3],
  bg: item[4],
  top: item[5],
  bottom: item[6],
  shoe: item[7],
  badge: item[8],
  skin: "#ad7457",
  hair: "#3f342d",
  variants
}));

function readJson(file, fallback = []) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, stored) {
  if (!stored?.salt || !stored?.hash) return false;
  const candidate = crypto.scryptSync(password, stored.salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(stored.hash, "hex"));
}

function cookiesFrom(request) {
  const result = {};
  for (const part of (request.headers.cookie || "").split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key) result[key] = decodeURIComponent(rest.join("="));
  }
  return result;
}

function currentSession(request) {
  const token = cookiesFrom(request).nuana_session;
  if (!token) return null;
  const sessions = readJson(SESSIONS_FILE, {});
  const session = sessions[token];
  if (!session || session.expiresAt < Date.now()) return null;
  return { token, ...session };
}

function dataOwner(request) {
  return currentSession(request)?.email || "guest";
}

function readScoped(file, owner) {
  const value = readJson(file);
  if (Array.isArray(value)) return owner === "guest" ? value : [];
  return value && Array.isArray(value[owner]) ? value[owner] : [];
}

function writeScoped(file, owner, value) {
  const existing = readJson(file, {});
  const scoped = Array.isArray(existing) ? { guest: existing } : existing;
  scoped[owner] = value;
  writeJson(file, scoped);
}

function setSession(response, token) {
  response.setHeader("Set-Cookie", `nuana_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800`);
}

function createBackup(label) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(BACKUP_DIR, `${label}-${stamp}.json`);
  writeJson(backupFile, {
    saved: readJson(SAVED_FILE),
    history: readJson(HISTORY_FILE),
    feedback: readJson(FEEDBACK_FILE),
    createdAt: new Date().toISOString()
  });
  const backups = fs.readdirSync(BACKUP_DIR).filter(name => name.endsWith(".json")).sort().reverse();
  backups.slice(20).forEach(name => fs.rmSync(path.join(BACKUP_DIR, name)));
  return backupFile;
}

function json(response, status, value) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(value));
}

function bodyFrom(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", chunk => {
      body += chunk;
      if (body.length > 100000) {
        reject(new Error("Request too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error("Invalid JSON")); }
    });
  });
}

function generatedLooks(moodId, gender, sources) {
  const outfitsForMixing = sources.length >= 2 ? sources : outfits.slice(0, 4);
  const combinations = [];
  const seen = new Set();
  for (let topIndex = 0; topIndex < outfitsForMixing.length; topIndex++) {
    for (let bottomIndex = 0; bottomIndex < outfitsForMixing.length; bottomIndex++) {
      for (let shoeIndex = 0; shoeIndex < outfitsForMixing.length; shoeIndex++) {
        const topOutfit = outfitsForMixing[topIndex];
        const bottomOutfit = outfitsForMixing[bottomIndex];
        const shoeOutfit = outfitsForMixing[shoeIndex];
        if (topIndex === bottomIndex && bottomIndex === shoeIndex) continue;

        const topIndexInCatalog = outfitBase.findIndex(item => item[0] === topOutfit.id);
        const bottomIndexInCatalog = outfitBase.findIndex(item => item[0] === bottomOutfit.id);
        const shoeIndexInCatalog = outfitBase.findIndex(item => item[0] === shoeOutfit.id);
        const topParts = variants[gender][topIndexInCatalog].split(" · ");
        const bottomParts = variants[gender][bottomIndexInCatalog].split(" · ");
        const shoeParts = variants[gender][shoeIndexInCatalog].split(" · ");
        const description = [topParts[0], bottomParts[1], shoeParts[2]].join(" · ");
        if (seen.has(description)) continue;
        seen.add(description);
        combinations.push({
          ...topOutfit,
          id: `mix-${topOutfit.id}-${bottomOutfit.id}-${shoeOutfit.id}`,
          baseId: topOutfit.id,
          name: `${topOutfit.name} Mix ${combinations.length + 1}`,
          style: `${topOutfit.style} mix`,
          desc: description,
          mood: [moodId],
          top: topOutfit.top,
          bottom: bottomOutfit.bottom,
          shoe: shoeOutfit.shoe,
          gender
        });
        if (combinations.length >= 60) return combinations;
      }
    }
  }
  return combinations;
}

function validatedContext(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const context = {};
  if (["morning", "afternoon", "evening", "night"].includes(value.timeOfDay)) {
    context.timeOfDay = value.timeOfDay;
  }
  if (["winter", "spring", "summer", "autumn"].includes(value.season)) {
    context.season = value.season;
  }
  if (value.weather && typeof value.weather === "object") {
    const current = value.weather.current;
    const forecast = value.weather.forecast;
    context.weather = {
      current: current && Number.isFinite(current.temperatureC)
        ? {
          temperatureC: current.temperatureC,
          precipitationMm: Number(current.precipitationMm) || 0,
          weatherCode: Number.isInteger(current.weatherCode) ? current.weatherCode : null
        }
        : null,
      forecast: Array.isArray(forecast) ? forecast.slice(0, 3).map(day => ({
        precipitationProbabilityMax: Number.isFinite(day.precipitationProbabilityMax)
          ? day.precipitationProbabilityMax
          : null
      })) : []
    };
  }
  return context;
}

function recommendationsFor(moodId, gender, exclude, weather, occasion, wardrobe, limit = 3, feedback = [], constraints = {}, context = {}) {
  const validGender = ["women", "men", "unisex"].includes(gender) ? gender : "unisex";
  const matching = outfits.filter(outfit => outfit.mood.includes(moodId));
  const sources = matching.length ? matching : outfits;
  const catalogLooks = sources.map(outfit => {
    const index = outfitBase.findIndex(item => item[0] === outfit.id);
    return {
      ...outfit,
      name: outfit.name.replaceAll("-", " "),
      desc: variants[validGender][index],
      baseId: outfit.id,
      gender: validGender
    };
  });
  const allLooks = [...catalogLooks, ...generatedLooks(moodId, validGender, sources)];
  const excluded = new Set(exclude.map(value => value.toLowerCase()));
  let candidates = allLooks.filter(outfit =>
    !excluded.has(outfit.id.toLowerCase()) && !excluded.has(outfit.name.toLowerCase())
  );
  if (!candidates.length) candidates = allLooks;

  const owned = Array.isArray(wardrobe) ? wardrobe.map(item => item.toLowerCase()) : [];
  const workFriendly = ["Soft-Focus", "Quiet-Power", "Gallery-Light", "Boardroom-Bloom", "Perfectly-Unbothered"];
  const outdoorFriendly = ["Open-Road", "City-Rhythm", "June-In-Motion", "Perfectly-Unbothered"];
  const coldFriendly = ["Soft-Focus", "Quiet-Power", "Slow-Sunday", "Gallery-Light", "Boardroom-Bloom"];
  const hotFriendly = ["Golden-Hour", "Open-Road", "June-In-Motion", "Perfectly-Unbothered"];
  const score = outfit => {
    const baseId = outfit.baseId || outfit.id;
    const text = `${outfit.desc} ${outfit.style}`.toLowerCase();
    const ownershipScore = owned.filter(item => text.includes(item)).length * 3;
    const occasionScore = occasion === "work"
      ? Number(workFriendly.includes(baseId)) * 2
      : occasion === "outdoor"
        ? Number(outdoorFriendly.includes(baseId)) * 2
        : 0;
    const weatherScore = weather === "cold" || weather === "rainy"
      ? Number(coldFriendly.includes(baseId))
      : weather === "hot"
        ? Number(hotFriendly.includes(baseId))
        : 0;
    const temperature = context.weather?.current?.temperatureC;
    const forecastMayBeWet = context.weather?.forecast?.some(day =>
      Number(day.precipitationProbabilityMax) >= 50
    );
    const liveWeatherScore = Number.isFinite(temperature)
      ? temperature < 12 && coldFriendly.includes(baseId)
        ? 2
        : temperature > 25 && hotFriendly.includes(baseId)
          ? 2
          : 0
      : 0;
    const weatherCode = context.weather?.current?.weatherCode;
    const currentWeatherIsWet = weatherCode >= 51 && weatherCode <= 67 ||
      weatherCode >= 80 && weatherCode <= 82 || weatherCode === 95;
    const rainScore = (
      Number(context.weather?.current?.precipitationMm) > 0 || currentWeatherIsWet || forecastMayBeWet
    ) && ["City-Rhythm", "Blue-Note", "Soft-Focus"].includes(baseId) ? 2 : 0;
    const seasonScore = context.season === "winter" && coldFriendly.includes(baseId)
      ? 1
      : context.season === "summer" && hotFriendly.includes(baseId)
        ? 1
        : 0;
    const timeFriendly = context.timeOfDay === "evening"
      ? ["After-Hours", "Velvet-Low-Tide", "Main-Character", "Paper-Rose"]
      : context.timeOfDay === "morning"
        ? ["Soft-Focus", "Golden-Hour", "Slow-Sunday", "Perfectly-Unbothered"]
        : [];
    const timeScore = Number(timeFriendly.includes(baseId));
    const outfitFeedback = feedback.filter(item =>
      typeof item.outfit === "string" && item.outfit.toLowerCase() === outfit.name.toLowerCase()
    );
    const feedbackScore = outfitFeedback.reduce((total, item) =>
      total + (item.feedback === "good-fit" ? 2 : -6), 0);
    const comfortScore = constraints.comfort
      ? Number(/\b(relaxed|soft|easy|cotton|knit|trainers|sneakers|lounge)\b/i.test(text)) * 2
      : 0;
    const casualScore = constraints.casual
      ? Number(!["Quiet-Power", "Boardroom-Bloom", "After-Hours"].includes(baseId)) * 2
      : 0;
    const heelScore = constraints.avoidHeels && /\b(heels?|pumps|slingbacks)\b/i.test(outfit.desc) ? -8 : 0;
    return ownershipScore + occasionScore + weatherScore + liveWeatherScore + rainScore +
      seasonScore + timeScore + feedbackScore + comfortScore + casualScore + heelScore;
  };
  candidates.sort((a, b) => score(b) - score(a) || Math.random() - 0.5);
  return candidates.slice(0, limit);
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

async function handler(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (request.method === "POST" && url.pathname === "/api/auth/register") {
    try {
      const payload = await bodyFrom(request);
      const email = String(payload.email || "").trim().toLowerCase();
      const password = String(payload.password || "");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(response, 400, { error: "Valid email is required" });
      if (password.length < 8) return json(response, 400, { error: "Password must be at least 8 characters" });
      const users = readJson(USERS_FILE, {});
      if (users[email]) return json(response, 409, { error: "An account already exists" });
      const credentials = hashPassword(password);
      users[email] = { email, ...credentials, createdAt: new Date().toISOString() };
      writeJson(USERS_FILE, users);
      const token = crypto.randomBytes(32).toString("hex");
      const sessions = readJson(SESSIONS_FILE, {});
      sessions[token] = { email, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 };
      writeJson(SESSIONS_FILE, sessions);
      setSession(response, token);
      return json(response, 201, { email });
    } catch (error) {
      return json(response, 400, { error: error.message });
    }
  }

  if (request.method === "POST" && url.pathname === "/api/auth/login") {
    try {
      const payload = await bodyFrom(request);
      const email = String(payload.email || "").trim().toLowerCase();
      const users = readJson(USERS_FILE, {});
      if (!users[email] || !verifyPassword(String(payload.password || ""), users[email])) {
        return json(response, 401, { error: "Email or password is incorrect" });
      }
      const token = crypto.randomBytes(32).toString("hex");
      const sessions = readJson(SESSIONS_FILE, {});
      sessions[token] = { email, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 };
      writeJson(SESSIONS_FILE, sessions);
      setSession(response, token);
      return json(response, 200, { email });
    } catch (error) {
      return json(response, 400, { error: error.message });
    }
  }

  if (request.method === "GET" && url.pathname === "/api/auth/me") {
    const session = currentSession(request);
    return json(response, session ? 200 : 401, session ? { email: session.email } : { error: "Not signed in" });
  }

  if (request.method === "POST" && url.pathname === "/api/auth/logout") {
    const session = currentSession(request);
    if (session) {
      const sessions = readJson(SESSIONS_FILE, {});
      delete sessions[session.token];
      writeJson(SESSIONS_FILE, sessions);
    }
    response.setHeader("Set-Cookie", "nuana_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0");
    return json(response, 200, { status: "signed-out" });
  }

  if (request.method === "DELETE" && url.pathname === "/api/auth/account") {
    const session = currentSession(request);
    if (!session) return json(response, 401, { error: "Not signed in" });
    const users = readJson(USERS_FILE, {});
    delete users[session.email];
    writeJson(USERS_FILE, users);
    const sessions = readJson(SESSIONS_FILE, {});
    Object.keys(sessions).forEach(token => {
      if (sessions[token].email === session.email) delete sessions[token];
    });
    writeJson(SESSIONS_FILE, sessions);
    writeScoped(SAVED_FILE, session.email, []);
    writeScoped(HISTORY_FILE, session.email, []);
    writeScoped(FEEDBACK_FILE, session.email, []);
    response.setHeader("Set-Cookie", "nuana_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0");
    return json(response, 200, { status: "account-deleted" });
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    return json(response, 200, { status: "ok", service: "Nuana API" });
  }
  if (request.method === "GET" && url.pathname === "/api/moods") {
    return json(response, 200, moods);
  }
  if (request.method === "GET" && url.pathname === "/api/weather/consent") {
    return json(response, 200, {
      consentRequired: true,
      purpose: "Use approximate location only to select weather-appropriate clothing.",
      stored: false
    });
  }
  if (request.method === "POST" && url.pathname === "/api/travel/capsule") {
    try {
      const payload = await bodyFrom(request);
      const days = payload.days === undefined ? 3 : Number(payload.days);
      if (!Number.isInteger(days) || days < 1 || days > 14) {
        return json(response, 400, { error: "Trip length must be a whole number from 1 to 14" });
      }
      const weather = payload.weather === undefined ? "mild" : payload.weather;
      if (!["any", "cold", "mild", "hot", "rainy"].includes(weather)) {
        return json(response, 400, { error: "Unknown weather" });
      }
      const gender = payload.gender === undefined ? "unisex" : payload.gender;
      if (!["women", "men", "unisex"].includes(gender)) {
        return json(response, 400, { error: "Unknown presentation option" });
      }
      if (payload.wardrobe !== undefined &&
          (!Array.isArray(payload.wardrobe) || payload.wardrobe.some(item => typeof item !== "string"))) {
        return json(response, 400, { error: "Wardrobe must be a list of item names" });
      }
      const wardrobeItems = (payload.wardrobe || []).map(item => item.toLowerCase());
      const weatherOrder = weather === "hot"
        ? ["June-In-Motion", "Perfectly-Unbothered", "Open-Road", "Golden-Hour"]
        : weather === "cold"
          ? ["Soft-Focus", "Quiet-Power", "Slow-Sunday", "Open-Road"]
          : weather === "rainy"
            ? ["City-Rhythm", "Perfectly-Unbothered", "Blue-Note", "Soft-Focus"]
            : ["Soft-Focus", "Perfectly-Unbothered", "City-Rhythm", "June-In-Motion"];
      const ranked = [...weatherOrder, ...outfits.map(outfit => outfit.id)]
        .filter((id, index, list) => list.indexOf(id) === index)
        .map(id => outfits.find(outfit => outfit.id === id))
        .sort((a, b) => {
          const itemText = outfit => {
            const index = outfitBase.findIndex(item => item[0] === outfit.id);
            return `${variants[gender][index]} ${outfit.style}`.toLowerCase();
          };
          return wardrobeItems.filter(item => itemText(b).includes(item)).length -
            wardrobeItems.filter(item => itemText(a).includes(item)).length;
        });
      const capsule = ranked.slice(0, days).map((outfit, index) => {
        const id = outfit.id;
        const variantIndex = outfitBase.findIndex(item => item[0] === id);
        return {
          day: index + 1,
          name: outfit.name,
          style: outfit.style,
          desc: variants[gender][variantIndex],
          occasion: outfit.occasion
        };
      });
      return json(response, 200, {
        days,
        weather,
        gender,
        capsule,
        packingTip: "Start with the listed looks, then rewear compatible layers and shoes to keep your bag compact."
      });
    } catch (error) {
      return json(response, 400, { error: error.message });
    }
  }
  if (request.method === "POST" && url.pathname === "/api/stylist") {
    try {
      const payload = await bodyFrom(request);
      const prompt = typeof payload.prompt === "string" ? payload.prompt.trim() : "";
      if (!prompt || prompt.length > 500) {
        return json(response, 400, { error: "Describe your styling question in 1 to 500 characters" });
      }
      const text = prompt.toLowerCase();
      const mood = moods.find(item => text.includes(item.id) || text.includes(item.name.toLowerCase()))?.id ||
        (moods.some(item => item.id === payload.mood) ? payload.mood : "happy");
      const weather = /\b(rain|rainy|raining|wet)\b/.test(text)
        ? "rainy"
        : /\b(cold|chilly|freezing|winter)\b/.test(text)
          ? "cold"
          : /\b(hot|heat|summer)\b/.test(text)
            ? "hot"
            : /\b(mild|spring|autumn|fall)\b/.test(text)
              ? "mild"
              : ["any", "cold", "mild", "hot", "rainy"].includes(payload.weather)
                ? payload.weather
                : "any";
      const occasion = /\b(work(?:day)?|office|interview|meeting)\b/.test(text)
        ? "work"
        : /\b(date|dinner|restaurant)\b/.test(text)
          ? "date"
          : /\b(event|party|wedding|concert)\b/.test(text)
            ? "event"
            : /\b(travel|trip|packing|pack)\b/.test(text)
              ? "travel"
              : /\b(outdoor|hike|hiking|walk)\b/.test(text)
                ? "outdoor"
                : ["everyday", "work", "date", "event", "travel", "outdoor"].includes(payload.occasion)
                  ? payload.occasion
                  : "everyday";
      const gender = ["women", "men", "unisex"].includes(payload.gender) ? payload.gender : "unisex";
      const wardrobeItems = Array.isArray(payload.wardrobe)
        ? payload.wardrobe.filter(item => typeof item === "string").slice(0, 40)
        : [];
      const constraints = {
        comfort: /\b(comfortable|comfort|comfy|relaxed|easy)\b/.test(text),
        casual: /\b(casual|less formal|not too formal)\b/.test(text),
        avoidHeels: /\b(no heels?|without heels?|flat shoes?)\b/.test(text)
      };
      const feedback = readScoped(FEEDBACK_FILE, dataOwner(request));
      const context = validatedContext(payload.context);
      const recommendations = recommendationsFor(mood, gender, [], weather, occasion, wardrobeItems, 6, feedback, constraints, context);
      const moodName = moods.find(item => item.id === mood).name.toLowerCase();
      const preferences = [
        constraints.comfort && "comfortable pieces",
        constraints.casual && "a more casual feel",
        constraints.avoidHeels && "flat footwear"
      ].filter(Boolean);
      const tailoring = preferences.length ? ` I focused on ${preferences.join(", ")}.` : "";
      return json(response, 200, {
        reply: `Here are ${recommendations.length} ideas for a ${moodName} mood, tuned for ${weather} weather and ${occasion} plans.${tailoring} I prioritized the wardrobe pieces you selected. This private helper uses local styling rules; it does not save your prompt or send it to an AI service.`,
        mood,
        weather,
        occasion,
        recommendations
      });
    } catch (error) {
      return json(response, 400, { error: error.message });
    }
  }
  if (request.method === "GET" && url.pathname === "/api/recommendations") {
    const mood = url.searchParams.get("mood") || "happy";
    const gender = url.searchParams.get("gender") || "unisex";
    const weather = url.searchParams.get("weather") || "any";
    const occasion = url.searchParams.get("occasion") || "everyday";
    const wardrobe = (url.searchParams.get("wardrobe") || "").split(",").map(item => item.trim()).filter(Boolean);
    const exclude = (url.searchParams.get("exclude") || "").split(",").filter(Boolean);
    const limit = Number(url.searchParams.get("limit") || 3);
    const rawContext = url.searchParams.get("context") || "";
    if (rawContext.length > 5000) return json(response, 400, { error: "Local context is too large" });
    let context = {};
    if (rawContext) {
      try {
        context = validatedContext(JSON.parse(rawContext));
      } catch {
        return json(response, 400, { error: "Local context must be valid JSON" });
      }
    }
    if (!moods.some(item => item.id === mood)) return json(response, 400, { error: "Unknown mood" });
    if (!["women", "men", "unisex"].includes(gender)) return json(response, 400, { error: "Unknown gender option" });
    if (!["any", "cold", "mild", "hot", "rainy"].includes(weather)) return json(response, 400, { error: "Unknown weather" });
    if (!["everyday", "work", "date", "event", "travel", "outdoor"].includes(occasion)) return json(response, 400, { error: "Unknown occasion" });
    if (!Number.isInteger(limit) || limit < 1 || limit > 12) return json(response, 400, { error: "Limit must be from 1 to 12" });
    const feedback = readScoped(FEEDBACK_FILE, dataOwner(request));
    return json(response, 200, recommendationsFor(mood, gender, exclude, weather, occasion, wardrobe, limit, feedback, {}, context));
  }
  if (request.method === "GET" && url.pathname === "/api/saved") {
    return json(response, 200, readScoped(SAVED_FILE, dataOwner(request)));
  }
  if (request.method === "GET" && url.pathname === "/api/history") {
    return json(response, 200, readScoped(HISTORY_FILE, dataOwner(request)));
  }
  if (request.method === "GET" && url.pathname === "/api/feedback") {
    return json(response, 200, readScoped(FEEDBACK_FILE, dataOwner(request)));
  }
  if (request.method === "POST" && url.pathname === "/api/history") {
    try {
      const payload = await bodyFrom(request);
      if (!payload || typeof payload.outfit !== "string") return json(response, 400, { error: "Outfit is required" });
      const owner = dataOwner(request);
      const history = readScoped(HISTORY_FILE, owner);
      history.unshift({ ...payload, createdAt: new Date().toISOString() });
      writeScoped(HISTORY_FILE, owner, history.slice(0, 100));
      return json(response, 201, history.slice(0, 100));
    } catch (error) {
      return json(response, 400, { error: error.message });
    }
  }
  if (request.method === "POST" && url.pathname === "/api/feedback") {
    try {
      const payload = await bodyFrom(request);
      const allowed = ["too-formal", "too-casual", "uncomfortable", "not-my-style", "good-fit"];
      if (!payload || typeof payload.outfit !== "string" || !allowed.includes(payload.feedback)) {
        return json(response, 400, { error: "Valid outfit feedback is required" });
      }
      const owner = dataOwner(request);
      const feedback = readScoped(FEEDBACK_FILE, owner);
      feedback.unshift({ ...payload, createdAt: new Date().toISOString() });
      writeScoped(FEEDBACK_FILE, owner, feedback.slice(0, 500));
      return json(response, 201, { status: "recorded" });
    } catch (error) {
      return json(response, 400, { error: error.message });
    }
  }
  if (request.method === "POST" && url.pathname === "/api/saved") {
    try {
      const payload = await bodyFrom(request);
      if (!payload || typeof payload.name !== "string") return json(response, 400, { error: "Outfit name is required" });
      const owner = dataOwner(request);
      const saved = readScoped(SAVED_FILE, owner);
      if (!saved.some(outfit => outfit.name === payload.name)) {
        saved.push(payload);
        writeScoped(SAVED_FILE, owner, saved);
      }
      return json(response, 201, saved);
    } catch (error) {
      return json(response, 400, { error: error.message });
    }
  }
  if (request.method === "DELETE" && url.pathname.startsWith("/api/saved/")) {
    const name = decodeURIComponent(url.pathname.slice("/api/saved/".length));
    const owner = dataOwner(request);
    const saved = readScoped(SAVED_FILE, owner).filter(outfit => outfit.name !== name);
    writeScoped(SAVED_FILE, owner, saved);
    return json(response, 200, saved);
  }
  if (request.method === "DELETE" && url.pathname === "/api/data") {
    const owner = dataOwner(request);
    writeScoped(SAVED_FILE, owner, []);
    writeScoped(HISTORY_FILE, owner, []);
    writeScoped(FEEDBACK_FILE, owner, []);
    return json(response, 200, { status: "deleted" });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return json(response, 405, { error: "Method not allowed" });
  }

  const relativePath = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const filePath = path.resolve(ROOT, relativePath);
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== path.join(ROOT, "index.html")) {
    return json(response, 403, { error: "Forbidden" });
  }
  fs.readFile(filePath, (error, data) => {
    if (error) return json(response, 404, { error: "Not found" });
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    response.end(request.method === "HEAD" ? undefined : data);
  });
}

http.createServer((request, response) => {
  handler(request, response).catch(error => json(response, 500, { error: error.message }));
}).listen(PORT, () => {
  console.log(`Nuana is running at http://localhost:${PORT}`);
});
