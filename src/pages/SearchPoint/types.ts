interface Neighborhood {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  street?: string;
  daysOfWeek: string[];
  pointId: string;
}

interface Item {
  title: string;
}

export interface PointItem {
  item: Item;
}

export interface Point {
  id: string;
  name: string;
  image: string;
  email: string;
  whatsapp: string;
  city: string;
  uf: string;
  neighborhoods: Neighborhood[];
  pointItems: PointItem[];
  userId:string;
}
