import {
  Alert,
  Anchor,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLogin } from "./service";
import { FormProvider, useForm } from "react-hook-form";
import { TextInputField } from "../../components/inputs/text-input";
import toast from "react-hot-toast";
import { PasswordInputField } from "../../components/inputs/password-input";
import useAuthStore from "../../store/useAuth";
import { AuthService } from "../../services/auth.service";

interface LoginFormData {
  email: string;
  password: string;
}

const loginFailureMessage = (error: unknown) => {
  if (!axios.isAxiosError(error) || !error.response) {
    return "No se pudo conectar con el servidor. Revisa que la tienda y la API estén encendidas.";
  }

  if (error.response.status === 401) {
    return "Correo o contraseña incorrectos.";
  }

  const apiMessage = error.response.data?.error;
  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage;
  }

  return "No se pudo iniciar sesión. Intenta de nuevo.";
};

const LoginView = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();
  const { setUser, isAuthenticated } = useAuthStore();
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  const methods = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormData) => {
    setLoginError("");

    if (!data.email || !data.password) {
      setLoginError("Completa el correo y la contraseña.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setLoginError("Ingresa un correo electrónico válido.");
      return;
    }

    if (data.password.length < 6) {
      setLoginError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    login(data, {
      onSuccess: (data) => {
        toast.success("Inicio de sesión exitoso");
        // Primero guardamos la información básica del usuario
        setUser(data.data.user);
        // Guardamos el token de acceso
        AuthService.setToken(data.data.token);

        // Obtenemos el perfil completo del usuario incluyendo los datos de employee si aplica
        AuthService.getProfile()
          .then((profileData) => {
            // Actualizamos el estado con los datos completos
            setUser(profileData);

            // Redirección según el tipo de usuario
            if (profileData.userType === "Employee") {
              // Si es admin, redirigir a la sección de usuarios
              if (profileData.employee?.employeeType === "Admin") {
                navigate({ to: "/users" });
              }
              // Si es un empleado normal, redirigir a gestión de productos
              else if (profileData.employee?.employeeType === "Employee") {
                navigate({ to: "/products-management" });
              }
              // Por defecto, redirigir a la gestión de productos
              else {
                navigate({ to: "/products-management" });
              }
            } else {
              // Si es cliente, redirigir al inicio
              navigate({ to: "/" });
            }
          })
          .catch((error) => {
            console.error("Error fetching profile:", error);
            navigate({ to: "/" });
          });
      },
      onError: (error) => {
        const message = loginFailureMessage(error);
        setLoginError(message);
        toast.error(message);
      },
    });
  };

  return (
    <Box h="100vh" style={{ display: "flex", alignItems: "center" }}>
      <Container>
        <Paper withBorder shadow="md" p="xl" radius="md">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Stack>
                <Title order={2} fw={900} ta="center" mb="xs">
                  Inicia Sesión
                </Title>
                <Text c="gray.5" ta="center">
                  Bienvenido de nuevo a <strong>POTENTES</strong>. Ingresa tus
                  datos para continuar.
                </Text>

                {loginError && (
                  <Alert
                    color="red"
                    icon={<IconAlertCircle size={18} />}
                    title="No pudimos iniciar sesión"
                  >
                    {loginError}
                  </Alert>
                )}

                <TextInputField
                  control={methods.control}
                  name="email"
                  label="Correo electrónico"
                  placeholder="ejemplo@correo.com"
                  radius="md"
                  size="md"
                  withAsterisk
                />

                <PasswordInputField
                  control={methods.control}
                  name="password"
                  label="Contraseña"
                  placeholder="••••••••"
                  radius="md"
                  size="md"
                  withAsterisk
                />

                <Button
                  size="md"
                  radius="md"
                  fullWidth
                  type="submit"
                  loading={isPending}
                >
                  Iniciar sesión
                </Button>

                <Text size="sm" ta="center" c="gray.5" mt="md">
                  ¿No tienes cuenta?{" "}
                  <Anchor
                    onClick={() => navigate({ to: "/register" })}
                    fw={500}
                  >
                    Crea una ahora
                  </Anchor>
                </Text>
              </Stack>
            </form>
          </FormProvider>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginView;
