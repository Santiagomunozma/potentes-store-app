import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "../app/routes";
import { shadcnCssVariableResolver } from "../../cssVariableResolver";
import { shadcnTheme } from "../../theme";
import "../assets/styles/style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import useAuthStore from "../store/useAuth";
import { AuthService } from "../services/auth.service";

const queryClient = new QueryClient();

const Providers = () => {
  const { setUser, finishHydration } = useAuthStore();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      finishHydration();
      return;
    }

    AuthService.getProfile()
      .then((profileData) => {
        setUser(profileData);
      })
      .catch(() => {
        AuthService.logout();
        finishHydration();
      });
  }, [setUser, finishHydration]);

  return (
    <QueryClientProvider client={queryClient}>
      {" "}
      <MantineProvider
        theme={shadcnTheme}
        cssVariablesResolver={shadcnCssVariableResolver}
      >
        <Notifications />
        <Toaster />
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  );
};

export { Providers };
