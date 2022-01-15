import {
    GetServerSideProps,
    GetServerSidePropsContext,
    GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";
import decode from "jwt-decode";

import { AuthTokenError } from "../services/erros/AuthTokenError";
import { validateUserPermissions } from "./validateUserPermissions";

type WithSSRAuthOptions = {
    permissions?: string[];
    roles?: string[];
};

export function withSSRAuth<T>(
    fn: GetServerSideProps<T>,
    options?: WithSSRAuthOptions
): GetServerSideProps {
    return async (
        ctx: GetServerSidePropsContext
    ): Promise<GetServerSidePropsResult<T>> => {
        const cookies = parseCookies(ctx);
        const token = cookies["@next-auth.token"];

        if (!token) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
            };
        }

        if (options) {
            const user =
                decode<{ permissions: string[]; roles: string[] }>(token);
            const { permissions, roles } = options;

            const userHasValidPermissions = validateUserPermissions({
                user,
                permissions,
                roles,
            });

            if (!userHasValidPermissions) {
                return {
                    redirect: {
                        destination: "/dashboard",
                        permanent: false,
                    },
                };
            }
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
