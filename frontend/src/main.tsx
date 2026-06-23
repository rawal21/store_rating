import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/store";
import { logout } from "@/store/auth.slice";
import App from "./App";
import "./index.css";

// Global listener: Axios interceptor dispatches this when refresh fails
window.addEventListener("auth:logout", () => {
  store.dispatch(logout());
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
