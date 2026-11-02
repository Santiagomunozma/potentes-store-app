import {
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Menu,
  Modal,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { useGetSell } from "./service";
import dayjs from "dayjs";
import { formatCurrency } from "../../../../utils/format";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { potentesApi } from "../../../../utils/api";
import toast from "react-hot-toast";
import { downloadInvoice, statusLabel } from "../../invoice";

type SaleRow = {
  id: string;
  customerId: string;
  totalPrice: number;
  couponCode?: string | null;
  status?: string;
  createdAt?: string;
  customer?: { user?: { firstName?: string; lastName?: string } };
  productSells?: {
    quantity: number;
    totalPrice: number;
    product?: { name?: string };
    color?: { color?: string };
    size?: { size?: string };
  }[];
};

const SellsTable = () => {
  const { data: sales, error, isSuccess, isError } = useGetSell();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SaleRow | null>(null);
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["sells"] });
  };

  const changeStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await potentesApi.patch(`/sells/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success("Estado actualizado");
      refresh();
      setSelected(null);
    },
    onError: () => toast.error("No se pudo cambiar el estado"),
  });

  const cancelSale = useMutation({
    mutationFn: async (id: string) => {
      await potentesApi.post(`/sells/${id}/cancel`);
    },
    onSuccess: () => {
      toast.success("Venta anulada y stock devuelto");
      refresh();
      setSelected(null);
    },
    onError: () => toast.error("No se pudo anular la venta"),
  });

  if (isError) {
    return <Text c="red">Error: {error.message}</Text>;
  }

  if (isSuccess) {
    const rows = (sales.data as SaleRow[]).filter((sale) => {
      const name = sale.customer?.user
        ? `${sale.customer.user.firstName || ""} ${sale.customer.user.lastName || ""}`
        : sale.customerId;
      const haystack = `${name} ${sale.id}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });

    return (
      <Stack>
        <TextInput
          placeholder="Buscar por cliente o id"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <Card withBorder shadow="none" bg="white">
          <Table highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Cliente</Table.Th>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Productos</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((sale) => (
                <Table.Tr key={sale.id}>
                  <Table.Td>{sale.id.slice(0, 8)}</Table.Td>
                  <Table.Td>
                    {sale.customer?.user
                      ? `${sale.customer.user.firstName} ${sale.customer.user.lastName}`.trim()
                      : sale.customerId}
                  </Table.Td>
                  <Table.Td>
                    {sale.createdAt
                      ? dayjs(sale.createdAt).format("DD/MM/YYYY")
                      : ""}
                  </Table.Td>
                  <Table.Td>
                    <Badge color={sale.status === "cancelled" ? "red" : "blue"}>
                      {statusLabel[sale.status || "paid"] || sale.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{sale.productSells?.length || 0} productos</Table.Td>
                  <Table.Td>{formatCurrency(sale.totalPrice)}</Table.Td>
                  <Table.Td>
                    <Menu shadow="md" position="bottom-end" withArrow>
                      <Menu.Target>
                        <Button variant="subtle" size="xs" px={6}>
                          <IconDotsVertical size={16} />
                        </Button>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item onClick={() => setSelected(sale)}>
                          Detalles
                        </Menu.Item>
                        <Menu.Item onClick={() => downloadInvoice(sale)}>
                          Factura
                        </Menu.Item>
                        <Menu.Item
                          color="red"
                          disabled={sale.status === "cancelled"}
                          onClick={() => cancelSale.mutate(sale.id)}
                        >
                          Anular
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        <Modal
          opened={!!selected}
          onClose={() => setSelected(null)}
          title="Detalle de la venta"
          centered
          size="lg"
        >
          {selected && (
            <Stack>
              <Text>
                Cliente:{" "}
                {selected.customer?.user
                  ? `${selected.customer.user.firstName} ${selected.customer.user.lastName}`
                  : selected.customerId}
              </Text>
              <Text>Cupón: {selected.couponCode || "Ninguno"}</Text>
              <Select
                label="Estado"
                value={selected.status || "paid"}
                disabled={selected.status === "cancelled"}
                data={[
                  { value: "paid", label: "Pagado" },
                  { value: "preparing", label: "Preparando" },
                  { value: "shipped", label: "Enviado" },
                ]}
                onChange={(value) => {
                  if (value) {
                    changeStatus.mutate({ id: selected.id, status: value });
                  }
                }}
              />
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Producto</Table.Th>
                    <Table.Th>Talla</Table.Th>
                    <Table.Th>Color</Table.Th>
                    <Table.Th>Cant.</Table.Th>
                    <Table.Th>Subtotal</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {(selected.productSells || []).map((line, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{line.product?.name}</Table.Td>
                      <Table.Td>{line.size?.size}</Table.Td>
                      <Table.Td>{line.color?.color}</Table.Td>
                      <Table.Td>{line.quantity}</Table.Td>
                      <Table.Td>{formatCurrency(line.totalPrice)}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Group justify="space-between">
                <Text fw={700}>Total {formatCurrency(selected.totalPrice)}</Text>
                <Button
                  variant="default"
                  onClick={() => downloadInvoice(selected)}
                >
                  Descargar factura
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </Stack>
    );
  }

  return (
    <Stack align="center" justify="center" py="xl">
      <Loader size="lg" color="green" />
      <Text>Cargando ventas...</Text>
    </Stack>
  );
};

export { SellsTable };
