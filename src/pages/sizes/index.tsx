import { Box, Button, Container, Group, Title } from "@mantine/core";
import { IconTicket } from "@tabler/icons-react";
import { CreateFormSizeModal } from "./components/create-form-modal";
import { useSizeStore } from "./store";
import { SizesTable } from "./components/sizes-table";

const SizesManagementPage = () => {
  const { size, openFormModal, setOpenFormModal, setSize } = useSizeStore();

  return (
    <Box py="xl" px="md">
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <Title order={2}>Gestión de Tallas</Title>
          <Button
            leftSection={<IconTicket size={16} />}
            onClick={() => setOpenFormModal(true)}
          >
            Crear Talla
          </Button>
        </Group>

        <CreateFormSizeModal
          opened={openFormModal}
          close={() => {
            setOpenFormModal(false);
            setSize(null);
          }}
          defaultValues={
            size
              ? {
                  id: size.id,
                  size: size?.size,
                }
              : undefined
          }
        />

        <SizesTable />
      </Container>
    </Box>
  );
};

export { SizesManagementPage };
