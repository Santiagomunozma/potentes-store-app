import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Paper,
  Text,
  Divider,
  Group,
  Badge,
  Skeleton,
  Alert,
  Stack,
  Accordion,
  Card,
  Image,
  Box,
  Flex,
  Space,
} from "@mantine/core";
import { SellsService } from "../../services/sells.service";
import { Sell } from "../../types/sells";
import {
  IconAlertCircle,
  IconPackage,
  IconShoppingBag,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

// Función local para formatear moneda, evitando problemas de importación
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Interfaz adaptada a la estructura real que devuelve la API
interface ProductSellDetail {
  id: string;
  productId: string;
  sellId: string;
  quantity: number;
  colorId: string;
  sizeId: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    sku: string;
    status: string;
  };
  color: {
    id: string;
    color: string;
  };
  size: {
    id: string;
    size: string;
  };
}

interface EmployeeInfo {
  id: string;
  userId: string;
  name: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiPurchaseResponse {
  id: string;
  customerId: string;
  customer: {
    id: string;
    userId: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  };
  employeeId?: string;
  employee?: EmployeeInfo | null;
  totalPrice: number;
  productSells: ProductSellDetail[];
  createdAt: string;
  updatedAt: string;
  status?: "completed" | "pending" | "cancelled";
  orderNumber?: string;
}

interface PurchaseDetail extends Omit<Sell, "products"> {
  productSells: ProductSellDetail[];
  customer: {
    id: string;
    userId: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
  };
  employee: EmployeeInfo | null;
}

export function PurchaseHistory() {
  const [purchases, setPurchases] = useState<PurchaseDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 576px)");
  const isXsMobile = useMediaQuery("(max-width: 375px)");

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        setLoading(true);
        const response = await SellsService.getUserPurchaseHistory();
        // Convertir las fechas de string a Date y asegurar la estructura correcta
        const purchasesWithDates = (
          (response?.data || []) as unknown as ApiPurchaseResponse[]
        ).map((purchase) => ({
          ...purchase,
          customer: {
            ...purchase.customer,
            createdAt: new Date(purchase.customer.createdAt),
            updatedAt: new Date(purchase.customer.updatedAt),
          },
          createdAt: new Date(purchase.createdAt),
          updatedAt: new Date(purchase.updatedAt),
        }));
        setPurchases(purchasesWithDates as unknown as PurchaseDetail[]);
        setError(null);
      } catch (err) {
        setError(
          "No se pudo cargar el historial de compras. Intente nuevamente más tarde."
        );
        console.error("Error al obtener historial de compras:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "green";
      case "pending":
        return "yellow";
      case "cancelled":
        return "red";
      default:
        return "blue";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Title order={2} mb="lg">
          Historial de Compras
        </Title>
        <Stack>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={150} radius="md" mb="md" />
          ))}
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Title order={2} mb="lg">
          Historial de Compras
        </Title>
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!purchases || purchases.length === 0) {
    return (
      <Container size="lg" py="xl">
        <Title order={2} mb="lg">
          Historial de Compras
        </Title>
        <Paper p="xl" withBorder>
          <Group justify="center" gap="md">
            <IconShoppingBag size={48} stroke={1.5} />
            <Text size="lg" fw={500}>
              No tienes compras realizadas
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              Cuando realices compras, aparecerán en esta sección
            </Text>
          </Group>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl" px={isMobile ? "xs" : "md"}>
      <Title order={2} mb="lg">
        Historial de Compras
      </Title>

      <Stack gap="md">
        {purchases.map((purchase) => (
          <Accordion key={purchase.id || "unknown"} radius="md">
            <Accordion.Item value={purchase.id || "unknown"}>
              <Accordion.Control>
                <Group
                  justify="apart"
                  mb="xs"
                  wrap="nowrap"
                  w="100%"
                  style={
                    isMobile
                      ? {
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: "8px",
                        }
                      : undefined
                  }
                >
                  <Group wrap="nowrap">
                    <IconShoppingBag size={20} />
                    <div>
                      <Text fw={600}>
                        Pedido #{purchase.id?.slice(0, 8) || "N/A"}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {formatDate(purchase.createdAt)}
                      </Text>
                    </div>
                  </Group>
                  <Group gap="xs">
                    <Badge color={getStatusBadgeColor(purchase.status)}>
                      {purchase.status || "completed"}
                    </Badge>
                    <Text fw={600}>
                      {formatCurrency(purchase.totalPrice || 0)}
                    </Text>
                  </Group>
                </Group>
              </Accordion.Control>

              <Accordion.Panel>
                <Divider mb="md" />

                <Box mb="md">
                  <Group
                    justify="apart"
                    wrap="nowrap"
                    w="100%"
                    style={
                      isMobile
                        ? {
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "8px",
                          }
                        : undefined
                    }
                  >
                    <Group gap="xs">
                      <IconPackage size={18} />
                      <Text fw={600}>Productos</Text>
                    </Group>
                    <Text
                      size="sm"
                      c="dimmed"
                      style={{ wordBreak: "break-word" }}
                      maw="100%"
                    >
                      Enviado a:{" "}
                      {purchase.customer?.address || "Dirección no disponible"}
                    </Text>
                  </Group>
                </Box>

                <Stack gap="md">
                  {(purchase.productSells || []).map((productSell, index) => (
                    <Card key={index} p="md" withBorder shadow="sm" radius="md">
                      <Flex
                        gap="md"
                        style={
                          isXsMobile ? { flexDirection: "column" } : undefined
                        }
                      >
                        <Box style={{ minWidth: 100, minHeight: 100 }}>
                          {productSell.product?.imageUrl ? (
                            <Image
                              src={productSell.product.imageUrl}
                              alt={productSell.product?.name || "Producto"}
                              height={100}
                              width={100}
                              fit="cover"
                              radius="md"
                            />
                          ) : (
                            <Flex
                              h={100}
                              w={100}
                              bg="gray.1"
                              align="center"
                              justify="center"
                              style={{ borderRadius: "8px" }}
                            >
                              <IconPackage
                                size={40}
                                color="gray"
                                opacity={0.3}
                              />
                            </Flex>
                          )}
                        </Box>

                        <Box
                          style={{
                            flex: 1,
                            marginTop: isXsMobile ? "12px" : 0,
                          }}
                        >
                          <Group
                            justify="apart"
                            mb="xs"
                            align="flex-start"
                            style={
                              isXsMobile
                                ? {
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                  }
                                : undefined
                            }
                          >
                            <Text
                              fw={700}
                              size="md"
                              lineClamp={1}
                              style={{ maxWidth: isXsMobile ? "100%" : "70%" }}
                            >
                              {productSell.product?.name ||
                                "Producto sin nombre"}
                            </Text>
                            <Text fw={700} c="primary">
                              {formatCurrency(productSell.totalPrice || 0)}
                            </Text>
                          </Group>

                          <Group gap="xs" mb="xs" style={{ flexWrap: "wrap" }}>
                            <Badge size="sm" color="blue" variant="light">
                              {productSell.color?.color || "N/A"}
                            </Badge>
                            <Badge size="sm" color="teal" variant="light">
                              Talla {productSell.size?.size || "N/A"}
                            </Badge>
                            <Badge size="sm" color="gray" variant="outline">
                              SKU: {productSell.product?.sku || "N/A"}
                            </Badge>
                          </Group>

                          <Group
                            mt="md"
                            justify="apart"
                            style={
                              isXsMobile
                                ? {
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    gap: "4px",
                                  }
                                : undefined
                            }
                          >
                            <Text size="sm" c="dimmed">
                              Precio unitario:{" "}
                              {formatCurrency(productSell.product?.price || 0)}
                            </Text>
                            <Text size="sm" fw={500}>
                              Cantidad: {productSell.quantity || 0}
                            </Text>
                          </Group>
                        </Box>
                      </Flex>
                    </Card>
                  ))}
                </Stack>

                <Flex
                  justify="flex-end"
                  mt="xl"
                  style={isMobile ? { width: "100%" } : undefined}
                >
                  <Card
                    withBorder
                    shadow="sm"
                    p="md"
                    radius="md"
                    style={{ width: isMobile ? "100%" : "auto" }}
                  >
                    <Group
                      gap={isMobile ? "xl" : "lg"}
                      style={
                        isMobile
                          ? { justifyContent: "space-between" }
                          : undefined
                      }
                    >
                      <Stack gap={0}>
                        <Text size="sm" c="dimmed">
                          Subtotal:
                        </Text>
                        <Text size="sm" c="dimmed">
                          Envío:
                        </Text>
                        <Space h={4} />
                        <Text fw={700} size="lg">
                          Total:
                        </Text>
                      </Stack>
                      <Stack gap={0} align="flex-end">
                        <Text size="sm">
                          {formatCurrency(purchase.totalPrice || 0)}
                        </Text>
                        <Text size="sm">Gratis</Text>
                        <Space h={4} />
                        <Text fw={700} size="lg" c="primary">
                          {formatCurrency(purchase.totalPrice || 0)}
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        ))}
      </Stack>
    </Container>
  );
}
