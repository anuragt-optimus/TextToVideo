import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { msalConfig, loginRequest } from "@/config/authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

export const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        if (typeof (msalInstance as any).initialize === "function") {
          await (msalInstance as any).initialize();
        }

        console.log("--------Auth - Handling redirect promise...");
        const response = await msalInstance.handleRedirectPromise();
        console.log("--------Auth - Redirect response:", response);

        let account = response?.account;
        if (!account) {
          const accounts = msalInstance.getAllAccounts();
          console.log("--------Auth - Stored accounts:", accounts);
          account = accounts.length > 0 ? accounts[0] : null;
        }

        console.log("--------Auth - Final account:", account);

        // 4. If we have an account, store it and navigate
        if (account) {
          console.log("--------Auth - Account found, storing and navigating...");
          localStorage.setItem("authUser", JSON.stringify(account));

          // Clean up URL hash after successful redirect
          if (window.location.hash && window.location.hash.includes("code=")) {
            try {
              window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
            } catch (e) {
              // ignore
            }
          }

          // Navigate to home (will be caught by ProtectedRoute)
          navigate("/", { replace: true });
        }
      } catch (err) {
        console.error("--------Auth - Error in handleAuthRedirect:", err);
      }
    };

    handleAuthRedirect();
  }, [navigate]);


    const handleLogin = async () => {
      setIsLoading(true);
      try {
        // guard initialize (may not exist)
        if (typeof (msalInstance as any).initialize === "function") {
          await (msalInstance as any).initialize();
        }

        // Only logout if accounts exist and logoutPopup is available
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0 && typeof (msalInstance as any).logoutPopup === "function") {
          await (msalInstance as any).logoutPopup();
        }

        // Trigger redirect login
        await msalInstance.loginRedirect(loginRequest);
      } catch (error: any) {
        console.error("Login error:", error);
        toast({
          title: "Login Failed",
          description: error.message || "Unable to start Microsoft login flow.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mx-auto mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 16L15 19L20 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <CardTitle>Text To Video Agent</CardTitle>
          <CardDescription>Sign in with your Microsoft account</CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in with Microsoft"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
