(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.NuanaUserContext = api;
  }
})(globalThis, function () {
  const SEASONS = {
    north: {
      winter: [12, 1, 2],
      spring: [3, 4, 5],
      summer: [6, 7, 8],
      autumn: [9, 10, 11]
    },
    south: {
      winter: [6, 7, 8],
      spring: [9, 10, 11],
      summer: [12, 1, 2],
      autumn: [3, 4, 5]
    }
  };

  function getTimeOfDay(hour) {
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) return null;
    if (hour < 5 || hour >= 21) return "night";
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  }

  function getHemisphere(latitude) {
    if (!Number.isFinite(latitude) || latitude === 0) return null;
    return latitude < 0 ? "south" : "north";
  }

  // Season uses the browser's local calendar month and the selected location's hemisphere.
  function getSeason(month, hemisphere) {
    if (!Number.isInteger(month) || month < 1 || month > 12) return null;
    const region = hemisphere === "south" ? SEASONS.south : hemisphere === "north" ? SEASONS.north : null;
    if (!region) return null;
    return Object.keys(region).find(season => region[season].includes(month)) || null;
  }

  function create(options = {}) {
    const browserNavigator = options.navigator || globalThis.navigator || {};
    const fetchData = options.fetch || ((...args) => globalThis.fetch(...args));
    const language = options.language || browserNavigator.language || "en";
    const timeZone = options.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    const userContext = {
      language,
      timeZone,
      localDate: null,
      localDateTime: null,
      localHour: null,
      timeOfDay: null,
      hemisphere: null,
      season: null,
      location: null,
      weather: null,

      refreshClock(now = new Date()) {
        const parts = new Intl.DateTimeFormat("en-CA", {
          timeZone: this.timeZone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hourCycle: "h23"
        }).formatToParts(now).reduce((result, part) => {
          if (part.type !== "literal") result[part.type] = part.value;
          return result;
        }, {});
        this.localDate = `${parts.year}-${parts.month}-${parts.day}`;
        this.localDateTime = `${this.localDate}T${parts.hour}:${parts.minute}:${parts.second}`;
        this.localHour = Number(parts.hour);
        this.timeOfDay = getTimeOfDay(this.localHour);
        this.season = getSeason(Number(parts.month), this.hemisphere);
        return this;
      },

      getRecommendationContext(now = new Date()) {
        this.refreshClock(now);
        return {
          language: this.language,
          timeZone: this.timeZone,
          localDate: this.localDate,
          localDateTime: this.localDateTime,
          timeOfDay: this.timeOfDay,
          hemisphere: this.hemisphere,
          season: this.season,
          weather: this.weather
        };
      },

      async fetchWeather(latitude, longitude) {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.search = new URLSearchParams({
          latitude: String(latitude),
          longitude: String(longitude),
          current: "temperature_2m,precipitation,weather_code",
          daily: "temperature_2m_min,temperature_2m_max,precipitation_probability_max,weather_code",
          forecast_days: "3",
          timezone: "auto"
        });
        const data = await requestJson(url, "Weather");
        const temperatureC = Number(data.current?.temperature_2m);
        if (!Number.isFinite(temperatureC)) throw new Error("Weather data was incomplete");

        const forecast = (data.daily?.time || []).map((date, index) => ({
          date,
          temperatureMinC: data.daily.temperature_2m_min?.[index] ?? null,
          temperatureMaxC: data.daily.temperature_2m_max?.[index] ?? null,
          precipitationProbabilityMax: data.daily.precipitation_probability_max?.[index] ?? null,
          weatherCode: data.daily.weather_code?.[index] ?? null
        }));

        return {
          current: {
            temperatureC,
            precipitationMm: Number(data.current?.precipitation) || 0,
            weatherCode: data.current?.weather_code ?? null
          },
          forecast
        };
      },

      async setCoordinates(latitude, longitude, location, source) {
        // Location stays in this in-memory context; getRecommendationContext omits it.
        this.location = {
          city: location.city || "",
          region: location.region || "",
          country: location.country || "",
          latitude,
          longitude,
          source
        };
        this.hemisphere = getHemisphere(latitude);
        this.refreshClock();
        this.weather = null;
        try {
          this.weather = await this.fetchWeather(latitude, longitude);
          return { context: this, warning: null };
        } catch (error) {
          return {
            context: this,
            warning: `${error.message}. Recommendations will continue without live weather.`
          };
        }
      },

      useLocation() {
        const geolocation = browserNavigator.geolocation;
        if (!geolocation) return Promise.reject(new Error("Location is unavailable. You can search for a city instead."));

        return new Promise((resolve, reject) => {
          geolocation.getCurrentPosition(
            async position => {
              try {
                const { latitude, longitude } = position.coords;
                resolve(await this.setCoordinates(latitude, longitude, {}, "browser"));
              } catch (error) {
                reject(error);
              }
            },
            error => {
              const message = error.code === 1
                ? "Location permission was denied."
                : error.code === 3
                  ? "Location lookup timed out."
                  : "Your location could not be determined.";
              reject(new Error(`${message} You can search for a city instead.`));
            },
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 3600000 }
          );
        });
      },

      async searchCity(city) {
        const name = typeof city === "string" ? city.trim() : "";
        if (!name || name.length > 120) throw new Error("Enter a city name (up to 120 characters).");

        const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
        url.search = new URLSearchParams({
          name,
          count: "1",
          language: this.language.split("-")[0],
          format: "json"
        });
        const data = await requestJson(url, "City search");
        const result = data.results?.[0];
        if (!result) throw new Error("No matching city was found. Check the spelling and try again.");
        return this.setCoordinates(result.latitude, result.longitude, {
          city: result.name,
          region: result.admin1 || "",
          country: result.country || ""
        }, "city");
      }
    };

    async function requestJson(url, label) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetchData(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`${label} service is unavailable`);
        return await response.json();
      } catch (error) {
        if (error.name === "AbortError") throw new Error(`${label} lookup timed out`);
        throw error;
      } finally {
        clearTimeout(timeout);
      }
    }

    return userContext.refreshClock();
  }

  return { create, getHemisphere, getSeason, getTimeOfDay };
});
