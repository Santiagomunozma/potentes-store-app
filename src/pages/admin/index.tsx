import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Card,
  Container,
  SimpleGrid,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { AreaChart } from "@mantine/charts";
import { getAdminOverview } from "./service";
import { formatCurrency } from "../../utils/format";

const AdminHomePage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
  });

  if (isLoading) {
    return (
      <Container py="xl">
        <Text>Cargando panel...</Text>
      </Container>
    );
  }

  if (isError || !data) {
    return (
      <Container py="xl">
        <Text c="red">No se pudo cargar el panel.</Text>
      </Container>
    );
  }

  const cards = [
    { label: "Ventas del mes", value: String(data.monthSales) },
    { label: "Ingresos del mes", value: formatCurrency(data.monthRevenue) },
    { label: "Productos activos", value: String(data.activeProducts) },
    { label: "Stock bajo", value: String(data.lowStock) },
  ];

  return (
    <Box py="xl" px="md">
      <Container size="xl">
        <Title order={2} mb="xl">
          Panel
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
          {cards.map((card) => (
            <Card key={card.label} withBorder>
              <Text size="sm" c="dimmed">
                {card.label}
              </Text>
              <Text fw={700} size="xl">
                {card.value}
              </Text>
            </Card>
          ))}
        </SimpleGrid>

        <Card withBorder mb="xl">
          <Text fw={600} mb="sm">
            Ingresos de los últimos 30 días
          </Text>
          <AreaChart
            h={280}
            data={data.dailyRevenue}
            dataKey="date"
            series={[{ name: "ingresos", color: "blue.6" }]}
            curveType="linear"
          />
        </Card>

        <Card withBorder>
          <Text fw={600} mb="sm">
            Productos más vendidos
          </Text>
          {data.topProducts.length === 0 ? (
            <Text c="dimmed">Todavía no hay ventas.</Text>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Producto</Table.Th>
                  <Table.Th>Unidades</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.topProducts.map((product) => (
                  <Table.Tr key={product.name}>
                    <Table.Td>{product.name}</Table.Td>
                    <Table.Td>{product.quantity}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Card>
      </Container>
    </Box>
  );
};

export { AdminHomePage };
