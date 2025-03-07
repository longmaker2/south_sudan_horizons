import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../types/authTypes";
import { API_BASE_URL } from "../utils/api";

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Invalid or expired token");
          }

          const data = await response.json();
          const restoredUser: User = {
            id: data.id,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
          };
          setUser(restoredUser);
          localStorage.setItem("user", JSON.stringify(restoredUser));
        } catch (error) {
          console.error("Failed to restore session:", error);
          // Clear invalid token and log out
          logout();
        }
      }
    };

    restoreSession();
  }, []);

  const login = (userData: User) => {
    console.log("Setting User Data in AuthContext:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
