import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
  // Surface a clear warning for developers configuring Google OAuth
  console.warn(
    "[Google OAuth] Missing VITE_GOOGLE_CLIENT_ID in environment variables. Google login will not work until this is set."
  );
}

// Dev-only diagnostics: confirm origin and client ID match Google Console config
if (import.meta.env.DEV) {
  try {
    // Log the current origin and the client ID we pass to GIS
    console.log(
      "[Google OAuth] window.location.origin =",
      window.location.origin
    );
    console.log("[Google OAuth] clientId in use =", clientId);

    // Optional: warn if clientId differs from the expected Web client
    const expectedWebClientId =
      "57927002405-l0k6e495e33bqlg400v6cc0n7i1afblo.apps.googleusercontent.com";
    if (clientId && clientId !== expectedWebClientId) {
      console.warn(
        "[Google OAuth] Client ID mismatch with Google Console Web client.",
        {
          expected: expectedWebClientId,
          actual: clientId,
        }
      );
    }
  } catch (e) {
    // no-op
  }
}

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId || ""}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
