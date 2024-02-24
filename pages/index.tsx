// Node modules.
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [fetchingWeather, setFetchingWeather] = useState<boolean>(false);
  const loader = (
    <>
      <span className="ball -right-1" />
      <span className="ball -right-2" />
      <span className="ball -right-3" />
    </>
  );

  const fetchWeather = async () => {
    setFetchingWeather(true);

    try {
      const response = await fetch('/api/weather');
      const data = await response.json();
      console.log('data: ', data);
      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setFetchingWeather(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-white">
      <main>
        <h1 className="text-4xl font-bold text-center">Weather</h1>
        <div className="flex flex-col items-center">
          <p>
            <span className="mr-6 relative">
              City: {fetchingWeather ? loader : weather?.city}
            </span>
            <span className="mr-6 relative">
              {' '}
              State: {fetchingWeather ? loader : weather?.state}
            </span>
            <span className="mr-6 relative">
              Country: {fetchingWeather ? loader : weather?.country}
            </span>
          </p>
          <p>
            <span className="mr-6 relative">
              Temperature Now:{' '}
              {fetchingWeather
                ? loader
                : weather?.temperature
                ? `${weather.temperature} °F`
                : null}
            </span>
            <span className="mr-6 relative">
              Condition:{' '}
              {fetchingWeather
                ? loader
                : weather?.condition
                ? weather.condition
                : null}
            </span>
          </p>
          <p>
            <span className="mr-6 relative">
              Humidity:{' '}
              {fetchingWeather
                ? loader
                : weather?.humidity
                ? `${weather.humidity} %`
                : null}
            </span>
            <span className="mr-6 relative">
              Wind:{' '}
              {fetchingWeather
                ? loader
                : weather?.wind
                ? `${weather.wind} mph`
                : null}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
