import {
  Anchor,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useLogin } from "./service";
import { FormProvider, useForm } from "react-hook-form";
import { TextInputField } from "../../components/inputs/text-input";
import toast from "react-hot-toast";
import { PasswordInputField } from "../../components/inputs/password-input";
import useAuthStore from "../../store/useAuth";
import { AuthService } from "../../services/auth.service";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      setMessage(data.message || "Enlace enviado a tu correo.");
    } catch {
      setMessage("Ocurrió un error. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Recuperar contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
};

interface LoginFormData {
  email: string;
  password: string;
}

const LoginView = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();
  const { setUser, isAuthenticated } = useAuthStore();

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
    if (!data.email || !data.password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      toast.error("Ingresa un correo electrónico válido");
      return;
    }

    if (data.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
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
      onError: () => {
        toast.error("Error al iniciar sesión, verifica tus datos");
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
export { ForgotPassword };
