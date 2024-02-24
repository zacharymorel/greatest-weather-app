// Node modules.
import { useEffect, useState } from "react";

const HomePage = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [fetchingWeather, setFetchingWeather] = useState<boolean>(false);

  const fetchWeather = async () => {
    setFetchingWeather(true);

    try {
      const response = await fetch("/api/weather");
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setFetchingWeather(false);
    }
  };

  useEffect(() => {
    void fetchWeather();
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-white bg-neutral-900">
      <main>
        <h1 className="text-4xl font-bold text-center">Weather</h1>
        {fetchingWeather && <p>Loading...</p>}
        {weather && (
          <div className="flex flex-col items-center">
            <p>
              {weather.city}, {weather.state}, {weather.country}
            </p>
            <p>
              {weather.temperature}°F, {weather.condition}
            </p>
            <p>
              Humidity: {weather.humidity}%, Wind: {weather.wind}mph
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
