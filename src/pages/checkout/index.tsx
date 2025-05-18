import {
  Box,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Grid,
  useMantineTheme,
  Table,
  Badge,
  Tabs,
  Alert,
  TextInput,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCreditCard,
  IconLogin,
  IconUserPlus,
  IconAlertCircle,
  IconTicket,
} from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import useCartStore from "../../store/useCart";
import useAuthStore from "../../store/useAuth";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TextInputField } from "../../components/inputs/text-input";
import { PasswordInputField } from "../../components/inputs/password-input";
import { SelectField } from "../../components/inputs/select-input";
import { useLogin } from "../login/service";
import { useCreateUser } from "../register/service";
import { AuthService } from "../../services/auth.service";
import toast from "react-hot-toast";
import { RegisterFormData as RegisterFormDataType } from "../register/index";
import { useCreateSell, useValidateCoupon } from "./service";
import { SellsService } from "../../services/sells.service";

// Import types
interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  userType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  identificationType: string;
  identificationNumber: string;
  address: string;
}

const CheckoutView = () => {
  const { cart, subtotal, taxes, total, clearCart } = useCartStore();
  const { user, isAuthenticated, setUser } = useAuthStore();
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>(
    isAuthenticated ? "authenticated" : "login"
  );
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  // Form for login
  const loginMethods = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // Form for register
  const registerMethods = useForm<RegisterFormData>({
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
      address: "",
    },
    mode: "onChange",
  });

  // Login mutation
  const { mutate: login, isPending: isLoginPending } = useLogin();

  // Register mutation
  const { mutate: createUser, isPending: isRegisterPending } = useCreateUser();

  // Create sell mutation
  const { mutate: createSell, isPending: isCreatingSell } = useCreateSell();

  // Coupon validation mutation
  const { mutate: validateCoupon, isPending: isValidatingCoupon } =
    useValidateCoupon();

  // Handle login form submission
  const handleLogin = (data: LoginFormData) => {
    login(data, {
      onSuccess: (response) => {
        toast.success("Inicio de sesión exitoso");
        setUser(response.data.user);
        AuthService.setToken(response.data.token);

        AuthService.getProfile()
          .then((profileData) => {
            setUser(profileData);
            setActiveTab("authenticated");
            setShowAuthOptions(false);
          })
          .catch((error) => {
            console.error("Error fetching profile:", error);
          });
      },
      onError: () => {
        toast.error("Error al iniciar sesión, verifica tus datos");
      },
    });
  };

  // Handle register form submission
  const handleRegister = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      registerMethods.setError("confirmPassword", {
        message: "Las contraseñas no coinciden",
      });
      return;
    }

    // Convert to RegisterFormDataType format with customer object
    const registerData: RegisterFormDataType = {
      userType: data.userType,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      confirmPassword: data.confirmPassword,
      identificationType: data.identificationType,
      identificationNumber: data.identificationNumber,
      address: "",
      customer: {
        address: data.address,
      },
    };

    createUser(registerData, {
      onSuccess: () => {
        toast.success("Registro exitoso");
        // Auto login after registration
        login(
          { email: data.email, password: data.password },
          {
            onSuccess: (loginResponse) => {
              setUser(loginResponse.data.user);
              AuthService.setToken(loginResponse.data.token);
              setActiveTab("authenticated");
              setShowAuthOptions(false);
            },
            onError: () => {
              toast.error("Error al iniciar sesión automáticamente");
              setActiveTab("login");
            },
          }
        );
      },
      onError: () => {
        toast.error("Error al crear usuario");
      },
    });
  };

  const handleValidateCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Por favor ingresa un código de cupón");
      return;
    }

    setCouponError("");

    validateCoupon(couponCode, {
      onSuccess: (coupon) => {
        if (coupon.status === "active") {
          setCouponDiscount(coupon.discount);
          toast.success("¡Cupón aplicado correctamente!");
        } else {
          setCouponError("Cupón no válido o inactivo");
          setCouponDiscount(0);
        }
      },
      onError: (err) => {
        console.error("Error validating coupon:", err);
        setCouponError("Error al validar el cupón");
        setCouponDiscount(0);
      },
    });
  };

  const handleConfirmPayment = () => {
    if (isAuthenticated && user?.customer?.id) {
      setIsProcessingPayment(true);

      const sellData = {
        customerId: user.customer.id,
        totalPrice: total - couponDiscount,
        products: SellsService.formatCartItemsForAPI(cart),
        couponCode: couponDiscount > 0 ? couponCode : undefined,
      };

      createSell(sellData, {
        onSuccess: () => {
          toast.success("¡Compra realizada con éxito!");
          clearCart();
          navigate({ to: "/purchase-success" });
        },
        onError: (error) => {
          setIsProcessingPayment(false);
          console.error("Error al registrar la venta:", error);
          toast.error(
            "Hubo un error al procesar tu compra. Por favor intenta nuevamente."
          );
        },
      });
    } else if (isAuthenticated && !user?.customer?.id) {
      toast.error(
        "Tu cuenta no está configurada como cliente. Por favor contacta a soporte."
      );
    } else {
      setShowAuthOptions(true);
      setActiveTab("login");
      toast.error(
        "Por favor inicia sesión o regístrate para completar la compra"
      );
    }
  };

  // Si el carrito está vacío, mostrar mensaje y botón para ir a productos
  if (cart.length === 0) {
    return (
      <Box py="xl" style={{ minHeight: "100vh" }}>
        <Container size="xl" px="md">
          <Paper shadow="xs" p="lg" radius="md" withBorder>
            <Stack align="center" gap="xl">
              <Title order={2} c={theme.primaryColor}>
                Tu carrito está vacío
              </Title>
              <Text>No tienes productos en tu carrito de compras</Text>
              <Button
                component={Link}
                href="/products"
                leftSection={<IconArrowLeft size={16} />}
                variant="filled"
              >
                Ver productos
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box py="xl" style={{ minHeight: "100vh" }}>
      <Container size="xl" px="md">
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="xl">
              <Paper shadow="xs" p="md" radius="md" withBorder>
                <Title order={2} mb="lg" c={theme.primaryColor}>
                  Productos en el Carrito
                </Title>
                <Table verticalSpacing="md" highlightOnHover withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Producto</Table.Th>
                      <Table.Th>Precio</Table.Th>
                      <Table.Th>Cantidad</Table.Th>
                      <Table.Th>Total</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {cart.map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td>
                          <Stack gap={4}>
                            <Text fw={500}>{item.product.name}</Text>
                            <Group gap={4}>
                              <Badge color="primary" c="white" variant="filled">
                                {item.color.color}
                              </Badge>
                              <Badge color="primary" variant="outline">
                                {item.size.size}
                              </Badge>
                            </Group>
                          </Stack>
                        </Table.Td>
                        <Table.Td>
                          ${item.product.price.toLocaleString("es-CO")}
                        </Table.Td>
                        <Table.Td fw={500}>{item.quantity}</Table.Td>
                        <Table.Td fw={700}>
                          ${item.totalPrice.toLocaleString("es-CO")}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Paper>

              {isAuthenticated && !user?.customer?.id && (
                <Alert
                  title="Cuenta no configurada como cliente"
                  color="red"
                  icon={<IconAlertCircle />}
                >
                  Tu cuenta no tiene la información de cliente necesaria para
                  completar la compra. Por favor contacta a soporte para
                  configurar tu cuenta correctamente.
                </Alert>
              )}

              {/* Customer Information Section with Conditional Rendering */}
              {(showAuthOptions || isAuthenticated) && (
                <Paper shadow="xs" p="md" radius="md" withBorder>
                  <Title order={2} mb="lg" c={theme.primaryColor}>
                    {isAuthenticated
                      ? "Información del Cliente"
                      : "Iniciar sesión para continuar"}
                  </Title>

                  <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List mb="md">
                      {isAuthenticated && (
                        <Tabs.Tab
                          value="authenticated"
                          leftSection={<IconLogin size={14} />}
                        >
                          Mi cuenta
                        </Tabs.Tab>
                      )}

                      {!isAuthenticated && (
                        <>
                          <Tabs.Tab
                            value="login"
                            leftSection={<IconLogin size={14} />}
                          >
                            Iniciar sesión
                          </Tabs.Tab>
                          <Tabs.Tab
                            value="register"
                            leftSection={<IconUserPlus size={14} />}
                          >
                            Registrarse
                          </Tabs.Tab>
                        </>
                      )}
                    </Tabs.List>

                    <Tabs.Panel value="authenticated">
                      {user && (
                        <Stack gap="md">
                          <Grid>
                            <Grid.Col span={6}>
                              <Text fw={500}>Nombre:</Text>
                              <Text>
                                {user.firstName} {user.lastName}
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text fw={500}>Email:</Text>
                              <Text>{user.email}</Text>
                            </Grid.Col>
                          </Grid>
                          <Grid>
                            <Grid.Col span={6}>
                              <Text fw={500}>Teléfono:</Text>
                              <Text>{user.phone}</Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text fw={500}>Identificación:</Text>
                              <Text>
                                {user.identificationType}{" "}
                                {user.identificationNumber}
                              </Text>
                            </Grid.Col>
                          </Grid>
                          {user.customer && (
                            <Grid>
                              <Grid.Col span={12}>
                                <Text fw={500}>Dirección de envío:</Text>
                                <Text>{user.customer.address}</Text>
                              </Grid.Col>
                            </Grid>
                          )}
                        </Stack>
                      )}
                    </Tabs.Panel>

                    <Tabs.Panel value="login">
                      <FormProvider {...loginMethods}>
                        <form onSubmit={loginMethods.handleSubmit(handleLogin)}>
                          <Stack gap="md">
                            <TextInputField
                              control={loginMethods.control}
                              name="email"
                              label="Correo electrónico"
                              placeholder="ejemplo@correo.com"
                              required
                            />

                            <PasswordInputField
                              control={loginMethods.control}
                              name="password"
                              label="Contraseña"
                              placeholder="••••••••"
                              required
                            />

                            <Button
                              size="md"
                              radius="md"
                              type="submit"
                              loading={isLoginPending}
                            >
                              Iniciar sesión
                            </Button>
                          </Stack>
                        </form>
                      </FormProvider>
                    </Tabs.Panel>

                    <Tabs.Panel value="register">
                      <FormProvider {...registerMethods}>
                        <form
                          onSubmit={registerMethods.handleSubmit(
                            handleRegister
                          )}
                        >
                          <Stack gap="md">
                            <Grid>
                              <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInputField
                                  control={registerMethods.control}
                                  name="firstName"
                                  label="Nombre"
                                  placeholder="Ej. Laura"
                                  required
                                />
                              </Grid.Col>
                              <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInputField
                                  control={registerMethods.control}
                                  name="lastName"
                                  label="Apellido"
                                  placeholder="Ej. Mendoza"
                                  required
                                />
                              </Grid.Col>
                            </Grid>

                            <TextInputField
                              control={registerMethods.control}
                              name="email"
                              label="Correo electrónico"
                              placeholder="ejemplo@correo.com"
                              required
                            />

                            <TextInputField
                              control={registerMethods.control}
                              name="phone"
                              label="Teléfono"
                              placeholder="Ej. 9999999999"
                              required
                            />

                            <Grid>
                              <Grid.Col span={{ base: 12, sm: 6 }}>
                                <PasswordInputField
                                  control={registerMethods.control}
                                  name="password"
                                  label="Contraseña"
                                  placeholder="••••••••"
                                  required
                                />
                              </Grid.Col>
                              <Grid.Col span={{ base: 12, sm: 6 }}>
                                <PasswordInputField
                                  control={registerMethods.control}
                                  name="confirmPassword"
                                  label="Confirmar contraseña"
                                  placeholder="••••••••"
                                  required
                                />
                              </Grid.Col>
                            </Grid>

                            <Grid>
                              <Grid.Col span={{ base: 12, sm: 6 }}>
                                <SelectField
                                  name="identificationType"
                                  control={registerMethods.control}
                                  options={[
                                    {
                                      value: "CC",
                                      label: "Cédula de ciudadanía",
                                    },
                                    { value: "PP", label: "Pasaporte" },
                                    {
                                      value: "TI",
                                      label: "Tarjeta de identidad",
                                    },
                                  ]}
                                  label="Tipo de identificación"
                                  placeholder="Selecciona un tipo"
                                  required
                                />
                              </Grid.Col>
                              <Grid.Col span={{ base: 12, sm: 6 }}>
                                <TextInputField
                                  control={registerMethods.control}
                                  name="identificationNumber"
                                  label="Número de identificación"
                                  placeholder="Ej. 1234567890"
                                  required
                                />
                              </Grid.Col>
                            </Grid>

                            <TextInputField
                              control={registerMethods.control}
                              name="address"
                              label="Dirección de envío"
                              placeholder="Calle, número, ciudad, etc."
                              required
                            />

                            <Button
                              size="md"
                              radius="md"
                              type="submit"
                              loading={isRegisterPending}
                            >
                              Registrarse
                            </Button>
                          </Stack>
                        </form>
                      </FormProvider>
                    </Tabs.Panel>
                  </Tabs>
                </Paper>
              )}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Paper
              shadow="xs"
              p="lg"
              radius="md"
              withBorder
              style={{ position: "sticky", top: "1rem" }}
            >
              <Title order={2} mb="lg" c={theme.primaryColor}>
                Resumen de compra
              </Title>
              <Stack gap="md">
                <Group justify="space-between">
                  <Text size="lg">Subtotal:</Text>
                  <Text fw={700} size="lg">
                    ${subtotal.toLocaleString("es-CO")}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="lg">IVA (19%):</Text>
                  <Text fw={700} size="lg">
                    ${taxes.toLocaleString("es-CO")}
                  </Text>
                </Group>
                {couponDiscount > 0 && (
                  <Group justify="space-between">
                    <Text size="lg">Descuento:</Text>
                    <Text fw={700} size="lg" c="green">
                      -${couponDiscount.toLocaleString("es-CO")}
                    </Text>
                  </Group>
                )}
                <Divider />
                <Group justify="space-between">
                  <Text fw={700} size="xl">
                    Total:
                  </Text>
                  <Text fw={700} size="xl" c={theme.primaryColor}>
                    ${(total - couponDiscount).toLocaleString("es-CO")}
                  </Text>
                </Group>

                <Group grow>
                  <TextInput
                    placeholder="Código de cupón"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    error={couponError}
                    rightSection={
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={handleValidateCoupon}
                        loading={isValidatingCoupon}
                        leftSection={<IconTicket size={16} />}
                      >
                        Aplicar
                      </Button>
                    }
                  />
                </Group>

                <Group grow mt="xl">
                  <Button
                    component={Link}
                    href="/cart"
                    variant="outline"
                    leftSection={<IconArrowLeft size={16} />}
                    disabled={isProcessingPayment || isCreatingSell}
                  >
                    Volver al carrito
                  </Button>
                  <Button
                    onClick={handleConfirmPayment}
                    variant="filled"
                    color="primary"
                    rightSection={<IconCreditCard size={16} />}
                    loading={isProcessingPayment || isCreatingSell}
                    disabled={isAuthenticated && !user?.customer?.id}
                  >
                    {isAuthenticated ? "Pagar ahora" : "Continuar"}
                  </Button>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default CheckoutView;
