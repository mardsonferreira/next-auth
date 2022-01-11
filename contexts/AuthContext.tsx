import { createContext, ReactNode, useContext } from "react";
import { api } from "../src/services/api";

type SignInCredentials = {
    email: string;
    password: string;
};

type AuthContextData = {
    signIn(credentials: SignInCredentials): Promise<void>;
    isAuthenticated: boolean;
};

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext<AuthContextData>(
    {} as AuthContextData
);

export function AuthProvider({ children }: AuthProviderProps) {
    const isAuthenticated = false;

    async function signIn({ email, password }: SignInCredentials) {
        try {
            const response = await api.post("sessions", {
                email,
                password,
            });
            console.log(response.data);
        } catch(err) {
            console.log(err);
        }
    }


    return (
        <AuthContext.Provider value={{ signIn, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);

    return context;
}
