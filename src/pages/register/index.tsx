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
import { SelectField } from "../../components/inputs/select-input";
import { FormProvider, useForm } from "react-hook-form";
import { TextInputField } from "../../components/inputs/text-input";
import { PasswordInputField } from "../../components/inputs/password-input";
import { useCreateUser } from "./service";
import toast from "react-hot-toast";

interface RegisterFormData {
  userType: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  password: string;
  confirmPassword: string;
  identificationType: string;
  identificationNumber: string;
  customer: {
    address: string;
  };
}

const RegisterForm = () => {
  const { mutate: createUser, isPending } = useCreateUser();
  const navigate = useNavigate();

  const methods = useForm<RegisterFormData>({
    defaultValues: {
      userType: "Customer",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      identificationType: "",
      identificationNumber: "",
      customer: {
        address: "",
      },
    },
    mode: "onChange",
  });
  const onSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      methods.setError("confirmPassword", {
        message: "Las contraseñas no coinciden",
      });
      return;
    }
    createUser(data, {
      onSuccess: () => {
        navigate({ to: "/login" });
        toast.success("Usuario creado correctamente");
      },
      onError: () => {
        toast.error("Error al crear usuario");
      },
    });
  };

  return (
    <Box style={{ display: "flex", alignItems: "center" }}>
      <Container>
        <Paper withBorder shadow="md" p="xl" radius="md">
          <Stack>
            <Title order={2} fw={900} ta="center" mb="xs">
              Crea tu cuenta
            </Title>
            <Text c="gray.5" ta="center">
              Únete a <strong>POTENTES</strong> y recibe acceso a lanzamientos
              exclusivos.
            </Text>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Stack>
                  <TextInputField
                    control={methods.control}
                    name="firstName"
                    label="Nombre "
                    placeholder="Ej. Laura"
                    required
                    radius="md"
                    size="md"
                  />

                  <TextInputField
                    control={methods.control}
                    name="lastName"
                    label="Apellido"
                    placeholder="Ej. Mendoza"
                    required
                    radius="md"
                    size="md"
                  />

                  <TextInputField
                    control={methods.control}
                    name="email"
                    label="Correo electrónico"
                    placeholder="ejemplo@correo.com"
                    required
                    radius="md"
                    size="md"
                  />

                  <TextInputField
                    control={methods.control}
                    name="customer.address"
                    label="Dirección"
                    placeholder="Ej. Calle 123, Ciudad, País"
                    required
                    radius="md"
                    size="md"
                  />

                  <TextInputField
                    control={methods.control}
                    name="phone"
                    label="Teléfono"
                    placeholder="Ej. 9999999999"
                    required
                    radius="md"
                    size="md"
                  />

                  <PasswordInputField
                    control={methods.control}
                    name="password"
                    label="Contraseña"
                    placeholder="••••••••"
                    required
                    radius="md"
                    size="md"
                  />

                  <PasswordInputField
                    control={methods.control}
                    name="confirmPassword"
                    label="Confirmar contraseña"
                    placeholder="••••••••"
                    required
                    radius="md"
                    size="md"
                  />

                  <SelectField
                    name="identificationType"
                    control={methods.control}
                    options={[
                      { value: "CC", label: "Cédula de ciudadanía" },
                      { value: "PP", label: "Pasaporte" },
                      { value: "TI", label: "Tarjeta de identidad" },
                    ]}
                    label="Tipo de identificación"
                    placeholder="Selecciona un tipo de identificación"
                    required
                    radius="md"
                    size="md"
                  />

                  <TextInputField
                    control={methods.control}
                    name="identificationNumber"
                    label="Número de identificación"
                    placeholder="Ej. 1234567890"
                    required
                    radius="md"
                    size="md"
                  />

                  <Button
                    loading={isPending}
                    size="md"
                    radius="md"
                    fullWidth
                    mt="md"
                    type="submit"
                  >
                    Registrarme
                  </Button>

                  <Text size="sm" ta="center" c="gray.5" mt="md">
                    ¿Ya tienes cuenta?{" "}
                    <Anchor onClick={() => navigate({ to: "/login" })} fw={500}>
                      Inicia sesión
                    </Anchor>
                  </Text>
                </Stack>
              </form>
            </FormProvider>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export { RegisterForm };
export type { RegisterFormData };
