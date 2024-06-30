import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { PoopStoreContextProvider } from "./store/PoopStoreProvider.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PoopStoreContextProvider>
      <App />
    </PoopStoreContextProvider>
  </React.StrictMode>,
);
