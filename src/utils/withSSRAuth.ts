import {
    GetServerSideProps,
    GetServerSidePropsContext,
    GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/erros/AuthTokenError";

export function withSSRAuth<T>(fn: GetServerSideProps<T>): GetServerSideProps {
    return async (
        ctx: GetServerSidePropsContext
    ): Promise<GetServerSidePropsResult<T>> => {
        const cookies = parseCookies(ctx);

        if (!cookies["@next-auth.token"]) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
            };
        }

        try {
            return await fn(ctx);
        } catch (err) {
            if (err instanceof AuthTokenError) {
                destroyCookie(ctx, "@next-auth.token");
                destroyCookie(ctx, "@next-auth.refreshToken");
    
                return {
                    redirect: {
                        destination: "/",
                        permanent: false,
                    },
                };
            }
        }
    };
}