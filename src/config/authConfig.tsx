import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "575cc8f8-1e7b-4742-8942-61863ebc61a6",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,   // ✅ FIX
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false,
    loggerOptions: {
      logLevel: LogLevel.Info,
      piiLoggingEnabled: false,
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read", "email", "profile"],
};
