export interface IBGEUFResponse {
  sigla: string;
  nome:string;
}

export interface IBGECityResponse {
  nome: string;
}


export interface PointOfCollection {
  name: string;
  image?: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
  userId?: string;
  items?: string[];
  neighborhoods?: Neighborhood[];
}



interface Item {
  title: string;
}

export interface PointItem {
  item: Item;
}
export interface Neighborhood {
  name: string;
  latitude: number;
  longitude: number;
  daysOfWeek: string[];
}
export interface Point {
  id:string;
  name: string;
  image: string;
  email: string;
  whatsapp: string;
  city: string;
  uf: string;
  userId:string;
  neighborhoods: Neighborhood[];
  items: string[];
}


export interface NeighborhoodsLocation {
  latWithOffset: number;
  lngWithOffset: number;
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  daysOfWeek: string[];
  pointId: string;
}