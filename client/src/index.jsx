import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import store from "./store";
import "./index.css";
import { ThemeProvider } from "./Context/ThemeContext";

const appTree = (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <HelmetProvider>
          {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              {appTree}
            </GoogleOAuthProvider>
          ) : (
            appTree
          )}
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
