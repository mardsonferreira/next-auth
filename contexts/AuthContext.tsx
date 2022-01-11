import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useRouter } from "next/router";
import { setCookie, parseCookies } from "nookies";

import { api } from "../src/services/api";

type User = {
    email: string;
    permissions: string[];
    roles: string[];
};

type SignInCredentials = {
    email: string;
    password: string;
};

type AuthContextData = {
    signIn(credentials: SignInCredentials): Promise<void>;
    user: User;
    isAuthenticated: boolean;
};

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext<AuthContextData>(
    {} as AuthContextData
);

export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();
    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;

    useEffect(() => {
        const { "@next-auth.token": token } = parseCookies();

        if (token) {
            api.get("/me").then((response) => {
                const { email, permissions, roles } = response.data;

                setUser({
                    email,
                    permissions,
                    roles,
                });
            });
        }
    }, []);

    async function signIn({ email, password }: SignInCredentials) {
        try {
            const response = await api.post("sessions", {
                email,
                password,
            });

            const { token, refreshToken, permissions, roles } = response.data;

            setUser({
                email,
                permissions,
                roles,
            });

            setCookie(undefined, "@next-auth.token", token, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/",
            });

            setCookie(undefined, "@next-auth.refreshToken", refreshToken, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/",
            });

            api.defaults.headers["Authorization"] = `Bearer ${token}`;

            router.push("/dashboard");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <AuthContext.Provider value={{ signIn, user, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);

    return context;
}
