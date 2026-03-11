export interface User {
  _id?: string;
  name?: string;
  email: string;
  age?: number;
  role?: 'user' | 'admin';
  token?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface SignupCredentials {
  name: string;
  age: number;
  email: string;
  password: string;
}

export interface SignupResponse {
  status: boolean;
  data: User;
  message?: string;
}

export interface ApiError {
  status: boolean;
  message: string;
  error?: any;
}