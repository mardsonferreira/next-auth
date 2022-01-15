import { GetServerSideProps } from "next";
import { useEffect } from "react";
import { withSSRAuth } from "../utils/withSSRAuth";

import { useAuthContext } from "../../contexts/AuthContext";
import { api } from "../services/apiClient";
import { setupAPIClient } from "../services/api";
import { useCan } from "../hooks/useCan";
import { Can } from "../components/Can";

export default function Dashboard() {
    const { user } = useAuthContext();

    useEffect(() => {
        api.get("/me")
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
    }, []);
    return (
        <>
            <h1>Dashboard {user?.email}</h1>
            <Can permissions={["metrics.list"]}>
                <div> Métricas</div>
            </Can>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
    async (ctx) => {
        const apiClient = setupAPIClient(ctx);

        const response = await apiClient.get("/me");
        console.log(response.data);

        return {
            props: {},
        };
    }
);
