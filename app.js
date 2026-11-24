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

const outfits = [
  { name: "The Soft Focus", style: "Relaxed tailoring", desc: "Cream ribbed tee · stone pleated trousers · oat loafers", occasion: "Coffee, errands or a relaxed workday", mood: ["happy","calm","cozy","grounded","peaceful","overwhelmed"], bg: "#dde9e7", top: "#ece7dc", bottom: "#8e9f99", shoe: "#f4f1e7", skin: "#ad7457", hair: "#4a3830", badge: "Soft" },
  { name: "Golden Hour", style: "Warm minimal", desc: "Saffron tank · ivory wide-leg jeans · tan crossbody", occasion: "Lunch outside or a golden-hour walk", mood: ["happy","optimistic","energetic","playful","spontaneous"], bg: "#f2dfad", top: "#e2b62e", bottom: "#eee8d6", shoe: "#5f5141", skin: "#704737", hair: "#211d1a", badge: "Bright" },
  { name: "Quiet Power", style: "Modern monochrome", desc: "Charcoal fitted blazer · silk shell · straight cream trousers", occasion: "Presentations, interviews or important meetings", mood: ["confident","focused","professional","elegant","grounded"], bg: "#d9d8d1", top: "#252a27", bottom: "#eeece3", shoe: "#252521", skin: "#c08b70", hair: "#2b2521", badge: "Sharp" },
  { name: "Main Character", style: "Color blocking", desc: "Violet oversized shirt · stone mini skirt · burgundy pumps", occasion: "Dinner, gallery opening or a first date", mood: ["confident","rebellious","seductive","energetic","adventurous"], bg: "#d9cbee", top: "#9b79bd", bottom: "#e5e0d5", shoe: "#b43d52", skin: "#7d5039", hair: "#171718", badge: "Statement" },
  { name: "Paper Rose", style: "Romantic casual", desc: "Blush lace-trim blouse · relaxed blue jeans · pearl flats", occasion: "Weekend brunch or a bookstore date", mood: ["romantic","dreamy","nostalgic","playful"], bg: "#efdae0", top: "#c98292", bottom: "#a9b1b5", shoe: "#f4ece7", skin: "#d2a17d", hair: "#88664c", badge: "Soft" },
  { name: "Lavender Haze", style: "Art school ease", desc: "Lavender mesh cardigan · silver slip skirt · lilac ankle boots", occasion: "Creative class, museum or afternoon plans", mood: ["dreamy","creative","romantic","calm","nostalgic"], bg: "#dfd8ef", top: "#9f94c2", bottom: "#e7dfe7", shoe: "#6f6a78", skin: "#9e684e", hair: "#4b392f", badge: "Airy" },
  { name: "After Hours", style: "Noir romance", desc: "Black satin blouse · tailored leather-look skirt · pointed flats", occasion: "Late dinner or cocktail evening", mood: ["mysterious","seductive","rebellious","elegant"], bg: "#bbbdb6", top: "#30332f", bottom: "#1e211f", shoe: "#151716", skin: "#d39e7b", hair: "#302522", badge: "Noir" },
  { name: "City Rhythm", style: "Polished street", desc: "Teal cropped jacket · white crop tee · tapered cargo trousers", occasion: "City exploring or a casual live show", mood: ["restless","rebellious","adventurous","spontaneous","energetic"], bg: "#bcd3d9", top: "#466b70", bottom: "#d6d3c7", shoe: "#f2eee2", skin: "#b77a5b", hair: "#26201e", badge: "Street" },
  { name: "Slow Sunday", style: "Ultra cozy", desc: "Oat cashmere cardigan · slate lounge trouser · shearling slippers", occasion: "Slow morning at home or a neighborhood stroll", mood: ["cozy","calm","peaceful","melancholy","overwhelmed"], bg: "#e5dcc9", top: "#b7a98f", bottom: "#7f806f", shoe: "#ded0b7", skin: "#8e5e48", hair: "#5a493d", badge: "Cozy" },
  { name: "Open Road", style: "Utility explorer", desc: "Olive field jacket · sand tee · khaki trail shorts", occasion: "Day trip, hike or outdoor market", mood: ["adventurous","spontaneous","restless","grounded"], bg: "#ccd7c3", top: "#747d5e", bottom: "#c5a886", shoe: "#5a4d3e", skin: "#b77b5e", hair: "#302922", badge: "Utility" },
  { name: "Gallery Light", style: "Creative refined", desc: "Periwinkle sculptural top · draped ecru pants · black mules", occasion: "Exhibition, portfolio review or dinner party", mood: ["creative","elegant","focused","mysterious","professional"], bg: "#ddd5bf", top: "#7d82a3", bottom: "#d8d2c5", shoe: "#2e302e", skin: "#704b38", hair: "#1f1d1b", badge: "Editorial" },
  { name: "Perfectly Unbothered", style: "Effortless basics", desc: "Washed cotton tee · softened straight jeans · moss canvas sneakers", occasion: "Everyday plans with zero outfit anxiety", mood: ["peaceful","cozy","grounded","happy","nostalgic"], bg: "#dadccf", top: "#ecebdc", bottom: "#6e7d79", shoe: "#a7a394", skin: "#c79572", hair: "#684a37", badge: "Easy" },
  { name: "Cherry On Top", style: "Retro pop", desc: "Cherry red knit · white A-line skirt · cherry Mary Janes", occasion: "A playful afternoon or casual celebration", mood: ["playful","spontaneous","happy","optimistic"], bg: "#e5c4bd", top: "#bf4d56", bottom: "#f0eade", shoe: "#c44d58", skin: "#945d42", hair: "#241f1d", badge: "Retro" },
  { name: "Blue Note", style: "Quiet cool", desc: "Dusty-blue mock neck · faded straight jeans · charcoal derby shoes", occasion: "Quiet plans, studying or rainy-day wandering", mood: ["melancholy","calm","mysterious","focused"], bg: "#cad8df", top: "#718d9a", bottom: "#d8d2c5", shoe: "#4d5558", skin: "#82584a", hair: "#362f2b", badge: "Moody" },
  { name: "Boardroom Bloom", style: "Modern professional", desc: "Sage wrap shirt · charcoal pencil trouser · almond loafers", occasion: "Office day, pitch or formal lunch", mood: ["professional","focused","confident","elegant"], bg: "#d9d8d0", top: "#a6b0a1", bottom: "#343936", shoe: "#242725", skin: "#b78060", hair: "#302923", badge: "Polished" },
  { name: "June in Motion", style: "Vacation energy", desc: "Butter-yellow linen shirt · blue cotton shorts · terracotta sandals", occasion: "Beach town, festival or outdoor trip", mood: ["optimistic","energetic","adventurous","playful","spontaneous"], bg: "#d7e2bc", top: "#eee4b3", bottom: "#789396", shoe: "#b66d55", skin: "#d0a17f", hair: "#6d5542", badge: "Fresh" },
  { name: "Velvet Low Tide", style: "Textural evening", desc: "Plum velvet camisole · black bias-cut skirt · patent slingbacks", occasion: "Low-lit restaurant or intimate evening event", mood: ["seductive","mysterious","romantic","melancholy"], bg: "#c7bdc7", top: "#4e4657", bottom: "#302f39", shoe: "#1f2024", skin: "#a56e52", hair: "#261e1b", badge: "Evening" },
  { name: "Outside the Lines", style: "Deconstructed casual", desc: "Ochre asymmetric shirt · slate wide-leg trouser · ecru technical sneaker", occasion: "Art event, studio visit or unconventional night out", mood: ["creative","rebellious","restless","confident"], bg: "#dbd1c4", top: "#d6bb62", bottom: "#777f85", shoe: "#dcd8ca", skin: "#7a503c", hair: "#17191a", badge: "Experimental" }
];

