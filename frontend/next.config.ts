import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Altre opzioni qui */
  experimental: {
    // Risolve i problemi di "Blocked cross-origin request" che possono rallentare il browser
    allowedDevOrigins: ["localhost", "127.0.0.1", "100.108.208.33"],
  },
};

export default nextConfig;
