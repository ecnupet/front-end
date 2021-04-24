import reactRefresh from "@vitejs/plugin-react-refresh";
import { ConfigEnv, UserConfig } from "vite";
import { join } from "path";

const srcRoot = join(__dirname, "src");

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ command }: ConfigEnv): UserConfig => {
  const commonConfig: UserConfig = {
    plugins: [reactRefresh()],
    build: {
      outDir: join(srcRoot, "/out"),
      emptyOutDir: true,
      rollupOptions: {},
    },
    server: {
      port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
    },
    optimizeDeps: {
      exclude: ["path"],
    },
  };

  // DEV
  if (command === "serve") {
    return {
      base: "/",
      ...commonConfig,
    };
  }
  // PROD
  else {
    return {
      base: `./`,
      ...commonConfig,
    };
  }
};
