import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Upload from "./pages/Upload";
import Script from "./pages/Script";
import Voice from "./pages/Voice";
import Avatar from "./pages/Avatar";
import Preview from "./pages/Preview";
import Export from "./pages/Export";
import NotFound from "./pages/NotFound";
import { Auth } from "./pages/Auth";
import { msalConfig } from "./config/authConfig";
import { PublicClientApplication, AccountInfo } from "@azure/msal-browser";

const queryClient = new QueryClient();

const msalInstance = new PublicClientApplication(msalConfig);

// ✅ LocalStorage-based ProtectedRoute (same behavior as MSAL example)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initMSAL = async () => {
      try {
        await msalInstance.initialize();

        // Check redirect response
        const response = await msalInstance.handleRedirectPromise();
        if (response && response.account) {
          setAccount(response.account);
        } else {
          // Check cached accounts
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        }
      } catch (error) {
        console.error("MSAL init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initMSAL();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!account) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/auth" element={<Auth />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/script"
            element={
              <ProtectedRoute>
                <Script />
              </ProtectedRoute>
            }
          />

          <Route
            path="/voice"
            element={
              <ProtectedRoute>
                <Voice />
              </ProtectedRoute>
            }
          />

          <Route
            path="/avatar"
            element={
              <ProtectedRoute>
                <Avatar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/preview"
            element={
              <ProtectedRoute>
                <Preview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/export"
            element={
              <ProtectedRoute>
                <Export />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
