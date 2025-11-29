
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HouseMateProvider } from "./state/houseMateContext";

createRoot(document.getElementById("root")!).render(
  <HouseMateProvider>
    <App />
  </HouseMateProvider>,
);
  