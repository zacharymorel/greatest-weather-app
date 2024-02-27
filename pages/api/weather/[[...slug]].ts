// Node modules.
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Relative imports
import { IWeatherDTO, ICityDTO, ICityGeoTO } from '@/types/api/weather';

// OpenWeatherMap API configuration.
const API_WEATHER_URL = 'https://api.openweathermap.org/data/3.0/onecall';
const API_GOOGLE_PLACES_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const API_GOOGLE_PLACE_DETAILS_URL =
  'https://maps.googleapis.com/maps/api/place/details/json';
const API_GOOGLE_PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY;
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;

function commonInternalServerErrorHandler(
  error: any,
  res: NextApiResponse,
  internalConsoleMessage: string
): void {
  if (axios.isAxiosError(error) && error.response) {
    return res
      .status(error.response.status)
      .json({ message: error.response.data });
  } else {
    console.log(internalConsoleMessage, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getWeather(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    // Extract query parameters for city and units (optional).
    const { units = 'imperial' } = req.query;

    // Make a request to the OpenWeatherMap API.
    const { data } = await axios.get(API_WEATHER_URL, {
      params: {
        lat: '42.7095794',
        lon: '-77.0564464',
        units,
        appid: OPEN_WEATHER_API_KEY,
      },
    });

    const weather: IWeatherDTO = {
      temperature: data.current.temp,
      condition: data.current.weather[0].main,
      humidity: data.current.humidity,
      wind: data.current.wind_speed,
    };

    return res.status(200).json(weather);
  } catch (error) {
    // Handle errors, such as city not found or API issues.
    commonInternalServerErrorHandler(error, res, 'api/weather error: ');
  }
}

async function getCity(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { city = 'london' } = req.query;

    const { data } = await axios.get(API_GOOGLE_PLACES_URL, {
      params: {
        input: city,
        types: 'geocode',
        key: API_GOOGLE_PLACES_KEY,
      },
    });

    const cityList: ICityDTO = {
      predictions: data.predictions?.map(
        (c: google.maps.places.AutocompletePrediction) => ({
          description: c.description,
          placeId: c.place_id,
        })
      ),
    };

    return res.status(200).json(cityList);
  } catch (error) {
    // Handle errors, such as city list not found or API issues.
    commonInternalServerErrorHandler(error, res, 'api/weather/city error: ');
  }
}

async function getCityGeo(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const placeId: string | undefined = req.query.slug?.[2];
    if (!placeId) return res.status(400).json({ message: 'missing place id' });

    const { data } = await axios.get(API_GOOGLE_PLACE_DETAILS_URL, {
      params: {
        place_id: placeId,
        key: API_GOOGLE_PLACES_KEY,
      },
    });

    const cityGEO: ICityGeoTO = {
      lat: data?.result?.geometry.lat,
      lng: data?.result?.geometry.lng,
    };

    return res.status(200).json(cityGEO);
  } catch (error) {
    // Handle errors, such as city geo not found or API issues.
    commonInternalServerErrorHandler(
      error,
      res,
      'api/weather/city/geo/placeId error:'
    );
  }
}

// Handler for the API endpoints.
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  console.log('query: ', query);
  switch (method) {
    case 'GET':
      if (query.slug?.includes('city') && query.slug?.includes('geo'))
        return getCityGeo(req, res);

      if (query.slug?.includes('city')) return getCity(req, res);

      return getWeather(req, res);
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
