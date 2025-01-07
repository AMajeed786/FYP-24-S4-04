export enum Role {
  Admin = 'admin',
  User = 'user',


}

export interface User {
    username: string;
    email: string;
    password: string;
    contact: string;
    role : Role;
   
  }