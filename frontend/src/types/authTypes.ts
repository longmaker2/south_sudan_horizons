export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string;
}

export type LoginProps = object;

export type RegisterProps = object;

export interface AuthState {
  showPassword: boolean;
  error: string;
  isLoading: boolean;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends UserCredentials {
  fullName: string;
  confirmPassword: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}
