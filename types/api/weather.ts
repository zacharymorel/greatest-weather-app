export interface IWeatherDTO {
  temperature: string;
  condition: string;
  humidity: string;
  wind: string;
}

export interface ICityDTO {
  predictions: [{ description: string; placeId: string }];
}

export interface ICityGeoTO {
  lat: number;
  lng: number;
}
