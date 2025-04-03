import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf}",
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/task-managerdepi\.vercel\.app\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: "ToTasky",
        short_name: "ToTasky",
        description: "A task management application",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "https://task-managerdepi.vercel.app",
        dir: "ltr",
        scope: "/",
        display_override: ["standalone", "window-controls-overlay"],
        lang: "en",
        orientation: "natural",
        categories: ["productivity"],
        shortcuts: [
          {
            name: "Dashboard",
            short_name: "Dashboard",
            url: "https://task-managerdepi.vercel.app/",
            description: "View your dashboard",
          },
          {
            name: "Projects",
            short_name: "Projects",
            url: "https://task-managerdepi.vercel.app/projects",
            description: "View your projects",
          },
          {
            name: "Tasks",
            short_name: "Tasks",
            url: "https://task-managerdepi.vercel.app/tasks",
            description: "View your tasks",
          },
          {
            name: "Reports",
            short_name: "Reports",
            url: "https://task-managerdepi.vercel.app/reports",
            description: "View your reports",
          },
        ],
        screenshots: [
          // {
          //   src: "/screenshots/screen-1-1440x900.png",
          //   sizes: "1440x900",
          //   type: "image/png",
          //   label: "ToTasky Dark View",
          // },
          // {
          //   src: "/screenshots/screen-2-1440x900.png",
          //   sizes: "1440x900",
          //   type: "image/png",
          //   label: "ToTasky Light View",
          // },
          // {
          //   src: "/screenshots/screen-3-1440x900.png",
          //   sizes: "1440x900",
          //   type: "image/png",
          //   label: "ToTasky Project Details View",
          // },
          // {
          //   src: "/screenshots/screen-4-1440x900.png",
          //   sizes: "1440x900",
          //   type: "image/png",
          //   label: "ToTasky Report View",
          // },
          {
            src: "/screenshots/screen-1-414x896.png",
            sizes: "414x896",
            type: "image/png",
            label: "ToTasky Dark Mobile View",
          },
          {
            src: "/screenshots/screen-2-414x896.png",
            sizes: "414x896",
            type: "image/png",
            label: "ToTasky Light Mobile View",
          },
          {
            src: "/screenshots/screen-3-414x896.png",
            sizes: "414x896",
            type: "image/png",
            label: "ToTasky Project Details Mobile View",
          },
          {
            src: "/screenshots/screen-4-414x896.png",
            sizes: "414x896",
            type: "image/png",
            label: "ToTasky Report Mobile View",
          },
        ],
        icons: [
          {
            src: "/pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
