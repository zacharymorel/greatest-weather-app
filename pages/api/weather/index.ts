// Node modules.
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// OpenWeatherMap API configuration.
const API_URL = 'https://api.openweathermap.org/data/3.0/onecall';
const API_KEY = process.env.OPEN_WEATHER_MAP; // Replace this with your OpenWeatherMap API key.

// GET handler
async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Extract query parameters for city and units (optional).
    const { units = 'imperial' } = req.query;

    // Make a request to the OpenWeatherMap API.
    const { data } = await axios.get(API_URL, {
      params: {
        lat: '42.7095794',
        lon: '-77.0564464',
        units,
        appid: API_KEY,
      },
    });
    console.log(data.current);
    res.status(200).json({
      // city: data.name,
      // country: data.sys.country,
      temperature: data.current.temp,
      condition: data.current.weather[0].main,
      humidity: data.current.humidity,
      wind: data.current.wind_speed,
    });
  } catch (error) {
    // Handle errors, such as city not found or API issues.
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ message: error.response.data });
    } else {
      console.log('api/weather error: ', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

// Handler for the API endpoints.
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case 'GET':
      return handleGET(req, res);
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
