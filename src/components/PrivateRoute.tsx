import { PublicClientApplication, AccountInfo } from "@azure/msal-browser";
import { msalConfig } from "@/config/authConfig";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const msalInstance = new PublicClientApplication(msalConfig);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof (msalInstance as any).initialize === "function") {
          await (msalInstance as any).initialize();
        }

        const response = await msalInstance.handleRedirectPromise();

        let acc = response?.account;
        if (!acc) {
          const accounts = msalInstance.getAllAccounts();
          acc = accounts.length > 0 ? accounts[0] : null;
        }

        if (acc) {
          localStorage.setItem("authUser", JSON.stringify(acc));
        }

        setAccount(acc);
      } catch (e) {
        console.error("ProtectedRoute error:", e);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!account) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
