// Node modules.
import { useEffect, useState } from 'react';

// Relative modules.
import Loader from '@/components/common/Loader';
import Form from '@/components/common/Form';

// TODO: STYLE FORM
// TODO: Add geolocation search by city api endpoint
// TODO: Try auto complete starts after 2 characters?
// TODO: Store history of places selected and searched in Context global?
// TODO: Autocomplete will need styling... Is that another type for the form?? A special case or do I create a separate div to show city results??

const formSchema: FormSchema[] = [
  {
    inputType: 'text',
    label: 'Search for a City',
    name: 'city',
    placeHolder: 'City...',
  },
  {
    inputType: 'submit',
    name: 'submit',
    buttonValue: 'Get Weather!',
  },
];

const HomePage = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [fetchingWeather, setFetchingWeather] = useState<boolean>(false);
  const [weatherSearchFormData, setWeatherSearchFormData] = useState({
    city: '',
  });

  function weatherFormSearchOnChangeHandler(newWeatherState: any) {
    console.log('newWeatherState:: ', newWeatherState);
    setWeatherSearchFormData(newWeatherState);
  }

  function fetchCity() {
    console.log('BAM');
  }

  async function fetchWeather() {
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
  }

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="min-h-screen text-white">
      <main className="flex flex-col space-y-7">
        <h1 className="text-4xl font-bold text-center">
          Find Your Current Weather.
        </h1>
        <div className="flex flex-row justify-center">
          <Form
            schema={formSchema}
            formData={weatherSearchFormData}
            onChange={weatherFormSearchOnChangeHandler}
            onSubmit={fetchCity} // OR Auto complete and fetchWeather?
          />
        </div>

        <div className="flex flex-col items-center">
          <p>
            <span className="mr-6 relative">
              City: {fetchingWeather ? <Loader /> : ''}
            </span>
            <span className="mr-6 relative">
              {' '}
              State: {fetchingWeather ? <Loader /> : ''}
            </span>
            <span className="mr-6 relative">
              Country: {fetchingWeather ? <Loader /> : ''}
            </span>
          </p>
          <p>
            <span className="mr-6 relative">
              Temperature Now:{' '}
              {fetchingWeather ? (
                <Loader />
              ) : weather?.temperature ? (
                `${weather.temperature} °F`
              ) : null}
            </span>
            <span className="mr-6 relative">
              Condition:{' '}
              {fetchingWeather ? (
                <Loader />
              ) : weather?.condition ? (
                weather.condition
              ) : null}
            </span>
          </p>
          <p>
            <span className="mr-6 relative">
              Humidity:{' '}
              {fetchingWeather ? (
                <Loader />
              ) : weather?.humidity ? (
                `${weather.humidity} %`
              ) : null}
            </span>
            <span className="mr-6 relative">
              Wind:{' '}
              {fetchingWeather ? (
                <Loader />
              ) : weather?.wind ? (
                `${weather.wind} mph`
              ) : null}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
