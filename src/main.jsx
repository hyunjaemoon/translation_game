import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ContextProvider from "./context/Context.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="382397877183-r5qom2aa4s7h33p5gbi3qfl3lq6qoo86.apps.googleusercontent.com">
  <ContextProvider>
    <App />
  </ContextProvider>
  </GoogleOAuthProvider>
);
