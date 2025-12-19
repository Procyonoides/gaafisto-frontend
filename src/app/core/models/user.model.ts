export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: 'Laki-laki' | 'Perempuan';
  role: 'admin' | 'seller' | 'user';
  createdAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: 'Laki-laki' | 'Perempuan';
}