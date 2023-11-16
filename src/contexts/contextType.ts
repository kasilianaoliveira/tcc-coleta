import { IPoint } from "../types/types";


export interface Item {
  id: string;
  title: string;
  image: string;
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
  pointItems: Item[];
}


export interface UserContextData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUser {
  id:string;
  name: string;
  email: string;
  password?: string;
}
export interface UpdatePoint {
  id: string;
  name: string;
  email: string;
  uf: string;
  city: string;
  image:string;
  whatsapp: string;
}


//login
export interface AuthContextData {
  user: UserProps | null ;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  logout(): Promise<void>;
  cookieUser: (data: UserProps) => void;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
  deleteUser(id: string): Promise<void>;
  updateUser({ id, name, email }: UpdateUser): Promise<void>

}

export interface UserProps{
  id: string;
  name: string;
  email: string;
  role: string;
  token:string;
}

export interface SignInProps {
  email: string;
  password: string;
}

export interface PointContextData {
  loading: boolean;
  pointList: IPoint | null;
  pointNotFound: boolean;
  createPoint(data: FormData): Promise<void>;
  deletePoint(id: string): Promise<void>;
  getPoint(id: string): Promise<void>;
  updatePoint(data: FormData, id: string): Promise<void>;

}