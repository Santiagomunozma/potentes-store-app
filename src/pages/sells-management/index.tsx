import { Box, Button, Container, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CreateFormModal } from "./components/create-form-sells";
import { SellsTable } from "./components/sells-table";
import { SellStats } from "./components/sell-stats";

const SellsManagementPage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Box py="xl" px="md">
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <Title order={2}>Gestión de ventas</Title>
          <Button onClick={open}>Registrar venta</Button>
        </Group>

        <CreateFormModal opened={opened} close={close} />

        <SellStats />
        <SellsTable />
      </Container>
    </Box>
  );
};

export default SellsManagementPage;