const categories = ["All", "Bright", "Soft", "Bold", "Deep", "Refined"];
const userContext = window.NuanaUserContext.create();
const preferenceKeys = ["nuanaGender", "nuanaWeather", "nuanaOccasion", "nuanaWardrobe", "nuanaRecentlyWorn"];
let storageConsent = localStorage.getItem("nuanaStorageConsent") === "yes";
function savedPreference(key) {
  return storageConsent ? localStorage.getItem(key) : null;
}
function rememberPreference(key, value) {
  if (storageConsent) localStorage.setItem(key, value);
}
let activeCategory = "All";
let activeMood = "happy";
let activeGender = savedPreference("nuanaGender") || "unisex";
let activeWeather = savedPreference("nuanaWeather") || "any";
let manualWeather = activeWeather;
let activeOccasion = savedPreference("nuanaOccasion") || "everyday";
let wardrobe = JSON.parse(savedPreference("nuanaWardrobe") || "null") || [
  "tailored trousers", "relaxed jeans", "cotton tee", "knit", "blazer", "jacket", "loafers", "trainers"
];
let suggestedHistory = [];
let recentlyWorn = JSON.parse(savedPreference("nuanaRecentlyWorn") || "[]");
let savedOutfits = [];
let recommendationLimit = 3;
const recommendationCache = new Map();

