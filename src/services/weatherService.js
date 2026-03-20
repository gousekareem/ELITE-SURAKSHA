// ─── Weather & Environment Service ────────────────────────────────────────────
// Uses OpenWeatherMap free tier.
// Set your API key in .env as VITE_WEATHER_API_KEY=your_key_here
// If no key is set, falls back to realistic mock data.

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';

// City coordinates for supported cities
const CITY_COORDS = {
  hyderabad: { lat: 17.385, lon: 78.4867, name: 'Hyderabad' },
  bangalore:  { lat: 12.9716, lon: 77.5946, name: 'Bangalore' },
  mumbai:     { lat: 19.0760, lon: 72.8777, name: 'Mumbai' },
};

// ── Mock data generator (used when no API key) ─────────────────────────────
function getMockWeather(city = 'hyderabad') {
  const hour = new Date().getHours();
  const isEvening = hour >= 17 && hour <= 21;
  const isMonsoon = [6,7,8,9].includes(new Date().getMonth());

  const base = {
    hyderabad: { rain: isMonsoon ? 18 : 2, temp: isEvening ? 28 : 36, aqi: 145, wind: 12 },
    bangalore:  { rain: isMonsoon ? 22 : 4, temp: isEvening ? 22 : 30, aqi: 98,  wind: 8  },
    mumbai:     { rain: isMonsoon ? 45 : 1, temp: isEvening ? 27 : 33, aqi: 187, wind: 18 },
  };

  const b = base[city] || base.hyderabad;
  const jitter = () => (Math.random() - 0.5) * 6;

  return {
    rainfall:    Math.max(0, +(b.rain + jitter()).toFixed(1)),
    temperature: Math.max(18, +(b.temp + jitter() * 0.3).toFixed(1)),
    feelsLike:   Math.max(18, +(b.temp + 3 + jitter() * 0.3).toFixed(1)),
    humidity:    Math.min(99, Math.max(20, Math.round(55 + jitter() * 5))),
    windSpeed:   Math.max(0, +(b.wind + jitter()).toFixed(1)),
    aqi:         Math.max(10, Math.round(b.aqi + jitter() * 8)),
    condition:   b.rain > 20 ? 'Heavy Rain' : b.rain > 5 ? 'Light Rain' : 'Partly Cloudy',
    conditionIcon: b.rain > 20 ? '🌧️' : b.rain > 5 ? '🌦️' : '⛅',
    city:        CITY_COORDS[city]?.name || 'Hyderabad',
    source:      'mock',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  };
}

// ── Real API call ──────────────────────────────────────────────────────────
async function fetchRealWeather(city = 'hyderabad') {
  const { lat, lon, name } = CITY_COORDS[city] || CITY_COORDS.hyderabad;

  const [weatherRes, airRes] = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
  ]);

  if (!weatherRes.ok) throw new Error('Weather API error');

  const weather = await weatherRes.json();
  const air     = airRes.ok ? await airRes.json() : null;

  const rainfall = weather.rain?.['1h'] || weather.rain?.['3h'] || 0;
  const aqiIndex = air?.list?.[0]?.main?.aqi || 2; // 1-5 scale
  // Convert OWM AQI (1-5) to approximate standard AQI
  const aqiMap = { 1: 25, 2: 75, 3: 130, 4: 210, 5: 310 };

  const condIcon =
    weather.weather[0].main === 'Rain'      ? '🌧️' :
    weather.weather[0].main === 'Thunderstorm' ? '⛈️' :
    weather.weather[0].main === 'Clouds'    ? '☁️'  :
    weather.weather[0].main === 'Clear'     ? '☀️'  : '⛅';

  return {
    rainfall:    +rainfall.toFixed(1),
    temperature: +weather.main.temp.toFixed(1),
    feelsLike:   +weather.main.feels_like.toFixed(1),
    humidity:    weather.main.humidity,
    windSpeed:   +(weather.wind.speed * 3.6).toFixed(1), // m/s → km/h
    aqi:         aqiMap[aqiIndex] || 75,
    condition:   weather.weather[0].description
                   .replace(/\b\w/g, c => c.toUpperCase()),
    conditionIcon: condIcon,
    city:        name,
    source:      'live',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  };
}

// ── Public API ─────────────────────────────────────────────────────────────
export async function getWeatherData(city = 'hyderabad') {
  if (!API_KEY) {
    // Simulate a slight delay as if fetching
    await new Promise(r => setTimeout(r, 400));
    return getMockWeather(city);
  }
  try {
    return await fetchRealWeather(city);
  } catch (err) {
    console.warn('[WeatherService] API failed, using mock data:', err.message);
    return getMockWeather(city);
  }
}

// ── Risk Score Calculator ──────────────────────────────────────────────────
export function calculateRiskScore(data) {
  const weatherRisk = Math.min(1,
    (data.rainfall > 50 ? 1 : data.rainfall / 50) * 0.5 +
    (data.temperature > 42 ? 1 : Math.max(0, data.temperature - 30) / 12) * 0.3 +
    (data.windSpeed > 40 ? 1 : data.windSpeed / 40) * 0.2
  );

  const aqiRisk = Math.min(1, data.aqi / 300);

  const hour = new Date().getHours();
  const trafficRisk = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20) ? 0.7 : 0.3;

  const total =
    weatherRisk * 0.40 +
    aqiRisk     * 0.25 +
    trafficRisk * 0.20 +
    0.05;          // baseline platform risk

  return {
    total:   Math.min(100, Math.round(total * 100)),
    weather: Math.round(weatherRisk * 100),
    aqi:     Math.round(aqiRisk * 100),
    traffic: Math.round(trafficRisk * 100),
    label:   total < 0.3 ? 'LOW' : total < 0.6 ? 'MEDIUM' : total < 0.8 ? 'HIGH' : 'CRITICAL',
    color:   total < 0.3 ? '#22C55E' : total < 0.6 ? '#F5A623' : total < 0.8 ? '#F05A1A' : '#EF4444',
  };
}

// ── Payout amounts by event & intensity ───────────────────────────────────
export const PAYOUTS = {
  rain:    { mild: 300, moderate: 500, severe: 600 },
  aqi:     { mild: 200, moderate: 350, severe: 500 },
  heat:    { mild: 200, moderate: 300, severe: 400 },
  curfew:  { mild: 300, moderate: 400, severe: 600 },
  outage:  { mild: 200, moderate: 300, severe: 400 },
  flood:   { mild: 500, moderate: 700, severe: 900 },
};

// ── Trigger thresholds ─────────────────────────────────────────────────────
export const TRIGGERS = {
  rain:  { threshold: 50,  unit: 'mm/hr',  label: 'Rainfall'     },
  aqi:   { threshold: 300, unit: 'AQI',    label: 'Air Quality'  },
  heat:  { threshold: 42,  unit: '°C',     label: 'Temperature'  },
  wind:  { threshold: 60,  unit: 'km/h',   label: 'Wind Speed'   },
};
