export interface IBGEUFResponse {
  sigla: string;
  nome:string;
}

export interface IBGECityResponse {
  nome: string;
}

export interface Item {
  id: string;
  title: string;
  image: string;
}
export interface NeighborhoodResponse {
  id:string;
  name: string;
  latitude: number;
  longitude: number;
  street?: string;
  daysOfWeek: string[];
}

export interface Neighborhood {
  name: string;
  latitude: number;
  longitude: number;
  street?: string;
  daysOfWeek: string[];
}
interface PointItem {
  item: {
    id: string;
    image_url: string;
    title: string;
  };
}
export interface IPoint {
  id:string;
  name: string;
  image: string;
  email: string;
  whatsapp: string;
  city: string;
  uf: string;
  userId:string;
  neighborhoods: Neighborhood[];
  pointItems: PointItem[]
}