const moodTabs = document.querySelector("#moodTabs");
const moodGrid = document.querySelector("#moodGrid");
const outfitGrid = document.querySelector("#outfitGrid");
const savedGrid = document.querySelector("#savedGrid");

function renderTabs() {
  moodTabs.innerHTML = categories.map(category =>
    `<button class="mood-tab ${category === activeCategory ? "active" : ""}" data-category="${category}">${category}</button>`
  ).join("");
}

function renderMoods() {
  const visible = activeCategory === "All" ? moods : moods.filter(mood => mood.category === activeCategory);
  moodGrid.innerHTML = visible.map(mood =>
    `<button class="mood-card ${mood.id === activeMood ? "selected" : ""}" data-mood="${mood.id}" data-color="${mood.color}" aria-pressed="${mood.id === activeMood}">
      <span class="mood-icon">${mood.emoji}</span>
      <span class="mood-name">${mood.name}</span>
    </button>`
  ).join("");
}

function recommendationReason(outfit, context = {}) {
  const weather = context.weather || activeWeather;
  const occasion = context.occasion || activeOccasion;
  const moodId = context.mood || activeMood;
  const weatherText = weather === "any" ? "seasonless styling" : `${weather} weather`;
  const occasionText = occasion === "everyday" ? "daily wear" : occasion;
  const localContext = [userContext.timeOfDay, userContext.season].filter(Boolean).join(" and ");
  const localContextText = localContext ? `, suited to ${localContext} locally` : "";
  const style = outfit.style.toLowerCase();
  const article = /^[aeiou]/.test(style) ? "an" : "a";
  return `Why: ${weatherText}, ${occasionText}${localContextText}, and ${article} ${style} shape selected for ${moods.find(mood => mood.id === moodId)?.name.toLowerCase() || "this"} mood.`;
}

async function getRecommendations(moodId, limit = recommendationLimit) {
  const exclude = suggestedHistory.join(",");
  const query = new URLSearchParams({
    mood: moodId,
    gender: activeGender,
    weather: activeWeather,
    occasion: activeOccasion,
    wardrobe: wardrobe.join(","),
    exclude,
    limit: String(limit),
    context: JSON.stringify(userContext.getRecommendationContext())
  });
  try {
    const response = await fetch(`/api/recommendations?${query}`);
    if (!response.ok) throw new Error("Recommendation request failed");
    return await response.json();
  } catch {
    showToast("Using offline recommendations");
    const matching = outfits.filter(outfit => outfit.mood.includes(moodId));
    const pool = matching.length >= 3 ? matching : [...matching, ...outfits];
    return pool.slice(0, 3);
  }
}

