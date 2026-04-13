import type { NextConfig } from "next";
const config: NextConfig = {
    experimental: {
        middlewareClientMaxBodySize: "50mb",
    },
};
export default config;
