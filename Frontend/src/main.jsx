import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthProvider.jsx";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