function outfitCard(outfit, context) {
  const saved = savedOutfits.some(savedOutfit => savedOutfit.name === outfit.name);
  return `
    <article class="outfit-card" data-name="${outfit.name}">
      <div class="outfit-image" style="--card-bg:${outfit.bg}">
        <span class="outfit-badge">${outfit.badge}</span>
        <button class="save-button ${saved ? "saved" : ""}" data-save="${outfit.name}" aria-label="${saved ? "Remove" : "Save"} ${outfit.name}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>
        </button>
        <div class="outfit-visual" style="--skin:${outfit.skin};--hair:${outfit.hair};--top:${outfit.top};--bottom:${outfit.bottom};--shoe:${outfit.shoe}">
          <div class="figure-hair"></div>
          <div class="figure-head"></div>
          <div class="figure-neck"></div>
          <div class="figure-top"></div>
          <div class="figure-bottom"></div>
          <div class="figure-shoe left"></div>
          <div class="figure-shoe right"></div>
        </div>
      </div>
      <div class="outfit-info">
        <div class="outfit-info-row">
          <div class="outfit-copy">
            <h3 class="outfit-name">${outfit.name}</h3>
            <p class="outfit-desc">${outfit.desc}</p>
            <p class="outfit-occasion">${outfit.occasion}</p>
            <p class="recommendation-reason">${recommendationReason(outfit, context)}</p>
          </div>
          <div class="palette" aria-label="${outfit.style} color palette">
            <span class="swatch" style="background:${outfit.top}"></span>
            <span class="swatch" style="background:${outfit.bottom}"></span>
            <span class="swatch" style="background:${outfit.shoe}"></span>
          </div>
        </div>
        <div class="feedback-row" aria-label="How does this look fit?">
          <button class="feedback-button" data-feedback="good-fit" data-outfit="${outfit.name}" aria-label="Good fit">Good fit</button>
          <button class="feedback-button" data-feedback="not-my-style" data-outfit="${outfit.name}" aria-label="Not my style">Not my style</button>
          <button class="feedback-button" data-feedback="too-formal" data-outfit="${outfit.name}" aria-label="Too formal">Too formal</button>
          <button class="feedback-button" data-feedback="too-casual" data-outfit="${outfit.name}" aria-label="Too casual">Too casual</button>
          <button class="feedback-button" data-feedback="uncomfortable" data-outfit="${outfit.name}" aria-label="Uncomfortable">Uncomfortable</button>
          <button class="feedback-button" data-worn="${outfit.name}" aria-label="Mark as worn">Worn</button>
        </div>
      </div>
    </article>`;
}

async function renderRecommendations() {
  const mood = moods.find(item => item.id === activeMood);
  document.querySelector("#recommendationTitle").textContent = `${mood.name} calls for...`;
  outfitGrid.setAttribute("aria-busy", "true");
  const recommendations = await getRecommendations(activeMood);
  recommendations.forEach(outfit => recommendationCache.set(outfit.name, outfit));
  recommendations.forEach(outfit => {
    if (!suggestedHistory.includes(outfit.name)) suggestedHistory.push(outfit.name);
  });
  if (suggestedHistory.length > 30) suggestedHistory = suggestedHistory.slice(-30);
  outfitGrid.innerHTML = recommendations.map(outfitCard).join("");
  outfitGrid.setAttribute("aria-busy", "false");
}

document.querySelector("#moreIdeasButton").addEventListener("click", async () => {
  recommendationLimit = recommendationLimit >= 12 ? 3 : Math.min(recommendationLimit + 3, 12);
  document.querySelector("#moreIdeasButton").textContent =
    recommendationLimit >= 12 ? "Show fewer ideas" : "More combinations";
  await renderRecommendations();
});

document.querySelector("#stylistForm").addEventListener("submit", async event => {
  event.preventDefault();
  const prompt = document.querySelector("#stylistPrompt");
  const reply = document.querySelector("#stylistReply");
  const grid = document.querySelector("#stylistGrid");
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  submit.disabled = true;
  reply.textContent = "Putting together a few ideas…";
  grid.innerHTML = "";
  try {
    const response = await fetch("/api/stylist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt.value,
        mood: activeMood,
        gender: activeGender,
        weather: activeWeather,
        occasion: activeOccasion,
        wardrobe,
        context: userContext.getRecommendationContext()
      })
    });
    const responseText = await response.text();
    let result = null;
    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch {
        if (response.ok) throw new Error("The style helper returned an invalid response. Please try again.");
      }
    }
    if (!response.ok) {
      throw new Error(result?.error || `The style helper request failed (${response.status}). Please try again.`);
    }
    if (!result || typeof result.reply !== "string" || !Array.isArray(result.recommendations)) {
      throw new Error("The style helper returned an incomplete response. Please try again.");
    }
    reply.textContent = result.reply;
    result.recommendations.forEach(outfit => recommendationCache.set(outfit.name, outfit));
    grid.innerHTML = result.recommendations.map(outfit => outfitCard(outfit, result)).join("");
  } catch (error) {
    reply.textContent = error.message || "The style helper is unavailable. Please try again.";
  } finally {
    submit.disabled = false;
  }
});

