import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "ac8e92eb-3d40-4d34-b0fd-d1ef10ab9227",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
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
