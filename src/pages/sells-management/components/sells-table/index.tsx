import {
  Button,
  Card,
  Group,
  Loader,
  Menu,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { useGetSell } from "./service";
import dayjs from "dayjs";
import { formatCurrency } from "../../../../utils/format";

const SellsTable = () => {
  const { data: sales, error, isSuccess, isError } = useGetSell();

  if (isError) {
    return <Text c="red">Error: {error.message}</Text>;
  }

  if (isSuccess) {
    return (
      <Card withBorder shadow="none" bg="white">
        <Table highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Cliente</Table.Th>
              <Table.Th>Fecha</Table.Th>
              <Table.Th>Productos</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th align="right"></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sales.data.map((sale) => (
              <Table.Tr key={sale.id}>
                <Table.Td>{sale.id}</Table.Td>
                <Table.Td>
                  <Group>
                    <Text>
                      {sale.customer?.user
                        ? `${sale.customer.user.firstName} ${sale.customer.user.lastName}`.trim()
                        : sale.customerId}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  {sale.createdAt
                    ? dayjs(sale.createdAt).format("DD/MM/YYYY")
                    : ""}
                </Table.Td>
                <Table.Td>
                  {sale.productSells?.length || 0} productos
                  {sale.productSells && (
                    <Text size="xs" c="dimmed">
                      Total:{" "}
                      {sale.productSells.reduce(
                        (sum, product) => sum + product.quantity,
                        0
                      )}{" "}
                      unidades
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>{formatCurrency(sale.totalPrice)}</Table.Td>
                <Table.Td align="right">
                  <Menu shadow="md" position="bottom-end" withArrow>
                    <Menu.Target>
                      <Button variant="subtle" size="xs" px={6}>
                        <IconDotsVertical size={16} />
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item>Detalles</Menu.Item>
                      <Menu.Item>Factura</Menu.Item>
                      <Menu.Item color="red">Anular</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    );
  }
  return (
    <Stack align="center" justify="center" py="xl">
      <Loader size="lg" color="green" />
      <Text>Cargando productos...</Text>
    </Stack>
  );
};

export { SellsTable };