function renderSaved() {
  const saved = savedOutfits;
  document.querySelector("#savedCount").textContent = saved.length;
  savedGrid.innerHTML = saved.map(outfitCard).join("");
  document.querySelector("#emptySaved").classList.toggle("visible", saved.length === 0);
  savedGrid.style.display = saved.length ? "grid" : "none";
}

async function loadSaved() {
  try {
    const response = await fetch("/api/saved");
    if (!response.ok) throw new Error("Could not load saved looks");
    savedOutfits = await response.json();
  } catch {
    savedOutfits = JSON.parse(localStorage.getItem("nuanaSaved") || "[]").map(name =>
      outfits.find(outfit => outfit.name === name) || { name, desc: "Saved look", occasion: "Saved from your edit", badge: "Saved", bg: "#e8e8e4", top: "#b8b8b0", bottom: "#77796f", shoe: "#e4e1d7", skin: "#ad7457", hair: "#3f342d", style: "Saved" }
    );
  }
  renderSaved();
}

async function saveOutfit(outfitName) {
  const outfit = recommendationCache.get(outfitName) || savedOutfits.find(item => item.name === outfitName);
  if (!outfit) return;
  const response = await fetch("/api/saved", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(outfit)
  });
  if (!response.ok) throw new Error("Could not save this look");
  await loadSaved();
}

async function removeSavedOutfit(outfitName) {
  await fetch(`/api/saved/${encodeURIComponent(outfitName)}`, { method: "DELETE" });
  await loadSaved();
}

function setMood(moodId) {
  activeMood = moodId;
  renderMoods();
  renderRecommendations();
}

