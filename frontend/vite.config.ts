import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

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
        id: "/", // Specify App ID
        name: "ToTasky",
        short_name: "ToTasky",
        description: "A task management application",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: `${process.env.VITE_BASE_URL || "/"}`,
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
            url: `${process.env.VITE_BASE_URL || ""}/`,
            description: "View your dashboard",
            icons: [
              {
                src: `${process.env.VITE_BASE_URL || ""}/dashboard.png`,
                sizes: "96x96",
                type: "image/png",
              },
            ],
          },
          {
            name: "Projects",
            short_name: "Projects",
            url: `${process.env.VITE_BASE_URL || ""}/projects`,
            description: "View your projects",
            icons: [
              {
                src: `${process.env.VITE_BASE_URL || ""}/projects.png`,
                sizes: "96x96",
                type: "image/png",
              },
            ],
          },
          {
            name: "Tasks",
            short_name: "Tasks",
            url: `${process.env.VITE_BASE_URL || ""}/tasks`,
            description: "View your tasks",
            icons: [
              {
                src: `${process.env.VITE_BASE_URL || ""}/tasks.png`,
                sizes: "96x96",
                type: "image/png",
              },
            ],
          },
          {
            name: "Reports",
            short_name: "Reports",
            url: `${process.env.VITE_BASE_URL || ""}/reports`,
            description: "View your reports",
            icons: [
              {
                src: `${process.env.VITE_BASE_URL || ""}/reports.png`,
                sizes: "96x96",
                type: "image/png",
              },
            ],
          },
        ],
        screenshots: [
          {
            src: `${
              process.env.VITE_BASE_URL || ""
            }/screenshots/screen-1-1440x900.png`,
            sizes: "1440x900",
            type: "image/png",
            label: "ToTasky Dark View",
            form_factor: "wide",
            platform: "web",
          },
          {
            src: `${
              process.env.VITE_BASE_URL || ""
            }/screenshots/screen-2-1440x900.png`,
            sizes: "1440x900",
            type: "image/png",
            label: "ToTasky Light View",
            form_factor: "wide",
            platform: "web",
          },
          {
            src: `${
              process.env.VITE_BASE_URL || ""
            }/screenshots/screen-3-1440x900.png`,
            sizes: "1440x900",
            type: "image/png",
            label: "ToTasky Project Details View",
            form_factor: "wide",
            platform: "web",
          },
          {
            src: `${
              process.env.VITE_BASE_URL || ""
            }/screenshots/screen-4-1440x900.png`,
            sizes: "1440x900",
            type: "image/png",
            label: "ToTasky Report View",
            form_factor: "wide",
            platform: "web",
          },
          {
            src: `${
              process.env.VITE_BASE_URL || ""
            }/screenshots/screen-1-414x896.png`,
            sizes: "414x896",
            type: "image/png",
            label: "ToTasky Dark Mobile View",
          },
          {
            src: `${
              process.env.VITE_BASE_URL || ""
            }/screenshots/screen-2-414x896.png`,
            sizes: "414x896",
            type: "image/png",
            label: "ToTasky Light Mobile View",
            platform: "android ios",
          },
          {
            src: `${
              process.env.VITE_BASE_URL || ""
            }/screenshots/screen-3-414x896.png`,
            sizes: "414x896",
            type: "image/png",
            label: "ToTasky Project Details Mobile View",
            platform: "android ios",
          },
          {
            src: `${
              process.env.VITE_BASE_URL || ""
            }/screenshots/screen-4-414x896.png`,
            sizes: "414x896",
            type: "image/png",
            label: "ToTasky Report Mobile View",
            platform: "android ios",
          },
        ],
        icons: [
          {
            src: `${process.env.VITE_BASE_URL || ""}/pwa-64x64.png`,
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: `${process.env.VITE_BASE_URL || ""}/pwa-192x192.png`,
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: `${process.env.VITE_BASE_URL || ""}/pwa-512x512.png`,
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: `${process.env.VITE_BASE_URL || ""}/maskable-icon-512x512.png`,
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
