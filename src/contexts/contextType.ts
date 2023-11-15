// import { Point } from "../types/types";

import { Point } from "../types/types";

// export interface PointContextData {
//   name: string;
//   image: string | null;
//   email: string | null;
//   whatsapp: string;
//   latitude: number;
//   longitude: number;
//   city: string;
//   uf: string;
//   pointItems: PointItems[];
//   neighborhoods: Neighborhood[];
//   userId: string;

// }

// interface Neighborhood {
//   name: string;
//   frequency?: string | null;
//   latitude: number;
//   longitude: number;
//   daysOfWeek: string;
//   pointId: string;
// }

// export interface PointItems {
//   point_id: string;
//   item_id: string;
// }

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
  point: Point | null;
  loading: boolean;
  pointList: Point | null;
  pointNotFound: boolean;
  createPoint: (data: Point) => Promise<void>;
  getPoint(id: string): Promise<void>;

}