function shuffleMood() {
  const available = moods.filter(mood => mood.id !== activeMood);
  const next = available[Math.floor(Math.random() * available.length)];
  activeCategory = "All";
  renderTabs();
  setMood(next.id);
  document.querySelector(`[data-mood="${next.id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  showToast(`Feeling ${next.name.toLowerCase()}?`);
}

let toastTimer;
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 1800);
}

function switchView(view) {
  document.querySelectorAll(".view").forEach(section => section.classList.remove("active"));
  document.querySelector(view === "saved" ? "#savedView" : "#discoverView").classList.add("active");
  document.querySelectorAll(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (view === "saved") renderSaved();
}

moodTabs.addEventListener("click", event => {
  const tab = event.target.closest("[data-category]");
  if (!tab) return;
  activeCategory = tab.dataset.category;
  renderTabs();
  renderMoods();
});

moodGrid.addEventListener("click", event => {
  const card = event.target.closest("[data-mood]");
  if (card) setMood(card.dataset.mood);
});

document.querySelector("#shuffleButton").addEventListener("click", shuffleMood);
document.querySelector("#refreshButton").addEventListener("click", () => {
  renderRecommendations();
  showToast("A fresh look for you");
});

const weatherSelect = document.querySelector("#weatherSelect");
const occasionSelect = document.querySelector("#occasionSelect");
weatherSelect.value = activeWeather;
occasionSelect.value = activeOccasion;

weatherSelect.addEventListener("change", () => {
  activeWeather = weatherSelect.value;
  manualWeather = activeWeather;
  rememberPreference("nuanaWeather", activeWeather);
  suggestedHistory = [];
  renderRecommendations();
});

function localWeatherCategory() {
  const current = userContext.weather?.current;
  if (!current) return null;
  const code = current.weatherCode;
  if (current.precipitationMm > 0 || code >= 51 && code <= 67 || code >= 80 && code <= 82 || code === 95) {
    return "rainy";
  }
  if (current.temperatureC < 12) return "cold";
  if (current.temperatureC > 25) return "hot";
  return "mild";
}

function updateContextStatus(warning = "") {
  userContext.refreshClock();
  const status = document.querySelector("#contextStatus");
  const location = userContext.location;
  const place = location
    ? [location.city, location.region, location.country].filter(Boolean).join(", ") || "your location"
    : null;
  const localDetails = [
    `${userContext.localDateTime} (${userContext.timeOfDay}) in ${userContext.timeZone}`,
    userContext.season
      ? `${userContext.season} in the ${userContext.hemisphere === "south" ? "southern" : "northern"} hemisphere`
      : location ? "season unavailable for this latitude" : "choose a location for local season",
    `language ${userContext.language}`
  ].filter(Boolean);
  const weather = userContext.weather;
  const current = weather?.current;
  const weatherDetails = current
    ? `Now in ${place}: ${current.temperatureC}°C, ${current.precipitationMm} mm precipitation.`
    : "";
  const forecast = weather?.forecast?.length
    ? ` Three-day forecast: ${weather.forecast.map(day =>
      `${day.date} ${day.temperatureMinC}–${day.temperatureMaxC}°C, rain chance ${day.precipitationProbabilityMax ?? "unknown"}%`
    ).join("; ")}.`
    : "";
  status.textContent = [
    localDetails.join(" · "),
    weatherDetails + forecast,
    warning
  ].filter(Boolean).join(" ");
}

async function applyDetectedLocation(result) {
  updateContextStatus(result.warning || "");
  const detected = localWeatherCategory();
  if (detected) {
    activeWeather = detected;
    weatherSelect.value = detected;
  } else {
    activeWeather = manualWeather;
    weatherSelect.value = manualWeather;
  }
  suggestedHistory = [];
  await renderRecommendations();
}

document.querySelector("#weatherLocationButton").addEventListener("click", async () => {
  const consent = window.confirm(
    "Use your location for weather? Your coordinates will be sent to Open-Meteo for current and forecast weather. Nuana will not save them."
  );
  if (!consent) {
    updateContextStatus("Location was not used. You can search for a city instead; recommendations still work without weather.");
    return;
  }

  const button = document.querySelector("#weatherLocationButton");
  button.disabled = true;
  updateContextStatus("Finding your location and local forecast…");
  try {
    const result = await userContext.useLocation();
    await applyDetectedLocation(result);
  } catch (error) {
    updateContextStatus(`${error.message} Recommendations still work without live weather.`);
  } finally {
    button.disabled = false;
  }
});

document.querySelector("#citySearchForm").addEventListener("submit", async event => {
  event.preventDefault();
  const input = document.querySelector("#cityInput");
  const button = event.currentTarget.querySelector('button[type="submit"]');
  button.disabled = true;
  updateContextStatus("Looking up the city and local forecast…");
  try {
    const result = await userContext.searchCity(input.value);
    await applyDetectedLocation(result);
  } catch (error) {
    updateContextStatus(`${error.message} You can still use manual weather settings.`);
  } finally {
    button.disabled = false;
  }
});
occasionSelect.addEventListener("change", () => {
  activeOccasion = occasionSelect.value;
  rememberPreference("nuanaOccasion", activeOccasion);
  suggestedHistory = [];
  renderRecommendations();
});

document.querySelector("#wardrobeButton").addEventListener("click", () => {
  const dialog = document.querySelector("#wardrobeDialog");
  dialog.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.checked = wardrobe.includes(input.value);
  });
  dialog.showModal();
});

document.querySelector("#wardrobeForm").addEventListener("submit", () => {
  wardrobe = [...document.querySelectorAll("#wardrobeForm input:checked")].map(input => input.value);
  rememberPreference("nuanaWardrobe", JSON.stringify(wardrobe));
  suggestedHistory = [];
  renderRecommendations();
  showToast("Wardrobe updated");
});

document.querySelector("#profileButton").addEventListener("click", () => {
  document.querySelector("#rememberPreferences").checked = storageConsent;
  document.querySelector("#privacyDialog").showModal();
  refreshAccountStatus();
});

document.querySelector("#rememberPreferences").addEventListener("change", event => {
  storageConsent = event.currentTarget.checked;
  if (storageConsent) {
    localStorage.setItem("nuanaStorageConsent", "yes");
    rememberPreference("nuanaGender", activeGender);
    rememberPreference("nuanaWeather", activeWeather);
    rememberPreference("nuanaOccasion", activeOccasion);
    rememberPreference("nuanaWardrobe", JSON.stringify(wardrobe));
    rememberPreference("nuanaRecentlyWorn", JSON.stringify(recentlyWorn));
    showToast("Preference storage enabled on this device");
  } else {
    [...preferenceKeys, "nuanaStorageConsent"].forEach(key => localStorage.removeItem(key));
    showToast("Saved device preferences deleted");
  }
});

async function refreshAccountStatus() {
  const response = await fetch("/api/auth/me");
  const status = document.querySelector("#accountStatus");
  const loggedIn = response.ok;
  if (loggedIn) {
    const account = await response.json();
    status.textContent = `Signed in as ${account.email}`;
  } else {
    status.textContent = "No account signed in";
  }
  ["logoutButton", "deleteAccountButton"].forEach(id => {
    document.querySelector(`#${id}`).hidden = !loggedIn;
  });
  document.querySelector("#registerButton").hidden = loggedIn;
  document.querySelector("#loginButton").hidden = loggedIn;
  document.querySelector(".account-fields").hidden = loggedIn;
}

