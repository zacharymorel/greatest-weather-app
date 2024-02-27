// Node modules.
import { useEffect, useState } from 'react';

// Relative modules.
import Loader from '@/components/common/Loader';
import Form from '@/components/common/Form';
import {
  IFormSchema,
  IGooglePlacesPrediction,
  IGooglePlacesPredictions,
  IWeather,
} from '@/types/client';

// TODO: Store history of places selected and searched in Context global?
// TODO: Autocomplete will need styling... Is that another type for the form?? A special case or do I create a separate div to show city results??

const formSchema: IFormSchema[] = [
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

function derivePredictionsDropdown(
  list: IGooglePlacesPredictions | [],
  selectPrediction: Function
) {
  if (!list) return null;

  return (
    list?.map((p) => (
      <li
        key={p.placeId}
        className="text-white border-solid bg-dark-3 border-dark-4 p-1"
        data-place-id={p.placeId}
        data-place-des={p.description}
        onClick={(e: React.MouseEvent<HTMLLIElement>) => {
          const ev = e.target as HTMLElement;
          selectPrediction({
            placeId: ev.getAttribute('data-place-id'),
            description: ev.getAttribute('data-place-des'),
          });
        }}
      >
        {p.description}
      </li>
    )) || null
  );
}

function HomePage() {
  const [weather, setWeather] = useState<IWeather | null>(null);
  const [fetchingWeather, setFetchingWeather] = useState<boolean>(false);

  const [weatherSearchFormData, setWeatherSearchFormData] = useState({
    city: '',
  });

  const [predictions, setPredictions] = useState<IGooglePlacesPredictions | []>(
    []
  );

  const [predictionsPrompt, setPredictionsPrompt] = useState<boolean>(false);

  async function weatherFormSearchOnChangeHandler(newWeatherState: any) {
    setWeatherSearchFormData(
      Object.assign({}, weatherSearchFormData, newWeatherState)
    );

    console.log('newWeatherState:: ', newWeatherState);

    if (newWeatherState.city?.length > 2) {
      try {
        const res = await fetch(
          `/api/weather/city?city=${newWeatherState.city}`
        );
        const googlePredictions = await res.json();
        setPredictions(googlePredictions.predictions);
        setPredictionsPrompt(true);
      } catch (error) {
        console.error('Error fetching places autocomplete:', error);
      }
    }
    return;
  }

  async function getCityGeo(p: IGooglePlacesPrediction) {
    try {
      const res = await fetch(`/api/weather/city/geo/${p.placeId}`);
      const googlePlace = await res.json();
      console.log('googlePlace: ', googlePlace);
    } catch (error) {
      console.error('Error fetching place geo:', error);
    }
  }

  function fetchCityWeather() {}

  async function fetchWeather() {
    setFetchingWeather(true);

    try {
      const response = await fetch('/api/weather');
      const data = await response.json();
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
        <section>
          <h1 className="text-4xl font-bold text-center">
            Find Your Current Weather.
          </h1>
        </section>
        <section className="flex flex-col items-center">
          <div>
            <Form
              schema={formSchema}
              formData={weatherSearchFormData}
              onChange={weatherFormSearchOnChangeHandler}
              onSubmit={fetchCityWeather} // OR Auto complete and fetchWeather?
            />
            <ul className="flex flex-col float-start last:border last:border-solid last:border-dark-4 :last rounded-b ">
              {predictionsPrompt &&
                derivePredictionsDropdown(
                  predictions,
                  (p: IGooglePlacesPrediction) => {
                    getCityGeo(p);
                  }
                )}
            </ul>
          </div>
        </section>
        <section className="flex flex-col items-center">
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
        </section>
      </main>
    </div>
  );
}

export default HomePage;
