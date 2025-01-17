/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js';

/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    // this is OK because we're doing type checking in a separate step of CI
    ignoreBuildErrors: true,
  },
  images: {
    dangerouslyAllowSVG: true,
      remotePatterns: [
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com",
          port: "",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "placehold.co",
          port: "",
          pathname: "/**",
        },
      ],
    },
    redirects: async () => {
      return [
        {
          source: "/:organizationHashid",
          destination: "/:organizationHashid/templates",
          permanent: true,
        },
      ];
    },
};

export default config;
