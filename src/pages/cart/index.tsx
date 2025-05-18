import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {
  IconShoppingCart,
  IconTrash,
  IconArrowRight,
  IconArrowLeft,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import useCartStore from "../../store/useCart";

const CartView = () => {
  const { cart, subtotal, taxes, total, removeFromCart } = useCartStore();
  const theme = useMantineTheme();

  return (
    <Box py="xl">
      <Container size="lg">
        <Paper shadow="xs" p="md" radius="md" withBorder mb="xl">
          <Title order={2} mb="lg" c={theme.primaryColor}>
            Carrito de Compras
          </Title>

          {cart.length === 0 ? (
            <Box py="xl" ta="center">
              <IconShoppingCart size={64} color={theme.colors.gray[4]} />
              <Text c="dimmed" size="lg" mt="md">
                Tu carrito está vacío.
              </Text>
              <Button component={Link} href="/" mt="lg" variant="light">
                Continuar comprando
              </Button>
            </Box>
          ) : (
            <>
              <Table verticalSpacing="md" highlightOnHover withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th></Table.Th>
                    <Table.Th>Precio</Table.Th>
                    <Table.Th>Cnt</Table.Th>
                    <Table.Th>Total</Table.Th>
                    <Table.Th></Table.Th>
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
                      <Table.Td>
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          onClick={() => removeFromCart(item)}
                          radius="xl"
                          title="Eliminar producto"
                        >
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </>
          )}
        </Paper>

        {cart.length > 0 && (
          <Stack w="100%" mt="xl">
            <Stack gap={12}>
              <Group gap={8}>
                <Text size="xl" fw={600} c={theme.primaryColor}>
                  Resumen de la compra
                </Text>
              </Group>
              <Divider color={theme.primaryColor} />
              <Group justify="space-between" align="center">
                <Group gap={8}>
                  <Text size="md">Subtotal:</Text>
                </Group>
                <Text size="md" fw={500}>
                  ${subtotal.toLocaleString("es-CO")}
                </Text>
              </Group>
              <Group justify="space-between" align="center">
                <Group gap={8}>
                  <Text size="md">Impuestos (19%):</Text>
                </Group>
                <Text size="md">${taxes.toLocaleString("es-CO")}</Text>
              </Group>
              <Divider my="sm" color={theme.primaryColor} />
              <Group
                justify="space-between"
                align="center"
                bg={theme.colors[theme.primaryColor][0]}
                p="md"
                style={{ borderRadius: theme.radius.md }}
              >
                <Group gap={8}>
                  <Text size="xl" fw={700} c={theme.primaryColor}>
                    Total:
                  </Text>
                </Group>
                <Text size="xl" fw={700} c={theme.primaryColor}>
                  ${total.toLocaleString("es-CO")}
                </Text>
              </Group>
            </Stack>
            <Group justify="space-between" mt="xl">
              <Button
                component={Link}
                href="/"
                variant="subtle"
                size="sm"
                leftSection={<IconArrowLeft size={18} />}
              >
                Volver
              </Button>
              <Button
                component={Link}
                href="/checkout"
                size="sm"
                radius="md"
                leftSection={<IconShoppingCart size={18} />}
                rightSection={<IconArrowRight size={18} />}
                style={{ minWidth: "200px" }}
              >
                Realizar compra
              </Button>
            </Group>
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default CartView;
