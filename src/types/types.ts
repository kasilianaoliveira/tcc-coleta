export interface IBGEUFResponse {
  sigla: string;
}

export interface IBGECityResponse {
  nome: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Neighborhood {
  id: number;
  name: string;
  coordinates: Coordinates;
  frequency: string;
}