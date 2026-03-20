import { useState, useEffect, useCallback } from 'react';
import { getWeatherData, calculateRiskScore } from '../services/weatherService';

export function useWeather(city = 'hyderabad', refreshInterval = 30000) {
  const [data, setData]       = useState(null);
  const [risk, setRisk]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    try {
      const weather = await getWeatherData(city);
      const riskScore = calculateRiskScore(weather);
      setData(weather);
      setRisk(riskScore);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetch();
    const timer = setInterval(fetch, refreshInterval);
    return () => clearInterval(timer);
  }, [fetch, refreshInterval]);

  return { data, risk, loading, error, refetch: fetch };
}
