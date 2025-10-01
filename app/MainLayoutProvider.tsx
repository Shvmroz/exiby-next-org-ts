'use client';

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppProvider, useAppContext } from "../src/contexts/AppContext";
import { CustomSnackbarProvider } from "../src/components/ui/custom-snackbar";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Spinner from "../src/components/ui/spinner";
import MainLayout from "../src/layout/MainLayout";
import LoginPage from "../src/pages/Login/LoginPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0077ED",
      dark: "#0066CC",
      light: "#4A9AFF",
    },
    secondary: {
      main: "#6B7280",
      dark: "#374151",
      light: "#9CA3AF",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

interface MainLayoutProviderProps {
  children: React.ReactNode;
}

function AuthWrapper({ children }: MainLayoutProviderProps) {
  const { isAuthenticated, loading } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ["/login"];
  const isPublicRoute = pathname ? publicRoutes.includes(pathname) : false;


  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }
      
      // If authenticated and on login page, redirect to dashboard
      if (isAuthenticated && pathname === "/login") {
        router.replace("/dashboard");
        return;
      }
      
      // If authenticated and on root, redirect to dashboard
      if (isAuthenticated && pathname === "/") {
        router.replace("/dashboard");
        return;
      }
    }
  }, [isAuthenticated, loading, pathname, router]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show main layout for authenticated users
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}

export default function MainLayoutProvider({ children }: MainLayoutProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <CustomSnackbarProvider>
        <CssBaseline />
        <AppProvider>
          <AuthWrapper>
            {children}
          </AuthWrapper>
        </AppProvider>
      </CustomSnackbarProvider>
    </ThemeProvider>
  );
}
