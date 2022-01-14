import { GetServerSideProps } from "next";
import { FormEvent, useState } from "react";

import { useAuthContext } from "../../contexts/AuthContext";
import { withSSRGuest } from "../utils/withSSRGuest";

import styles from "./index.module.css";

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
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.content}>
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
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = withSSRGuest(
    async (ctx) => {
        return {
            props: {},
        };
    }
);
