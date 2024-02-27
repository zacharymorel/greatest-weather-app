// Node modules.
import { useEffect, useState } from 'react';

// Relative modules.
import { useSearchStore } from '@/stores/weatherSearch';
import Loader from '@/components/common/Loader';
import Form from '@/components/common/Form';
import {
  IFormSchema,
  IGooglePlacesPrediction,
  IGooglePlacesPredictions,
  IWeather,
} from '@/types/client';

function formSchema(shouldDisableSubmit: boolean = false): IFormSchema[] {
  return [
    {
      inputType: 'text',
      label: 'Search for a City',
      name: 'city',
      placeHolder: 'City...',
    },
    {
      inputType: 'submit',
      name: 'submit',
      disabled: shouldDisableSubmit,
      feedback: '*Select a city.',
      buttonValue: 'Get Weather!',
    },
  ];
}

function derivePredictionsDropdown(
  list: IGooglePlacesPredictions | [],
  selectPrediction: Function
) {
  if (!list) return null;

  return (
    list?.map((p) => (
      <li
        key={p.placeId}
        className="cursor-pointer text-white border-solid bg-dark-3 border-dark-4 p-1 hover:bg-dark-4"
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

// Main Component
function HomePage() {
  // Current weather state
  const [weather, setWeather] = useState<IWeather | null>(null);

  // A loading state weather data
  const [fetchingWeather, setFetchingWeather] = useState<boolean>(false);

  // Form data for controlled form elements
  const [weatherSearchFormData, setWeatherSearchFormData] = useState<{
    city: string;
  }>({
    city: '',
  });

  // Predictions city list
  const [predictions, setPredictions] = useState<IGooglePlacesPredictions>([]);

  // globalState historical searches
  const { historicalSearches, add } = useSearchStore() || [];

  // Predictions city list show
  const [predictionsPrompt, setPredictionsPrompt] = useState<boolean>(false);

  // stores geo for selected city
  const [selectedCityGeo, setSelectedCityGeo] = useState<{
    lat: number;
    lng: number;
  }>();

  // handle submit disabled
  const [submitDisable, setSubmitDisable] = useState<boolean>(false);

  async function getCityPredictions(newWeatherState: any) {
    setWeatherSearchFormData(
      Object.assign({}, weatherSearchFormData, newWeatherState)
    );
    let predictionsList: IGooglePlacesPredictions = [];
    predictionsList = predictionsList.concat(historicalSearches);

    try {
      if (newWeatherState.city?.length > 2) {
        const res = await fetch(
          `/api/weather/city?city=${newWeatherState.city}`
        );
        const googlePredictions = await res.json();
        predictionsList = predictionsList.concat(googlePredictions.predictions);
        setPredictionsPrompt(true);
      }

      setPredictions(predictionsList);
    } catch (error) {
      console.error('Error fetching places autocomplete:', error);
    } finally {
      setSubmitDisable(true);
    }
  }

  async function getCityGeo(p: IGooglePlacesPrediction) {
    try {
      const matchingPlace = predictions.find(
        (details) => details.placeId === p.placeId
      );

      const res = await fetch(`/api/weather/city/geo/${p.placeId}`);
      const googlePlaceGeo = await res.json();
      if (googlePlaceGeo.lat && googlePlaceGeo.lng) {
        setSelectedCityGeo(googlePlaceGeo);
        setWeatherSearchFormData({ city: matchingPlace?.description ?? '' });
        setSubmitDisable(false);
      }
    } catch (error) {
      console.error('Error fetching place geo:', error);
    }
  }

  async function fetchCityWeather() {
    try {
      setPredictionsPrompt(false);
      setFetchingWeather(true);
      const [city, state, country] = weatherSearchFormData?.city.split(',');
      const cityState: {
        city?: string;
        state?: string;
        country?: string;
      } = {};
      if (city) cityState.city = city;
      if (state) cityState.state = state;
      if (country) cityState.country = country;

      const res = await fetch(
        `/api/weather?lat=${selectedCityGeo?.lat}&lng=${selectedCityGeo?.lng}`
      );
      const weatherData = await res.json();
      const newWeatherState = Object.assign({}, cityState, weatherData);

      setWeather(newWeatherState);

      // Global history set state
      const matchingPlace = predictions.find(
        (dets) => dets.description === weatherSearchFormData.city
      );
      if (matchingPlace) add(matchingPlace);
    } catch (error) {
      console.error('Error fetching place weather:', error);
    } finally {
      setFetchingWeather(false);
    }
  }

  async function fetchWeather() {
    setFetchingWeather(true);

    try {
      const response = await fetch('/api/weather');
      const weatherData = await response.json();

      const [city, state, country] = weatherSearchFormData?.city.split(',');

      const cityState: {
        city?: string;
        state?: string;
        country?: string;
      } = {};
      if (city) cityState.city = city;
      if (state) cityState.state = state;
      if (country) cityState.country = country;

      setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setFetchingWeather(false);
    }
  }

  useEffect(() => {
    if (weatherSearchFormData.city.length < 2 && submitDisable) {
      setSubmitDisable(false);
    }
  }, [
    submitDisable,
    weatherSearchFormData.city,
    weatherSearchFormData.city.length,
  ]);

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
              schema={formSchema(submitDisable)}
              formData={weatherSearchFormData}
              onChange={getCityPredictions}
              onSubmit={fetchCityWeather}
            />
            <ul className="flex flex-col float-start border border-t-0 border-solid border-dark-4 rounded-b">
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
              City: {fetchingWeather ? <Loader /> : weather?.city}
            </span>
            <span className="mr-6 relative">
              {' '}
              State: {fetchingWeather ? <Loader /> : weather?.state}
            </span>
            <span className="mr-6 relative">
              Country: {fetchingWeather ? <Loader /> : weather?.country}
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