async function accountRequest(path, action) {
  const email = document.querySelector("#accountEmail").value.trim();
  const password = document.querySelector("#accountPassword").value;
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!response.ok) {
    showToast(data.error || "Account request failed");
    return;
  }
  showToast(action);
  await refreshAccountStatus();
}

document.querySelector("#registerButton").addEventListener("click", () =>
  accountRequest("/api/auth/register", "Account created")
);
document.querySelector("#loginButton").addEventListener("click", () =>
  accountRequest("/api/auth/login", "Signed in")
);
document.querySelector("#logoutButton").addEventListener("click", async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  showToast("Signed out");
  await refreshAccountStatus();
});
document.querySelector("#deleteAccountButton").addEventListener("click", async () => {
  if (!window.confirm("Delete this account and all server-side saved data?")) return;
  try {
    const response = await fetch("/api/auth/account", { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not delete the account");
    ["nuanaSaved", ...preferenceKeys, "nuanaStorageConsent", "nuanaTheme"]
      .forEach(key => localStorage.removeItem(key));
    showToast("Account and local data deleted");
    window.location.reload();
  } catch (error) {
    showToast(error.message || "Could not delete the account. Please try again.");
  }
});

document.querySelector("#travelButton").addEventListener("click", () => {
  document.querySelector("#capsuleResults").innerHTML = "";
  document.querySelector("#travelDialog").showModal();
});

document.querySelector("#generateCapsuleButton").addEventListener("click", async () => {
  const daysInput = document.querySelector("#travelDays");
  const results = document.querySelector("#capsuleResults");
  if (!daysInput.reportValidity()) return;
  const button = document.querySelector("#generateCapsuleButton");
  button.disabled = true;
  results.textContent = "Building your packing plan…";
  try {
    const response = await fetch("/api/travel/capsule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        days: daysInput.value,
        weather: activeWeather,
        gender: activeGender,
        wardrobe
      })
    });
    const capsule = await response.json();
    if (!response.ok) throw new Error(capsule.error || "Could not build a capsule");
    if (capsule.capsule.length !== capsule.days) throw new Error("The packing plan was incomplete. Please try again.");
    results.innerHTML = capsule.capsule.map(item =>
      `<div class="capsule-item"><strong>Day ${item.day}: ${item.name}</strong><br>${item.desc}<br>${item.occasion}</div>`
    ).join("") + `<div class="recommendation-reason">${capsule.packingTip}</div>`;
  } catch (error) {
    results.textContent = error.message || "Could not build a capsule. Please try again.";
  } finally {
    button.disabled = false;
  }
});

