import { useEffect, useState } from 'react';
import { CloudSun, Droplets, MapPin, RefreshCw, Wind } from 'lucide-react';

interface City { id: string; name: string; latitude: number; longitude: number }
interface WeatherState { temperature: number; humidity: number; wind: number }

const CITIES: City[] = [
  { id: 'hcm', name: 'TP. Hồ Chí Minh', latitude: 10.8231, longitude: 106.6297 },
  { id: 'hn', name: 'Hà Nội', latitude: 21.0278, longitude: 105.8342 },
  { id: 'dn', name: 'Đà Nẵng', latitude: 16.0544, longitude: 108.2022 },
];

const CACHE_KEY = 'weather-cache-v1';
const DEFAULT_WEATHER: WeatherState = { temperature: 28, humidity: 75, wind: 8 };

function readCache(cityId: string): WeatherState | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, WeatherState>;
    return data[cityId] ?? null;
  } catch {
    return null;
  }
}

function writeCache(cityId: string, state: WeatherState): void {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const data = (raw ? JSON.parse(raw) : {}) as Record<string, WeatherState>;
    data[cityId] = state;
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // bỏ qua nếu bộ nhớ đầy
  }
}

export function WeatherWidget() {
  const [cityId, setCityId] = useState('hcm');
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [offline, setOffline] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const baseCityId = cityId.replace('-retry', '');
  const city = CITIES.find((item) => item.id === baseCityId) ?? CITIES[0];

  useEffect(() => {
    if (!navigator.onLine) {
      setWeather(readCache(baseCityId) ?? DEFAULT_WEATHER);
      setOffline(true);
      return;
    }
    const controller = new AbortController();
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia%2FBangkok`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('weather');
        const value: unknown = await response.json();
        if (!value || typeof value !== 'object') throw new Error('weather');
        const current = (value as { current?: Record<string, unknown> }).current;
        if (!current || typeof current.temperature_2m !== 'number' || typeof current.relative_humidity_2m !== 'number' || typeof current.wind_speed_10m !== 'number') throw new Error('weather');
        const state: WeatherState = { temperature: current.temperature_2m, humidity: current.relative_humidity_2m, wind: current.wind_speed_10m };
        writeCache(baseCityId, state);
        setWeather(state);
        setOffline(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setWeather(readCache(baseCityId) ?? DEFAULT_WEATHER);
        setOffline(true);
      });
    return () => controller.abort();
  }, [city.latitude, city.longitude, baseCityId, reloadKey]);

  const goOnline = () => setReloadKey((value) => value + 1);

  return (
    <div className="weather-widget">
      <div className="weather-main">
        <CloudSun size={25} strokeWidth={1.7} />
        {weather ? <strong>{Math.round(weather.temperature)}°C</strong> : <strong>{DEFAULT_WEATHER.temperature}°C</strong>}
      </div>
      <div className="weather-location"><MapPin size={12} /> {city.name}</div>
      <select value={baseCityId} onChange={(event) => setCityId(event.target.value)} aria-label="Đổi thành phố xem thời tiết">
        {CITIES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      {weather && !offline && <div className="weather-meta"><span><Droplets size={12} /> {Math.round(weather.humidity)}%</span><span><Wind size={12} /> {Math.round(weather.wind)} km/h</span></div>}
      {offline && <button className="weather-retry" onClick={goOnline}><RefreshCw size={12} /> Dữ liệu lưu sẵn · Thử lại</button>}
    </div>
  );
}
