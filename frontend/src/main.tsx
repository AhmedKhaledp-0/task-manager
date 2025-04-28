import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./config/queryClient.ts";
import { HelmetProvider } from "react-helmet-async";
import { ToastProvider } from "./components/UI/Toast.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <HelmetProvider>
          <ToastProvider>
            <Provider store={store}>
              {/* <SEO /> */}
              <App />
            </Provider>
          </ToastProvider>
        </HelmetProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
