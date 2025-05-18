import { Box, Button, Container, Group, Title } from "@mantine/core";
import { IconTicket } from "@tabler/icons-react";
import { CreateFormColorModal } from "./components/create-form-modal";
import { ColorsTable } from "./components/colors-table";
import { useColorStore } from "./store";

const ColorsManagementPage = () => {
  const { color, openFormModal, setOpenFormModal, setColor } = useColorStore();

  return (
    <Box py="xl" px="md">
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <Title order={2}>Gestión de Colores</Title>
          <Button
            leftSection={<IconTicket size={16} />}
            onClick={() => setOpenFormModal(true)}
          >
            Crear Color
          </Button>
        </Group>

        <CreateFormColorModal
          opened={openFormModal}
          close={() => {
            setOpenFormModal(false);
            setColor(null);
          }}
          defaultValues={
            color
              ? {
                  id: color.id,
                  color: color?.color,
                }
              : undefined
          }
        />

        <ColorsTable />
      </Container>
    </Box>
  );
};

export { ColorsManagementPage };
