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

function readSaved() {
  try {
    if (!fs.existsSync(SAVED_FILE)) return [];
    return JSON.parse(fs.readFileSync(SAVED_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeSaved(saved) {
  fs.writeFileSync(SAVED_FILE, JSON.stringify(saved, null, 2));
}

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

function recommendationsFor(moodId, gender, exclude, weather, occasion, wardrobe) {
  const validGender = ["women", "men", "unisex"].includes(gender) ? gender : "unisex";
  const matching = outfits.filter(outfit => outfit.mood.includes(moodId));
  const pool = matching.length >= 3 ? matching : [...matching, ...outfits];
  const unique = [...new Map(pool.map(outfit => [outfit.id, outfit])).values()];
  let candidates = unique.filter(outfit => !exclude.includes(outfit.id));

  if (Array.isArray(wardrobe) && wardrobe.length) {
    const owned = wardrobe.map(item => item.toLowerCase());
    candidates = [...candidates].sort((a, b) => {
      const indexA = outfitBase.findIndex(item => item[0] === a.id);
      const indexB = outfitBase.findIndex(item => item[0] === b.id);
      const textA = `${variants["unisex"][indexA]} ${a.style}`.toLowerCase();
      const textB = `${variants["unisex"][indexB]} ${b.style}`.toLowerCase();
      const scoreA = owned.filter(item => textA.includes(item)).length;
      const scoreB = owned.filter(item => textB.includes(item)).length;
      return scoreB - scoreA;
    });
  }

  if (occasion === "work") {
    const workFriendly = ["Soft-Focus", "Quiet-Power", "Gallery-Light", "Boardroom-Bloom", "Perfectly-Unbothered"];
    const workMatches = candidates.filter(outfit => workFriendly.includes(outfit.id));
    if (workMatches.length >= 2) candidates = workMatches;
  }
  if (occasion === "outdoor") {
    const outdoorFriendly = ["Open-Road", "City-Rhythm", "June-In-Motion", "Perfectly-Unbothered"];
    const outdoorMatches = candidates.filter(outfit => outdoorFriendly.includes(outfit.id));
    if (outdoorMatches.length >= 2) candidates = outdoorMatches;
  }
  if (weather === "hot") {
    candidates = candidates.filter(outfit => !["Slow-Sunday", "After-Hours", "Velvet-Low-Tide"].includes(outfit.id));
  }
  if (weather === "cold" || weather === "rainy") {
    candidates = [...candidates].sort((a, b) => {
      const coldFriendly = ["Soft-Focus", "Quiet-Power", "Slow-Sunday", "Gallery-Light", "Boardroom-Bloom"];
      return Number(coldFriendly.includes(b.id)) - Number(coldFriendly.includes(a.id));
    });
  }
  if (candidates.length < 3) candidates = unique;

  const seed = `${moodId}-${validGender}-${Date.now()}`;
  const shuffled = [...candidates].sort((a, b) => {
    const hashA = [...(a.id + seed)].reduce((n, char) => (n * 31 + char.charCodeAt(0)) >>> 0, 7);
    const hashB = [...(b.id + seed)].reduce((n, char) => (n * 31 + char.charCodeAt(0)) >>> 0, 7);
    return (hashA % 997) - (hashB % 997);
  });

  return shuffled.slice(0, 3).map(outfit => {
    const index = outfitBase.findIndex(item => item[0] === outfit.id);
    return {
      ...outfit,
      name: outfit.name.replaceAll("-", " "),
      desc: variants[validGender][index],
      gender: validGender
    };
  });
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
    writeSaved([]);
    writeJson(HISTORY_FILE, []);
    writeJson(FEEDBACK_FILE, []);
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
      const days = Math.min(Math.max(Number(payload.days) || 3, 1), 14);
      const weather = ["cold", "mild", "hot", "rainy"].includes(payload.weather) ? payload.weather : "mild";
      const gender = ["women", "men", "unisex"].includes(payload.gender) ? payload.gender : "unisex";
      const capsuleIds = weather === "hot"
        ? ["June-In-Motion", "Perfectly-Unbothered", "Open-Road", "Golden-Hour"]
        : weather === "cold"
          ? ["Soft-Focus", "Quiet-Power", "Slow-Sunday", "Open-Road"]
          : weather === "rainy"
            ? ["City-Rhythm", "Perfectly-Unbothered", "Blue-Note", "Soft-Focus"]
            : ["Soft-Focus", "Perfectly-Unbothered", "City-Rhythm", "June-In-Motion"];
      const capsule = capsuleIds.slice(0, Math.min(3 + Math.ceil(days / 4), 6)).map((id, index) => {
        const outfit = outfits.find(item => item.id === id);
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
        packingTip: "Pack interchangeable neutral shoes and repeat the outer layer before adding new items."
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
    if (!moods.some(item => item.id === mood)) return json(response, 400, { error: "Unknown mood" });
    if (!["women", "men", "unisex"].includes(gender)) return json(response, 400, { error: "Unknown gender option" });
    if (!["any", "cold", "mild", "hot", "rainy"].includes(weather)) return json(response, 400, { error: "Unknown weather" });
    if (!["everyday", "work", "date", "event", "travel", "outdoor"].includes(occasion)) return json(response, 400, { error: "Unknown occasion" });
    return json(response, 200, recommendationsFor(mood, gender, exclude, weather, occasion, wardrobe));
  }
  if (request.method === "GET" && url.pathname === "/api/saved") {
    return json(response, 200, readSaved());
  }
  if (request.method === "GET" && url.pathname === "/api/history") {
    return json(response, 200, readJson(HISTORY_FILE));
  }
  if (request.method === "POST" && url.pathname === "/api/history") {
    try {
      const payload = await bodyFrom(request);
      if (!payload || typeof payload.outfit !== "string") return json(response, 400, { error: "Outfit is required" });
      const history = readJson(HISTORY_FILE);
      history.unshift({ ...payload, createdAt: new Date().toISOString() });
      writeJson(HISTORY_FILE, history.slice(0, 100));
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
      const feedback = readJson(FEEDBACK_FILE);
      feedback.unshift({ ...payload, createdAt: new Date().toISOString() });
      writeJson(FEEDBACK_FILE, feedback.slice(0, 500));
      return json(response, 201, { status: "recorded" });
    } catch (error) {
      return json(response, 400, { error: error.message });
    }
  }
  if (request.method === "POST" && url.pathname === "/api/saved") {
    try {
      const payload = await bodyFrom(request);
      if (!payload || typeof payload.name !== "string") return json(response, 400, { error: "Outfit name is required" });
      const saved = readSaved();
      if (!saved.some(outfit => outfit.name === payload.name)) {
        saved.push(payload);
        writeSaved(saved);
      }
      return json(response, 201, saved);
    } catch (error) {
      return json(response, 400, { error: error.message });
    }
  }
  if (request.method === "DELETE" && url.pathname.startsWith("/api/saved/")) {
    const name = decodeURIComponent(url.pathname.slice("/api/saved/".length));
    const saved = readSaved().filter(outfit => outfit.name !== name);
    writeSaved(saved);
    return json(response, 200, saved);
  }
  if (request.method === "DELETE" && url.pathname === "/api/data") {
    writeSaved([]);
    writeJson(HISTORY_FILE, []);
    writeJson(FEEDBACK_FILE, []);
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
