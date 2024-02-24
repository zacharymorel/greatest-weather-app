// Node modules.
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// OpenWeatherMap API configuration.
const API_URL = "http://api.openweathermap.org/data/2.5/weather";
const API_KEY = "YOUR_API_KEY_HERE"; // Replace this with your OpenWeatherMap API key.

// GET handler
async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Extract query parameters for city and units (optional).
    const { city = "St Petersburg", units = "metric" } = req.query;

    // Make a request to the OpenWeatherMap API.
    const { data } = await axios.get(API_URL, {
      params: {
        q: city,
        units,
        appid: API_KEY,
      },
    });

    // Return the relevant data.
    res.status(200).json({
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      wind: data.wind.speed,
    });
  } catch (error) {
    // Handle errors, such as city not found or API issues.
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ message: error.response.data });
    } else {
      res.status(500).json({ message: "Internal server error" });
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
    case "GET":
      return handleGET(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
