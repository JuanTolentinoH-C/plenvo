import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Módulos con bindings nativos o require() dinámico que no se deben bundlear.
  // `chartjs-node-canvas` → requiere `canvas` en runtime (binding nativo) y
  // usa `freshRequire` internamente. Forzamos que se resuelva en Node.
  serverExternalPackages: ["chartjs-node-canvas", "canvas", "chart.js"],
};

export default nextConfig;