document.querySelector("#exportDataButton").addEventListener("click", async () => {
  try {
    const [savedResponse, historyResponse, feedbackResponse] = await Promise.all([
      fetch("/api/saved"),
      fetch("/api/history"),
      fetch("/api/feedback")
    ]);
    if (![savedResponse, historyResponse, feedbackResponse].every(response => response.ok)) {
      throw new Error("Could not export all of your server data");
    }
    const exportData = {
      exportedAt: new Date().toISOString(),
      localPreferences: {
        presentation: activeGender,
        weather: activeWeather,
        occasion: activeOccasion,
        wardrobe
      },
      saved: await savedResponse.json(),
      history: await historyResponse.json(),
      feedback: await feedbackResponse.json(),
      recentlyWorn
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "nuana-my-data.json";
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Data exported");
  } catch (error) {
    showToast(error.message || "Could not export your data. Please try again.");
  }
});

document.querySelector("#deleteDataButton").addEventListener("click", async () => {
  if (!window.confirm("Delete your Nuana preferences, saved looks, history, and feedback from this browser and the server?")) return;
  try {
    const response = await fetch("/api/data", { method: "DELETE" });
    if (!response.ok) throw new Error("The server could not delete your data");
    ["nuanaSaved", ...preferenceKeys, "nuanaStorageConsent", "nuanaTheme"]
      .forEach(key => localStorage.removeItem(key));
    window.location.reload();
  } catch (error) {
    showToast(error.message || "Could not delete your data. Please try again.");
  }
});

document.querySelectorAll("[data-gender]").forEach(button => {
  button.addEventListener("click", () => {
    activeGender = button.dataset.gender;
    rememberPreference("nuanaGender", activeGender);
    document.querySelectorAll("[data-gender]").forEach(option =>
      option.classList.toggle("active", option.dataset.gender === activeGender)
    );
    suggestedHistory = [];
    renderRecommendations();
  });
});

document.addEventListener("click", event => {
  const wornButton = event.target.closest("[data-worn]");
  if (wornButton) {
    recentlyWorn = [wornButton.dataset.worn, ...recentlyWorn.filter(name => name !== wornButton.dataset.worn)].slice(0, 20);
    rememberPreference("nuanaRecentlyWorn", JSON.stringify(recentlyWorn));
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outfit: wornButton.dataset.worn, action: "worn" })
    }).catch(() => {});
    wornButton.classList.add("selected");
    showToast("Added to recently worn");
  }

  const feedbackButton = event.target.closest("[data-feedback]");
  if (feedbackButton) {
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outfit: feedbackButton.dataset.outfit, feedback: feedbackButton.dataset.feedback })
    }).then(async response => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save your feedback");
      feedbackButton.parentElement.querySelectorAll("[data-feedback]").forEach(button => button.classList.remove("selected"));
      feedbackButton.classList.add("selected");
      showToast("Preference noted — recommendations updated");
      await renderRecommendations();
    }).catch(error => showToast(error.message || "Could not save your feedback"));
  }

  const saveButton = event.target.closest("[data-save]");
  if (saveButton) {
    const name = saveButton.dataset.save;
    const isSaved = savedOutfits.some(outfit => outfit.name === name);
    if (isSaved) {
      removeSavedOutfit(name).then(() => showToast("Removed from saved"));
    } else {
      saveOutfit(name).then(() => {
        document.querySelectorAll(`[data-save="${CSS.escape(name)}"]`).forEach(button => {
          button.classList.add("saved");
          button.setAttribute("aria-label", `Remove ${name}`);
        });
        showToast("Saved to your edit");
      });
    }
  }

  const viewButton = event.target.closest("[data-view]");
  if (viewButton) switchView(viewButton.dataset.view);
});

updateContextStatus();
renderTabs();
renderMoods();
renderRecommendations();
loadSaved();
document.querySelectorAll("[data-gender]").forEach(option =>
  option.classList.toggle("active", option.dataset.gender === activeGender)
);
