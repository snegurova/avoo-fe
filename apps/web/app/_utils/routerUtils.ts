import { Route } from "next";
import { AppRoutes } from "@/_routes/routes";

export const routerUtils = {
    isValidRoute: (path: string | null): path is AppRoutes => {
        if (!path) return false;
        const pathWithoutLocale = path.replace(/^\/[a-z]{2}(\/|$)/, '/');
        const validRoutes = new Set<string>(Object.values(AppRoutes));
        return validRoutes.has(pathWithoutLocale) || validRoutes.has(path);
    },

    toRoute: (path: string): Route => path as Route,
};