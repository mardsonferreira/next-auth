import { FormEvent, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";

export default function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { signIn, isAuthenticated } = useAuthContext();

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const data = {
            email,
            password,
        };

        await signIn(data);
    }

    return (
        <form onClick={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Entrar</button>
        </form>
    );
}