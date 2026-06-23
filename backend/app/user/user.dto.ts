export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  address: string;
  role: "ADMIN" | "NORMAL_USER" | "STORE_OWNER";
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  address: string;
  role?: "ADMIN" | "NORMAL_USER" | "STORE_OWNER";
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserResponse extends Omit<IUser, "passwordHash"> {}

export interface ITokenPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
}