import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {jwtDecode} from "jwt-decode";
import type { SignInRes } from "@/interface/SignIn.interface";

interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

// Struktur info user dari respons login
interface PetugasInfo {
  petugasId: number;
  petugasUsername: string;
  petugasRoles: string[];
}

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  petugas: PetugasInfo | null;
  isAuthenticated: boolean;
  login: (authData: SignInRes) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("accessToken"));
    const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem("refreshToken"));
    
    const [petugas, setPetugas] = useState<PetugasInfo | null>(() => {
        const stored = localStorage.getItem("petugas_data");
        return stored ? JSON.parse(stored) : null;
    });

    // Fungsi logout
    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("petugas_data");
        setToken(null);
        setRefreshToken(null);
        setPetugas(null);
    };

    // Cek token expired dan logout otomatis
    useEffect(() => {
        if (token) {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            const isExpired = decoded.exp * 1000 < Date.now();
            if (isExpired) {
            logout();
            }
        } catch (e) {
            console.error("Invalid token", e);
            logout();
        }
        }
    }, [token]);

    // Sinkronisasi localStorage dengan state jika terjadi perubahan di luar React (optional)
    useEffect(() => {
            function syncStorage() {
              const localToken = localStorage.getItem("accessToken");
              const localRefresh = localStorage.getItem("refreshToken");
              const localUser = localStorage.getItem("petugas_data");
              if (localToken !== token) setToken(localToken);
              if (localRefresh !== refreshToken) setRefreshToken(localRefresh);
              if (localUser !== JSON.stringify(petugas)) setPetugas(localUser ? JSON.parse(localUser) : null);
            }
            window.addEventListener("storage", syncStorage);
            return () => window.removeEventListener("storage", syncStorage);
    }, [token, refreshToken, petugas]);

    const login = (authData: SignInRes) => {
            const { token, refreshToken, petugasId, petugasUsername, petugasRoles } = authData;

            const userInfo: PetugasInfo = {
            petugasId,
            petugasUsername,
            petugasRoles,
            };

            localStorage.setItem("accessToken", token);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("petugas_data", JSON.stringify(userInfo));

            setToken(token);
            setRefreshToken(refreshToken);
            setPetugas(userInfo);
    };

    const isAuthenticated = !!token && !!petugas;

    return (
        <AuthContext.Provider
        value={{ token, refreshToken, petugas, isAuthenticated, login, logout }}
        >
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