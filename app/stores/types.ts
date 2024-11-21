import { IMap } from "./works";

export  interface ISigupForm {
  username: string;
  email: string;
  password: string;
  retryPassword: string;
}
export interface ISiginForm {
  username: string;
  password: string;
}
export interface IFolder {
  id: number;
  name: string;
  parentId: number;
}
